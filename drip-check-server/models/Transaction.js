const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  checkoutRequestId: {
    type: String,
    required: true
  },
  merchantRequestId: String,
  mpesaReceiptNumber: String,
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'donation'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  // For purchases
  outfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outfit'
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  itemName: String,
  
  // For donations
  cause: String,
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battle'
  },
  
  // M-PESA callback data
  transactionDate: Date,
  
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    description: String
  }
}, {
  timestamps: true
});

// Indexes for performance
transactionSchema.index({ reference: 1 });
transactionSchema.index({ checkoutRequestId: 1 });
transactionSchema.index({ phoneNumber: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for transaction description
transactionSchema.virtual('description').get(function() {
  if (this.type === 'donation') {
    return `Donation for ${this.cause || 'a cause'}`;
  } else {
    return `Purchase of ${this.itemName || 'outfit'}`;
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
