const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../config/db.config');

const paymentsController = {
  createPayment: async (req, res) => {
    try {
      const { booking_id, amount, payment_method, transaction_id } = req.body;

      const [result] = await db.execute(
        'INSERT INTO payments (booking_id, amount, payment_method, transaction_id) VALUES (?, ?, ?, ?)',
        [booking_id, amount, payment_method, transaction_id]
      );

      // Update booking status
      await db.execute(
        'UPDATE bookings SET status = ? WHERE id = ?',
        ['confirmed', booking_id]
      );

      res.status(201).json({
        message: 'Payment processed successfully',
        payment_id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getBookingPayments: async (req, res) => {
    try {
      const [payments] = await db.execute(
        'SELECT * FROM payments WHERE booking_id = ?',
        [req.params.booking_id]
      );
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

router.post('/', verifyToken, paymentsController.createPayment);
router.get('/booking/:booking_id', verifyToken, paymentsController.getBookingPayments);

module.exports = router; 