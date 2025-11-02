const http = require('http');

const testRegistration = () => {
  const data = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test123!',
    age: 25,
    gender: 'male'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(body);
        if (res.statusCode === 201) {
          console.log('✅ Registration successful!');
          console.log('User:', result.user.name);
        } else {
          console.log('❌ Registration failed:', result.message);
        }
      } catch (e) {
        console.log('❌ Error parsing response:', body);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
  });

  req.write(data);
  req.end();
};

testRegistration();