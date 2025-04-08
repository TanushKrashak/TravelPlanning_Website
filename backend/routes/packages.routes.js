const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../config/db.config');

// TODO: Add package controller
const packagesController = {
  getAllPackages: async (req, res) => {
    try {
      const [packages] = await db.execute('SELECT * FROM packages');
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  getPackageById: async (req, res) => {
    try {
      const [package] = await db.execute('SELECT * FROM packages WHERE id = ?', [req.params.id]);
      if (package.length === 0) {
        return res.status(404).json({ message: 'Package not found' });
      }
      res.json(package[0]);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

router.get('/', packagesController.getAllPackages);
router.get('/:id', packagesController.getPackageById);

module.exports = router; 