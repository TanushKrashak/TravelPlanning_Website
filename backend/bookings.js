const express = require('express');
const router = express.Router();
const bookingModel = require('../models/booking');
const packageModel = require('../models/package');

// Create new booking
router.post('/', async (req, res) => {
  try {
    // Get package price
    const package = await packageModel.getPackageById(req.body.package_id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    // Calculate total price
    const total_price = package.price * req.body.guests;
    
    // Create booking
    const booking = await bookingModel.createBooking({
      ...req.body,
      total_price
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings by email
router.get('/email/:email', async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingsByEmail(req.params.email);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await bookingModel.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { name, email, package_id, travel_date, guests } = req.body;
    
    // Check if booking exists
    const existingBooking = await bookingModel.getBookingById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Validate required fields
    if (!name || !email || !package_id || !travel_date || !guests) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Get package price
    const package = await packageModel.getPackageById(package_id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    // Calculate total price
    const total_price = package.price * guests;
    
    const updatedBooking = await bookingModel.updateBooking(bookingId, {
      name,
      email,
      package_id,
      travel_date,
      guests,
      total_price
    });
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    // Check if booking exists
    const existingBooking = await bookingModel.getBookingById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    await bookingModel.deleteBooking(bookingId);
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;