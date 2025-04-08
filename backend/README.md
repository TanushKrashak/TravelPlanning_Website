# Travel Planning Website Backend

This is the Node.js backend for the Travel Planning Website. It provides API endpoints for user authentication, package management, bookings, customizations, reviews, payments, and newsletter subscriptions.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. **Install MySQL**:
   - Download and install MySQL from [mysql.com](https://www.mysql.com/downloads/)
   - Make sure the MySQL service is running

2. **Configure Environment Variables**:
   - Open the `.env` file in the backend directory
   - Update the database credentials if needed:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=travel_planning_db
     ```

3. **Run the Setup Script**:
   ```
   node setup.js
   ```
   This will:
   - Install dependencies
   - Create the database and tables
   - Seed the database with sample data
   - Make the reviews dynamic
   - Start the server

## Manual Setup (if the setup script doesn't work)

1. **Install Dependencies**:
   ```
   npm install
   ```

2. **Create Database and Tables**:
   ```
   node scripts/setup-database.js
   ```

3. **Make Reviews Dynamic**:
   ```
   node scripts/make-reviews-dynamic.js
   ```

4. **Start the Server**:
   ```
   node server.js
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID

### Bookings
- `POST /api/bookings` - Create a new booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (protected)

### Customizations
- `POST /api/customizations` - Create a customization request (protected)
- `GET /api/customizations/my-customizations` - Get user's customization requests (protected)

### Reviews
- `POST /api/reviews` - Create a review (protected)
- `GET /api/reviews/package/:package_id` - Get reviews for a package

### Payments
- `POST /api/payments` - Process a payment (protected)
- `GET /api/payments/booking/:booking_id` - Get payments for a booking (protected)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

## Testing the API

You can test the API using tools like Postman or curl. Here's an example of registering a new user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone_number": "1234567890"
}'
```

## Sample User Credentials

For testing purposes, you can use the following credentials:

- Email: john@example.com
- Password: password123 