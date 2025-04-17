const pool = require('../config/database');

// Create new review from admin
exports.createReview = async (reviewData) => {
  const { name, email, destination_id, rating, comment } = reviewData;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (name, email, destination_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, destination_id, rating, comment]
    );
    
    return { 
      id: result.insertId, 
      name, 
      email, 
      destination_id, 
      rating, 
      comment,
      review_date: new Date()
    };
  } catch (error) {
    throw error;
  }
}

// Update review
exports.updateReview = async (id, reviewData) => {
  const { name, email, destination_id, rating, comment } = reviewData;
  
  try {
    await pool.query(
      'UPDATE reviews SET name = ?, email = ?, destination_id = ?, rating = ?, comment = ? WHERE id = ?',
      [name, email, destination_id, rating, comment, id]
    );
    
    return { 
      id: parseInt(id), 
      name, 
      email, 
      destination_id, 
      rating, 
      comment 
    };
  } catch (error) {
    throw error;
  }
}

// Delete review
exports.deleteReview = async (id) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
}

// Get review by ID
exports.getReviewById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Get reviews by destination
exports.getReviewsByDestination = async (destinationId) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE destination_id = ? ORDER BY review_date DESC',
      [destinationId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get all reviews with destination name
exports.getAllReviews = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT reviews.*, destinations.name AS destination_name ' +
      'FROM reviews ' +
      'LEFT JOIN destinations ON reviews.destination_id = destinations.id ' +
      'ORDER BY reviews.review_date DESC'
    );
    return rows;
  } catch (error) {
    throw error;
  }
}