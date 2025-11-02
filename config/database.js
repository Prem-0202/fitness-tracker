const mongoose = require('mongoose');

// Configure mongoose for production
mongoose.set('bufferCommands', true);

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`✅ Host: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    console.log(`✅ Port: ${conn.connection.port}`);
    console.log(`✅ Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Test the connection with a ping
    try {
      await conn.connection.db.admin().ping();
      console.log('✅ Database ping successful - Connection is healthy');
    } catch (pingError) {
      console.log('⚠ Database ping failed, but connection established');
    }
    
    console.log('✅ MongoDB Connected Successfully!');
    return conn;
    
  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILED');
    console.error('Error:', error.message);
    console.error('Error name:', error.name);
    
    // Detailed error analysis
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔧 NETWORK ISSUE DETECTED:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB Atlas cluster is running');
      console.log('   3. Check if your IP is whitelisted in MongoDB Atlas');
      console.log('   4. Try using a VPN or different network');
      console.log('   5. Check firewall/antivirus settings');
    }
    
    if (error.name === 'MongoNetworkError') {
      console.log('\n🔧 NETWORK ERROR:');
      console.log('   This is a network connectivity issue');
      console.log('   Try:');
      console.log('   - Restarting your router');
      console.log('   - Using mobile hotspot');
      console.log('   - Checking corporate firewall');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 AUTHENTICATION ERROR:');
      console.log('   1. Check username and password in MONGODB_URI');
      console.log('   2. Verify database user exists in MongoDB Atlas');
      console.log('   3. Reset password in MongoDB Atlas if needed');
    }
    
    if (error.message.includes('timed out')) {
      console.log('\n🔧 TIMEOUT ERROR:');
      console.log('   Increase timeout settings or check network latency');
    }
    
    if (error.name === 'MongoParseError') {
      console.log('\n🔧 CONNECTION STRING ERROR:');
      console.log('   Check your MONGODB_URI in .env file');
    }
    
    console.log('\n⚠️  Running in offline mode - database unavailable');
    console.log('💡 To fix: Check MongoDB Atlas cluster status and network connection');
    return null;
  }
};

// MongoDB Connection Events
mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠  Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔁 Mongoose reconnected to MongoDB');
});

// Close the connection when the Node process ends
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;