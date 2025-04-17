const express = require('express');
const router = express.Router();
const destinationModel = require('../models/destination');
const packageModel = require('../models/package');
const reviewModel = require('../models/review');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await destinationModel.getAllDestinations();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get destination with packages and reviews
router.get('/:id', async (req, res) => {
  try {
    const destination = await destinationModel.getDestinationById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const packages = await packageModel.getPackagesByDestination(req.params.id);
    const reviews = await reviewModel.getReviewsByDestination(req.params.id);
    
    res.json({
      ...destination,
      packages,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new destination
router.post('/', async (req, res) => {
  try {
    const { name, country, description, image_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Destination name is required' });
    }
    
    const newDestination = await destinationModel.createDestination({
      name,
      country,
      description,
      image_url
    });
    
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update existing destination
router.put('/:id', async (req, res) => {
  try {
    const { name, country, description, image_url } = req.body;
    const destinationId = req.params.id;
    
    // Check if destination exists
    const existingDestination = await destinationModel.getDestinationById(destinationId);
    if (!existingDestination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    if (!name) {
      return res.status(400).json({ error: 'Destination name is required' });
    }
    
    const updatedDestination = await destinationModel.updateDestination(destinationId, {
      name,
      country,
      description,
      image_url
    });
    
    res.json(updatedDestination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete destination
router.delete('/:id', async (req, res) => {
  try {
    const destinationId = req.params.id;
    
    // Check if destination exists
    const existingDestination = await destinationModel.getDestinationById(destinationId);
    if (!existingDestination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Delete associated packages first (cascade delete)
    await packageModel.deletePackagesByDestination(destinationId);
    
    // Delete the destination
    await destinationModel.deleteDestination(destinationId);
    
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;