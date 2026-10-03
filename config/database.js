const mongoose = require('mongoose');

// Configure mongoose for production
mongoose.set('bufferCommands', true);

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('MongoDB URI exists:', process.env.MONGODB_URI ? 'Yes' : 'No');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
    });

    console.log('MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Ready State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Test the connection with a ping
    try {
      await conn.connection.db.admin().ping();
      console.log('Database ping successful - Connection is healthy');
    } catch (pingError) {
      console.log('Database ping failed, but connection established');
    }
    
    return conn;
    
  } catch (error) {
    console.error('\nDATABASE CONNECTION FAILED');
    console.error('Error:', error.message);
    console.error('Error name:', error.name);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('NETWORK ISSUE: Check Atlas cluster status and IP whitelist');
    }
    if (error.message.includes('authentication failed')) {
      console.log('AUTH ERROR: Check username and password in MONGODB_URI');
    }
    if (error.message.includes('SSL') || error.message.includes('tls')) {
      console.log('SSL/TLS ERROR: Check TLS settings and Atlas cluster SSL config');
    }
    
    console.log('Running in offline mode - database unavailable');
    return null;
  }
};

// MongoDB Connection Events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose reconnected to MongoDB');
});

// Close the connection when the Node process ends
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
