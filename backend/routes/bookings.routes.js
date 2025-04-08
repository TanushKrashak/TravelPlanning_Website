const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../config/db.config');

const bookingsController = {
  createBooking: async (req, res) => {
    try {
      const { package_id, travel_date, num_travelers, total_price } = req.body;
      const user_id = req.user.id;

      const [result] = await db.execute(
        'INSERT INTO bookings (user_id, package_id, travel_date, num_travelers, total_price) VALUES (?, ?, ?, ?, ?)',
        [user_id, package_id, travel_date, num_travelers, total_price]
      );

      res.status(201).json({
        message: 'Booking created successfully',
        booking_id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const [bookings] = await db.execute(
        'SELECT b.*, p.name as package_name, p.destination FROM bookings b JOIN packages p ON b.package_id = p.id WHERE b.user_id = ?',
        [req.user.id]
      );
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

router.post('/', verifyToken, bookingsController.createBooking);
router.get('/my-bookings', verifyToken, bookingsController.getUserBookings);

module.exports = router; 