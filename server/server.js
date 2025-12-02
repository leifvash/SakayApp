require('dotenv').config({ path: './backend.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());

//  Get wireless IP for frontend config
function getWirelessIP() {
  const nets = os.networkInterfaces();
  const wirelessNames = ['Wi-Fi', 'WiFi', 'WLAN', 'wlan0', 'en0']; // Windows + fallback

  for (const name of wirelessNames) {
    const iface = nets[name];
    if (!iface) continue;

    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return '172.20.10.2'; // fallback
}

const localIP = getWirelessIP();
const PORT = process.env.PORT || 3000;

//  Route schema
const RouteSchema = new mongoose.Schema({
  name: String,
  direction: String,
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true
    },
    coordinates: {
      type: [[Number]],
      required: true
    }
  }
});

//  Connection retry logic
let dbOne = null;
let Routes = null;

const connectWithRetry = () => {
  mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: 'secondaryPreferred' //  Optional: allow reads from secondaries
  })
  .asPromise()
  .then((conn) => {
    console.log('✅ Connected to Routes DB');
    dbOne = conn;
    Routes = dbOne.model('Route', RouteSchema, 'Routes');
  })
  .catch((err) => {
    console.error('❌ Routes DB connection failed:', err.message);
    console.log(' Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

//  Expose dynamic API URL to frontend
app.get('/config', (req, res) => {
  const apiUrl = `http://${localIP}:${PORT}`;
  console.log(`[CONFIG] API_URL resolved to: ${apiUrl}`);
  res.json({ apiUrl });
});

//  Health check
app.get('/health', (req, res) => {
  const status = {
    database: dbOne?.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  };
  console.log(`[HEALTH CHECK] ${status.timestamp} → DB: ${status.database}`);
  res.json(status);
});

//  GET all routes
app.get('/routes', async (req, res) => {
  if (!dbOne || dbOne.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }

  try {
    const routes = await Routes.find();
    console.log(`Routes fetched: ${routes.length}`);
    if (routes.length === 0) {
      return res.status(404).json({ error: 'No routes available' });
    }
    res.json(routes);
  } catch (err) {
    console.error('❌ Route fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

//  GET route by ID
app.get('/routes/:id', async (req, res) => {
  if (!dbOne || dbOne.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }

  try {
    const route = await Routes.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error('❌ Route ID lookup failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

//  Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`🌐 Accessible at: http://${localIP}:${PORT}`);
});