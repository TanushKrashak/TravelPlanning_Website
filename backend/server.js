const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/packages', require('./routes/packages.routes'));
app.use('/api/bookings', require('./routes/bookings.routes'));
app.use('/api/customizations', require('./routes/customizations.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/payments', require('./routes/payments.routes'));
app.use('/api/newsletter', require('./routes/newsletter.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 