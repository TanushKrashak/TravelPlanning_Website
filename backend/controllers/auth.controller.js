const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, password, date_of_birth, gender, phone_number } = req.body;

      // Check if user already exists
      const [existingUser] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      const [result] = await db.execute(
        'INSERT INTO users (first_name, last_name, email, password, date_of_birth, gender, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, date_of_birth, gender, phone_number]
      );

      // Generate JWT token
      const token = jwt.sign(
        { id: result.insertId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: result.insertId,
          first_name,
          last_name,
          email
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = users[0];

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const [user] = await db.execute(
        'SELECT id, first_name, last_name, email, date_of_birth, gender, phone_number FROM users WHERE id = ?',
        [req.user.id]
      );

      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { first_name, last_name, phone_number } = req.body;

      await db.execute(
        'UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
        [first_name, last_name, phone_number, req.user.id]
      );

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Logout user
  logout: (req, res) => {
    // Since we're using JWT, we don't need to do anything server-side
    // The client should remove the token from their storage
    res.json({ message: 'Logged out successfully' });
  }
};

module.exports = authController; 