// Battle model for Drip Check
const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  outfit1: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit', required: true },
  outfit2: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit', required: true },
  
  // Community voting
  outfit1Votes: { type: Number, default: 0 },
  outfit2Votes: { type: Number, default: 0 },
  
  // AI Judge
  aiJudge: {
    winner: { type: Number, enum: [1, 2] }, // 1 for outfit1, 2 for outfit2
    comment: String,
    generatedAt: { type: Date }
  },
  
  // Battle status
  status: { 
    type: String, 
    enum: ['active', 'completed'], 
    default: 'active' 
  },
  
  // Users who voted (to prevent duplicate votes)
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
});

// Index for efficient querying
battleSchema.index({ status: 1, createdAt: -1 });
battleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Battle', battleSchema);
