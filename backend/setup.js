const { execSync } = require('child_process');
const path = require('path');

console.log('Starting backend setup...');

try {
  // Step 1: Install dependencies
  console.log('\n1. Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Step 2: Set up database
  console.log('\n2. Setting up database...');
  execSync('node scripts/setup-database.js', { stdio: 'inherit' });
  
  // Step 3: Make reviews dynamic
  console.log('\n3. Making reviews dynamic...');
  execSync('node scripts/make-reviews-dynamic.js', { stdio: 'inherit' });
  
  // Step 4: Start the server
  console.log('\n4. Starting the server...');
  console.log('Server will be running at http://localhost:5000');
  console.log('Press Ctrl+C to stop the server');
  
  execSync('node server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
} 