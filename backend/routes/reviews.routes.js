const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../config/db.config');

const reviewsController = {
  createReview: async (req, res) => {
    try {
      const { package_id, rating, comment } = req.body;
      const user_id = req.user.id;

      const [result] = await db.execute(
        'INSERT INTO reviews (user_id, package_id, rating, comment) VALUES (?, ?, ?, ?)',
        [user_id, package_id, rating, comment]
      );

      res.status(201).json({
        message: 'Review created successfully',
        review_id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getPackageReviews: async (req, res) => {
    try {
      const [reviews] = await db.execute(
        'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.package_id = ?',
        [req.params.package_id]
      );
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

router.post('/', verifyToken, reviewsController.createReview);
router.get('/package/:package_id', reviewsController.getPackageReviews);

module.exports = router; 