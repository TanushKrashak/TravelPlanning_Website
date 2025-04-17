const express = require('express');
const router = express.Router();
const reviewModel = require('../models/review');
const destinationModel = require('../models/destination');

// Create new review
router.post('/', async (req, res) => {
  try {
    const { name, email, destination_id, rating, comment } = req.body;
    
    // Validate required fields
    if (!name || !email || !destination_id || !rating) {
      return res.status(400).json({ error: 'Name, email, destination and rating are required' });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if destination exists
    const destination = await destinationModel.getDestinationById(destination_id);
    if (!destination) {
      return res.status(400).json({ error: 'Selected destination does not exist' });
    }
    
    const newReview = await reviewModel.createReview({
      name,
      email,
      destination_id,
      rating,
      comment
    });
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews by destination
router.get('/destination/:id', async (req, res) => {
  try {
    const reviews = await reviewModel.getReviewsByDestination(req.params.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await reviewModel.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await reviewModel.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { name, email, destination_id, rating, comment } = req.body;
    
    // Check if review exists
    const existingReview = await reviewModel.getReviewById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Validate required fields
    if (!name || !email || !destination_id || !rating) {
      return res.status(400).json({ error: 'Name, email, destination and rating are required' });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if destination exists
    const destination = await destinationModel.getDestinationById(destination_id);
    if (!destination) {
      return res.status(400).json({ error: 'Selected destination does not exist' });
    }
    
    const updatedReview = await reviewModel.updateReview(reviewId, {
      name,
      email,
      destination_id,
      rating,
      comment
    });
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    // Check if review exists
    const existingReview = await reviewModel.getReviewById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    await reviewModel.deleteReview(reviewId);
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;