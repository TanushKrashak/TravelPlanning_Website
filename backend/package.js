const pool = require('../config/database');

// Get packages by destination
exports.getPackagesByDestination = async (destinationId) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM packages WHERE destination_id = ?', 
      [destinationId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get package by ID
exports.getPackageById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Get all packages
exports.getAllPackages = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages');
    return rows;
  } catch (error) {
    throw error;
  }
}

// Create new package
exports.createPackage = async (packageData) => {
  const { name, destination_id, duration, price, description, image_url } = packageData;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO packages (name, destination_id, duration, price, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, destination_id, duration, price, description, image_url]
    );
    
    return { 
      id: result.insertId, 
      name, 
      destination_id, 
      duration, 
      price, 
      description, 
      image_url 
    };
  } catch (error) {
    throw error;
  }
}

// Update package
exports.updatePackage = async (id, packageData) => {
  const { name, destination_id, duration, price, description, image_url } = packageData;
  
  try {
    await pool.query(
      'UPDATE packages SET name = ?, destination_id = ?, duration = ?, price = ?, description = ?, image_url = ? WHERE id = ?',
      [name, destination_id, duration, price, description, image_url, id]
    );
    
    return { 
      id: parseInt(id), 
      name, 
      destination_id, 
      duration, 
      price, 
      description, 
      image_url 
    };
  } catch (error) {
    throw error;
  }
}

// Delete package
exports.deletePackage = async (id) => {
  try {
    await pool.query('DELETE FROM packages WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
}

// Delete all packages for a destination (for cascade delete)
exports.deletePackagesByDestination = async (destinationId) => {
  try {
    await pool.query('DELETE FROM packages WHERE destination_id = ?', [destinationId]);
    return true;
  } catch (error) {
    throw error;
  }
}