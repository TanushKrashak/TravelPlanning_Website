const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data
const packages = [
  {
    id: 1,
    name: 'Paris Adventure',
    description: 'Explore the city of love with our comprehensive Paris package',
    destination: 'Paris',
    price: 1299.99,
    duration: 5,
    start_date: '2023-06-01',
    end_date: '2023-06-05',
    max_travelers: 20,
    image_url: 'https://example.com/paris.jpg'
  },
  {
    id: 2,
    name: 'New York City Explorer',
    description: 'Experience the Big Apple with our exciting NYC package',
    destination: 'New York',
    price: 1499.99,
    duration: 7,
    start_date: '2023-07-01',
    end_date: '2023-07-07',
    max_travelers: 15,
    image_url: 'https://example.com/nyc.jpg'
  },
  {
    id: 3,
    name: 'Tokyo Discovery',
    description: 'Immerse yourself in Japanese culture with our Tokyo package',
    destination: 'Tokyo',
    price: 1799.99,
    duration: 6,
    start_date: '2023-08-01',
    end_date: '2023-08-06',
    max_travelers: 12,
    image_url: 'https://example.com/tokyo.jpg'
  }
];

const reviews = [
  {
    id: 1,
    user_id: 1,
    package_id: 1,
    rating: 5,
    comment: 'Amazing experience! The tour guide was knowledgeable and friendly.',
    first_name: 'John',
    last_name: 'Doe',
    created_at: '2023-05-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    package_id: 1,
    rating: 4,
    comment: 'Great package overall, but the hotel could have been better.',
    first_name: 'John',
    last_name: 'Doe',
    created_at: '2023-05-20T14:45:00Z'
  }
];

// Routes
app.get('/api/packages', (req, res) => {
  res.json(packages);
});

app.get('/api/packages/:id', (req, res) => {
  const package = packages.find(p => p.id === parseInt(req.params.id));
  if (!package) {
    return res.status(404).json({ message: 'Package not found' });
  }
  res.json(package);
});

app.get('/api/reviews/package/:package_id', (req, res) => {
  const packageReviews = reviews.filter(r => r.package_id === parseInt(req.params.package_id));
  res.json(packageReviews);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log('This is a simplified version without database connection');
  console.log('Available endpoints:');
  console.log('- GET /api/packages');
  console.log('- GET /api/packages/:id');
  console.log('- GET /api/reviews/package/:package_id');
}); 