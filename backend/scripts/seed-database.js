const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await db.execute('DELETE FROM payments');
    await db.execute('DELETE FROM reviews');
    await db.execute('DELETE FROM bookings');
    await db.execute('DELETE FROM customizations');
    await db.execute('DELETE FROM newsletter_subscriptions');
    await db.execute('DELETE FROM packages');
    await db.execute('DELETE FROM users');

    console.log('Existing data cleared');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [userResult] = await db.execute(
      'INSERT INTO users (first_name, last_name, email, password, date_of_birth, gender, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['John', 'Doe', 'john@example.com', hashedPassword, '1990-01-01', 'male', '1234567890']
    );
    const userId = userResult.insertId;
    console.log('Sample user created');

    // Create sample packages
    const packages = [
      {
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

    for (const pkg of packages) {
      await db.execute(
        'INSERT INTO packages (name, description, destination, price, duration, start_date, end_date, max_travelers, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [pkg.name, pkg.description, pkg.destination, pkg.price, pkg.duration, pkg.start_date, pkg.end_date, pkg.max_travelers, pkg.image_url]
      );
    }
    console.log('Sample packages created');

    // Get the first package ID for creating bookings and reviews
    const [packagesResult] = await db.execute('SELECT id FROM packages LIMIT 1');
    const packageId = packagesResult[0].id;

    // Create sample booking
    const [bookingResult] = await db.execute(
      'INSERT INTO bookings (user_id, package_id, travel_date, num_travelers, total_price) VALUES (?, ?, ?, ?, ?)',
      [userId, packageId, '2023-06-15', 2, 2599.98]
    );
    const bookingId = bookingResult.insertId;
    console.log('Sample booking created');

    // Create sample payment
    await db.execute(
      'INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status) VALUES (?, ?, ?, ?, ?)',
      [bookingId, 2599.98, 'credit_card', 'txn_123456', 'completed']
    );
    console.log('Sample payment created');

    // Create sample reviews
    const reviews = [
      {
        user_id: userId,
        package_id: packageId,
        rating: 5,
        comment: 'Amazing experience! The tour guide was knowledgeable and friendly.'
      },
      {
        user_id: userId,
        package_id: packageId,
        rating: 4,
        comment: 'Great package overall, but the hotel could have been better.'
      }
    ];

    for (const review of reviews) {
      await db.execute(
        'INSERT INTO reviews (user_id, package_id, rating, comment) VALUES (?, ?, ?, ?)',
        [review.user_id, review.package_id, review.rating, review.comment]
      );
    }
    console.log('Sample reviews created');

    // Create sample customization request
    await db.execute(
      'INSERT INTO customizations (user_id, destination, travel_date, num_travelers, requirements) VALUES (?, ?, ?, ?, ?)',
      [userId, 'Bali', '2023-09-01', 3, 'Looking for a luxury villa with private pool']
    );
    console.log('Sample customization request created');

    // Create sample newsletter subscription
    await db.execute(
      'INSERT INTO newsletter_subscriptions (email) VALUES (?)',
      ['john@example.com']
    );
    console.log('Sample newsletter subscription created');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 