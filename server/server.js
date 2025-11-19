require('dotenv').config({ path: './backend.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ip = require('ip');
const localIP = ip.address(); // e.g., 192.168.1.8

// Connect to local DB (DistrictOne)
const dbOne = mongoose.createConnection(process.env.MONGODB_URI_ONE);
dbOne.on('connected', () => console.log('✅ Connected to Routes DB'));
dbOne.on('error', (err) => console.error('❌ Routes DB error:', err.message));

// Connect to remote DB (DistrictTwo) only if URI is defined
let dbTwo = null;
let DistrictTwoRoutes = null;

// Define route schema
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

// Bind models to connections
const Routes = dbOne.model('Route', RouteSchema, 'Routes');
if (dbTwo) {
  DistrictTwoRoutes = dbTwo.model('Route', RouteSchema, 'districtTwo');
}

  // Expose dynamic API URL to frontend
app.get('/config', (req, res) => {
  const apiUrl = `http://${localIP}:${PORT}`;
  console.log(`[CONFIG] API_URL resolved to: ${apiUrl}`);
  res.json({ apiUrl });
});

// Monitor DB status
app.get('/health', (req, res) => {
  const status = {
    database: dbOne.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  };
  console.log(`[HEALTH CHECK] ${status.timestamp} → DB: ${status.database}`);
  res.json(status);
});

// GET all routes (merged)
app.get('/routes', async (req, res) => {
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


// GET route by ID (search both DBs)
app.get('/routes/:id', async (req, res) => {
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible at: http://${localIP}:${PORT}`);
});
