// User model for Drip Check
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  bio: String,
  profilePicture: String,
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
