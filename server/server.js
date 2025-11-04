require('dotenv').config({ path: './backend.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to local DB (DistrictOne)
const dbOne = mongoose.createConnection(process.env.MONGODB_URI_ONE);
dbOne.on('connected', () => console.log('✅ Connected to DistrictOne DB'));
dbOne.on('error', (err) => console.error('❌ DistrictOne DB error:', err.message));

// Connect to remote DB (DistrictTwo) only if URI is defined
let dbTwo = null;
let DistrictTwoRoutes = null;

if (process.env.MONGODB_URI_TWO) {
  dbTwo = mongoose.createConnection(process.env.MONGODB_URI_TWO);
  dbTwo.on('connected', () => console.log('✅ Connected to DistrictTwo DB'));
  dbTwo.on('error', (err) => console.error('❌ DistrictTwo DB error:', err.message));
}

// Define route schema
const RouteSchema = new mongoose.Schema({
  name: String,
  direction: String,
  mode: String,
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
const DistrictOneRoutes = dbOne.model('Route', RouteSchema, 'districtOne');
if (dbTwo) {
  DistrictTwoRoutes = dbTwo.model('Route', RouteSchema, 'districtTwo');
}

// Monitor DB status
app.get('/health', (req, res) => {
  const timestamp = new Date().toISOString();

  const status = {
    districtOne: dbOne.readyState === 1 ? 'connected' : 'disconnected',
    districtTwo: dbTwo?.readyState === 1 ? 'connected' : 'disconnected',
    timestamp
  };

  // Output log to terminal
  console.log(`[HEALTH CHECK] ${timestamp}`);
  console.log(`→ DistrictOne: ${status.districtOne}`);
  console.log(`→ DistrictTwo: ${status.districtTwo}`);

  res.json(status);
});

// GET all routes (merged)
app.get('/routes', async (req, res) => {
  let routesOne = [];
  let routesTwo = [];

  try {
    routesOne = await DistrictOneRoutes.find();
    console.log(`DistrictOne routes: ${routesOne.length}`);
  } catch (err) {
    console.error('❌ DistrictOne fetch failed:', err.message);
  }

  if (DistrictTwoRoutes) {
    try {
      routesTwo = await DistrictTwoRoutes.find();
      console.log(`DistrictTwo routes: ${routesTwo.length}`);
    } catch (err) {
      console.error('❌ DistrictTwo fetch failed:', err.message);
    }
  }

  const allRoutes = [...routesOne, ...routesTwo];
  if (allRoutes.length === 0) {
    return res.status(500).json({ error: 'No routes available from either database' });
  }

  res.json(allRoutes);
});

// GET route by ID (search both DBs)
app.get('/routes/:id', async (req, res) => {
  const { id } = req.params;
  let route = null;

  try {
    route = await DistrictOneRoutes.findById(id);
  } catch (err) {
    console.error('❌ DistrictOne ID lookup failed:', err.message);
  }

  if (!route && DistrictTwoRoutes) {
    try {
      route = await DistrictTwoRoutes.findById(id);
    } catch (err) {
      console.error('❌ DistrictTwo ID lookup failed:', err.message);
    }
  }

  if (!route) {
    return res.status(404).json({ error: 'Route not found in either database' });
  }
  res.json(route);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));