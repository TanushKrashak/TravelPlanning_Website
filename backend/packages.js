const express = require('express');
const router = express.Router();
const packageModel = require('../models/package');
const destinationModel = require('../models/destination');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await packageModel.getAllPackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get package by ID
router.get('/:id', async (req, res) => {
  try {
    const package = await packageModel.getPackageById(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new package
router.post('/', async (req, res) => {
  try {
    const { name, destination_id, duration, price, description, image_url } = req.body;
    
    // Validate required fields
    if (!name || !destination_id || !duration || !price) {
      return res.status(400).json({ error: 'Name, destination, duration and price are required' });
    }
    
    // Check if destination exists
    const destination = await destinationModel.getDestinationById(destination_id);
    if (!destination) {
      return res.status(400).json({ error: 'Selected destination does not exist' });
    }
    
    const newPackage = await packageModel.createPackage({
      name,
      destination_id,
      duration,
      price,
      description,
      image_url
    });
    
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update existing package
router.put('/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    const { name, destination_id, duration, price, description, image_url } = req.body;
    
    // Check if package exists
    const existingPackage = await packageModel.getPackageById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    // Validate required fields
    if (!name || !destination_id || !duration || !price) {
      return res.status(400).json({ error: 'Name, destination, duration and price are required' });
    }
    
    // Check if destination exists
    const destination = await destinationModel.getDestinationById(destination_id);
    if (!destination) {
      return res.status(400).json({ error: 'Selected destination does not exist' });
    }
    
    const updatedPackage = await packageModel.updatePackage(packageId, {
      name,
      destination_id,
      duration,
      price,
      description,
      image_url
    });
    
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete package
router.delete('/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    
    // Check if package exists
    const existingPackage = await packageModel.getPackageById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    await packageModel.deletePackage(packageId);
    
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;