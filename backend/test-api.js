const http = require('http');

// Function to test if the server is running
function testServer() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/packages',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('Server is running!');
          try {
            const packages = JSON.parse(data);
            console.log(`Found ${packages.length} packages`);
            resolve(true);
          } catch (error) {
            console.error('Error parsing response:', error);
            reject(error);
          }
        } else {
          console.error(`Server returned status code: ${res.statusCode}`);
          reject(new Error(`Server returned status code: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error connecting to server:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

// Run the test
console.log('Testing if the backend server is running...');
testServer()
  .then(() => {
    console.log('Backend test completed successfully!');
  })
  .catch((error) => {
    console.error('Backend test failed:', error.message);
    console.log('\nTo start the server, run:');
    console.log('node server.js');
  }); 