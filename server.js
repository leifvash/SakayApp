const express = require('express');     // Web framework to create API routes
const mongoose = require('mongoose');   // MongoDB connector and schema manager
const cors = require('cors');           // Middleware to allow cross-origin requests

// Initialize Express app
const app = express();

// Enable CORS so React Native app can access API
app.use(cors());

// Enable JSON parsing for incoming requests
app.use(express.json());

// Connect to MongoDB database named 'sakayapp'
mongoose.connect('mongodb://localhost:27017/sakayapp');

// Define the schema for route documents
const RouteSchema = new mongoose.Schema({
  name: String,         // Route name (e.g. "Bulua – Agora Market")
  direction: String,    // Direction (e.g. "Inbound" or "Outbound")
  coordinates: [        // Array of lat/lng points that form the route
    {
      latitude: String,
      longitude: String,
    },
  ],
});

// Create a model named 'Route' that maps to the 'District 1 Routes' collection
// This third argument is required because collection name has spaces and capitalization
const Route = mongoose.model('Route', RouteSchema, 'District 1 Routes');

// Define a GET endpoint to return all routes
app.get('/routes', async (req, res) => {
  const routes = await Route.find();   // Fetch all documents from the collection
  console.log('Fetched routes:', routes); // 👈 Check terminal output
  res.json(routes);                    // Send them back as JSON
});

// Define a GET endpoint to return a specific route by ID
app.get('/routes/:id', async (req, res) => {
  const route = await Route.findById(req.params.id);  // Fetch route by MongoDB _id
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route);                                    // Send it back as JSON
});

// Start the server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'));