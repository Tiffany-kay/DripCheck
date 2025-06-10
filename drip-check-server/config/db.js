// MongoDB connection setup
const mongoose = require('mongoose');
require('dotenv').config();

function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn('MongoDB URI not found - running without database');
    return;
  }

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
  })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      console.log('Server will continue running without database connection');
    });
}

module.exports = connectDB;
