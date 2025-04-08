const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../config/db.config');

const customizationsController = {
  createCustomization: async (req, res) => {
    try {
      const { destination, travel_date, num_travelers, requirements } = req.body;
      const user_id = req.user.id;

      const [result] = await db.execute(
        'INSERT INTO customizations (user_id, destination, travel_date, num_travelers, requirements) VALUES (?, ?, ?, ?, ?)',
        [user_id, destination, travel_date, num_travelers, requirements]
      );

      res.status(201).json({
        message: 'Customization request created successfully',
        customization_id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getUserCustomizations: async (req, res) => {
    try {
      const [customizations] = await db.execute(
        'SELECT * FROM customizations WHERE user_id = ?',
        [req.user.id]
      );
      res.json(customizations);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

router.post('/', verifyToken, customizationsController.createCustomization);
router.get('/my-customizations', verifyToken, customizationsController.getUserCustomizations);

module.exports = router; 