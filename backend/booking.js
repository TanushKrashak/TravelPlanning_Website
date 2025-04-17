const pool = require('../config/database');

// Create new booking
exports.createBooking = async (bookingData) => {
  const { name, email, package_id, travel_date, guests, total_price } = bookingData;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO bookings (name, email, package_id, travel_date, guests, total_price) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, package_id, travel_date, guests, total_price]
    );
    return { id: result.insertId, ...bookingData };
  } catch (error) {
    throw error;
  }
}

// Get bookings by email
exports.getBookingsByEmail = async (email) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, p.name as package_name, d.name as destination_name
       FROM bookings b
       JOIN packages p ON b.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       WHERE b.email = ?`,
      [email]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get all bookings
exports.getAllBookings = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bookings ORDER BY booking_date DESC'
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

// Update booking
exports.updateBooking = async (id, bookingData) => {
  const { name, email, package_id, travel_date, guests, total_price } = bookingData;
  
  try {
    await pool.query(
      'UPDATE bookings SET name = ?, email = ?, package_id = ?, travel_date = ?, guests = ?, total_price = ? WHERE id = ?',
      [name, email, package_id, travel_date, guests, total_price, id]
    );
    
    return { 
      id: parseInt(id), 
      name, 
      email, 
      package_id, 
      travel_date, 
      guests, 
      total_price 
    };
  } catch (error) {
    throw error;
  }
}

// Delete booking
exports.deleteBooking = async (id) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
}

// Get booking by ID
exports.getBookingById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}