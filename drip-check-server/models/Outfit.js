// Outfit model for Drip Check
const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  caption: String,
  isForSale: { type: Boolean, default: false },
  sizes: [String],
  price: Number,
  votes: { type: Number, default: 0 },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  
  // AI Features
  aiScore: {
    score: { type: Number, min: 0, max: 100 },
    comment: String,
    generatedAt: { type: Date }
  },
  styleTips: [{
    tip: String,
    generatedAt: { type: Date }
  }],
  suggestedCaptions: [String],
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Outfit', outfitSchema);
