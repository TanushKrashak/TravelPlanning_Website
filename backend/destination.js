const pool = require('../config/database');

// Get all destinations
exports.getAllDestinations = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM destinations');
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get destination by ID
exports.getDestinationById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Create new destination
exports.createDestination = async (destinationData) => {
  const { name, country, description, image_url } = destinationData;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO destinations (name, country, description, image_url) VALUES (?, ?, ?, ?)',
      [name, country, description, image_url]
    );
    
    return { 
      id: result.insertId, 
      name, 
      country, 
      description, 
      image_url 
    };
  } catch (error) {
    throw error;
  }
}

// Update destination
exports.updateDestination = async (id, destinationData) => {
  const { name, country, description, image_url } = destinationData;
  
  try {
    await pool.query(
      'UPDATE destinations SET name = ?, country = ?, description = ?, image_url = ? WHERE id = ?',
      [name, country, description, image_url, id]
    );
    
    return { 
      id: parseInt(id), 
      name, 
      country, 
      description, 
      image_url 
    };
  } catch (error) {
    throw error;
  }
}

// Delete destination
exports.deleteDestination = async (id) => {
  try {
    await pool.query('DELETE FROM destinations WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
}