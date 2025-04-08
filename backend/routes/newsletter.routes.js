const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

const newsletterController = {
  subscribe: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if already subscribed
      const [existing] = await db.execute(
        'SELECT * FROM newsletter_subscriptions WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email already subscribed' });
      }

      const [result] = await db.execute(
        'INSERT INTO newsletter_subscriptions (email) VALUES (?)',
        [email]
      );

      res.status(201).json({
        message: 'Subscribed to newsletter successfully',
        subscription_id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  unsubscribe: async (req, res) => {
    try {
      const { email } = req.body;

      await db.execute(
        'UPDATE newsletter_subscriptions SET subscribed = false WHERE email = ?',
        [email]
      );

      res.json({ message: 'Unsubscribed from newsletter successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

module.exports = router; 