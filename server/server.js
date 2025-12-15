require('dotenv').config({ path: './backend.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

// -------------------- Utility --------------------
function getWirelessIP() {
  const nets = os.networkInterfaces();
  const wirelessNames = ['Wi-Fi', 'WiFi', 'WLAN', 'wlan0', 'en0'];

  for (const name of wirelessNames) {
    const iface = nets[name];
    if (!iface) continue;

    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '168.254.109:3000'; // fallback
}

const localIP = getWirelessIP();
const PORT = process.env.PORT || 3000;

// -------------------- Schemas --------------------
const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  direction: { type: String, required: true },
  district: { type: String },
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true
    },
    coordinates: {
      type: [[Number]], // array of [lng, lat]
      required: true
    }
  }
});
RouteSchema.index({ route: '2dsphere' });

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

// -------------------- DB Connection --------------------
let dbOne = null;
let Routes = null;
let Admin = null;

const connectWithRetry = () => {
  mongoose
    .createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      readPreference: 'secondaryPreferred'
    })
    .asPromise()
    .then(async (conn) => {
      console.log('✅ Connected to MongoDB');
      dbOne = conn;
      Routes = dbOne.model('Route', RouteSchema, 'Routes');
      Admin = dbOne.model('Admin', AdminSchema, 'Admins');

      // Auto-seed admin if env vars present
      const seedUser = process.env.SEED_ADMIN_USER;
      const seedPass = process.env.SEED_ADMIN_PASS;
      if (seedUser && seedPass) {
        const exists = await Admin.findOne({ username: seedUser });
        if (!exists) {
          const hash = await bcrypt.hash(seedPass, 10);
          await Admin.create({ username: seedUser, passwordHash: hash });
          console.log(`👤 Seeded admin "${seedUser}"`);
        } else {
          console.log(`👤 Admin "${seedUser}" already exists — skipping seed`);
        }
      }
    })
    .catch((err) => {
      console.error('❌ DB connection failed:', err.message);
      console.log(' Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// -------------------- Endpoints --------------------


// Config endpoint
app.get('/config', (req, res) => {
  const apiUrl = `http://${localIP}:${PORT}`;
  res.json({ apiUrl });
});

// POST /admin/login → check credentials in DB
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Admin login failed:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /routes → create new route
router.post('/routes', async (req, res) => {
  console.log('Incoming /routes payload:', req.body);
  try {
    const { name, direction, district, coordinates } = req.body;

    if (!name || !direction || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert strings → [lng, lat] numbers
    const parsedCoords = coordinates.map((coord) => {
      const [lng, lat] = coord.split(',').map(Number);
      return [lng, lat];
    });

    const newRoute = new Routes({
      name,
      direction,
      district,
      route: {
        type: 'LineString',
        coordinates: parsedCoords
      }
    });

    await newRoute.save();
    res.status(201).json({ success: true, route: newRoute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.use('/', router);

// PATCH /routes/:id → update route metadata only
router.patch('/routes/:id', async (req, res) => {
  try {
    const { name, direction, district } = req.body;

    const updated = await Routes.findByIdAndUpdate(
      req.params.id,
      { name, direction, district }, // no coordinates
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Route not found' });
    res.json({ success: true, route: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// DELETE /routes/:id
router.delete('/routes/:id', async (req, res) => {
  try {
    const deleted = await Routes.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Route not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

// Health check
app.get('/health', (req, res) => {
  const status = {
    database: dbOne?.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  };
  res.json(status);
});

// Get all routes
app.get('/routes', async (req, res) => {
  if (!dbOne || dbOne.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const routes = await Routes.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get route by ID
app.get('/routes/:id', async (req, res) => {
  if (!dbOne || dbOne.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const route = await Routes.findById(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Recommend route (single or double ride)
app.post('/routes/recommend', async (req, res) => {
  if (!dbOne || dbOne.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }

  const { origin, destination, thresholdMeters = 1000 } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination required' });
  }

  try {
    console.log('🔍 /routes/recommend called with:', origin, destination);

    // Step 1: nearest routes to origin
    const originCandidates = await Routes.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [origin.lng, origin.lat] },
          distanceField: 'originDistance',
          spherical: true
        }
      },
      { $limit: 5 }
    ]);

    // Step 2: single ride check
    for (const r of originCandidates) {
      const destCheck = await Routes.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [destination.lng, destination.lat] },
            distanceField: 'destinationDistance',
            spherical: true,
            query: { _id: r._id }
          }
        }
      ]);
      const hit = destCheck[0];

      if (hit && r.originDistance <= thresholdMeters && hit.destinationDistance <= thresholdMeters * 3) {
        return res.json({
          type: 'single',
          plan: [
            { route: r, originDistance: r.originDistance, destinationDistance: hit.destinationDistance }
          ]
        });
      }
    }

    // Step 3: double ride logic (sample multiple points along route)
    for (const r of originCandidates) {
      const coords = r.route.coordinates;
      const sampleCoords = [coords[0], coords[Math.floor(coords.length / 2)], coords[coords.length - 1]];

      for (const coord of sampleCoords) {
        const transferCandidates = await Routes.aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: coord },
              distanceField: 'transferDistance',
              spherical: true,
              maxDistance: thresholdMeters
            }
          },
          { $limit: 5 }
        ]);

        for (const t of transferCandidates) {
          const destCheck = await Routes.aggregate([
            {
              $geoNear: {
                near: { type: 'Point', coordinates: [destination.lng, destination.lat] },
                distanceField: 'destinationDistance',
                spherical: true,
                query: { _id: t._id }
              }
            }
          ]);
          const hit = destCheck[0];

          if (hit && r.originDistance <= thresholdMeters && hit.destinationDistance <= thresholdMeters * 3) {
            return res.json({
              type: 'double',
              plan: [
                { route: r, originDistance: r.originDistance },
                { route: t, originDistance: t.transferDistance, destinationDistance: hit.destinationDistance }
              ]
            });
          }
        }
      }
    }

    res.status(404).json({ error: 'No route found (single or double)' });
  } catch (err) {
    console.error('❌ Route recommendation failed:', err.message);
    res.status(500).json({ error: 'Failed to recommend route' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible at: http://${localIP}:${PORT}`);
});