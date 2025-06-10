// Payments routes - M-PESA integration for DripCheck
const express = require('express');
const router = express.Router();
const { MPESAService } = require('../config/mpesa');
const Transaction = require('../models/Transaction');

// Unified M-PESA payment endpoint
router.post('/mpesa-payment', async (req, res) => {
  try {
    const { phoneNumber, amount, type, itemName, cause, userId, outfitId } = req.body;
    
    // Validate input
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and amount are required'
      });
    }

    // Create account reference based on type
    let accountReference, transactionDesc;
    
    if (type === 'donation') {
      accountReference = `DONATE-${Date.now()}`;
      transactionDesc = `DripCheck Donation: ${cause}`;
    } else if (type === 'purchase') {
      accountReference = `BUY-${Date.now()}`;
      transactionDesc = `DripCheck Purchase: ${itemName}`;
    } else {
      accountReference = `PAYMENT-${Date.now()}`;
      transactionDesc = `DripCheck Payment`;
    }

    console.log(`Processing ${type} payment:`, {
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    });

    // Initiate M-PESA STK Push
    const mpesaResult = await MPESAService.initiateSTKPush({
      phoneNumber,
      amount: parseInt(amount),
      accountReference,
      transactionDesc
    });

    if (mpesaResult.ResponseCode === '0') {
      // Save transaction to database
      const transaction = new Transaction({
        reference: accountReference,
        checkoutRequestId: mpesaResult.CheckoutRequestID,
        merchantRequestId: mpesaResult.MerchantRequestID,
        phoneNumber: phoneNumber,
        amount: parseInt(amount),
        type,
        status: 'pending',
        ...(type === 'purchase' && {
          itemName,
          outfitId,
          buyerId: userId
        }),
        ...(type === 'donation' && {
          cause
        }),
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress,
          description: transactionDesc
        }
      });

      await transaction.save();

      res.json({
        success: true,
        message: 'STK push sent successfully. Please check your phone.',
        checkoutRequestId: mpesaResult.CheckoutRequestID,
        customerMessage: mpesaResult.CustomerMessage,
        merchantRequestId: mpesaResult.MerchantRequestID,
        reference: accountReference,
        transaction: {
          id: transaction._id,
          reference: transaction.reference,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: mpesaResult.ResponseDescription || 'Payment initiation failed',
        errorCode: mpesaResult.ResponseCode
      });
    }

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed. Please try again.',
      error: error.message
    });
  }
});

// M-PESA callback URL for Daraja API
router.post('/mpesa-callback', async (req, res) => {
  try {
    console.log('M-PESA Callback received:', JSON.stringify(req.body, null, 2));
    
    const callbackData = req.body;
    const resultCode = callbackData.Body?.stkCallback?.ResultCode;
    const resultDesc = callbackData.Body?.stkCallback?.ResultDesc;
    const merchantRequestId = callbackData.Body?.stkCallback?.MerchantRequestID;
    const checkoutRequestId = callbackData.Body?.stkCallback?.CheckoutRequestID;

    // Find the transaction in our database
    const transaction = await Transaction.findOne({ checkoutRequestId });
    
    if (!transaction) {
      console.log('Transaction not found for CheckoutRequestID:', checkoutRequestId);
      return res.json({
        ResultCode: 0,
        ResultDesc: 'Transaction not found but callback acknowledged'
      });
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = callbackData.Body?.stkCallback?.CallbackMetadata?.Item || [];
      
      let amount, mpesaReceiptNumber, transactionDate, phoneNumber;
      
      callbackMetadata.forEach(item => {
        switch (item.Name) {
          case 'Amount':
            amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            mpesaReceiptNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionDate = new Date(item.Value?.toString());
            break;
          case 'PhoneNumber':
            phoneNumber = item.Value;
            break;
        }
      });

      // Update transaction as completed
      transaction.status = 'completed';
      transaction.mpesaReceiptNumber = mpesaReceiptNumber;
      transaction.transactionDate = transactionDate;
      await transaction.save();

      console.log('Payment successful:', {
        transactionId: transaction._id,
        reference: transaction.reference,
        amount,
        mpesaReceiptNumber,
        transactionDate,
        phoneNumber
      });

      // Handle business logic based on transaction type
      if (transaction.type === 'purchase') {
        // TODO: Mark outfit as sold
        // TODO: Notify seller via WhatsApp/SMS
        // TODO: Update seller earnings
        console.log(`Outfit purchase completed: ${transaction.itemName}`);
      } else if (transaction.type === 'donation') {
        // TODO: Update campaign/cause total
        // TODO: Record vote if it's a battle donation
        // TODO: Send thank you message
        console.log(`Donation completed for: ${transaction.cause}`);
      }

    } else {
      // Payment failed
      transaction.status = 'failed';
      await transaction.save();

      console.log('Payment failed:', {
        transactionId: transaction._id,
        reference: transaction.reference,
        resultCode,
        resultDesc
      });
    }

    // Always acknowledge the callback
    res.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully'
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Callback processing failed'
    });
  }
});

// Get transaction status
router.get('/transaction/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const transaction = await Transaction.findOne({ reference })
      .populate('outfitId', 'title imageUrl')
      .populate('buyerId', 'firstName username')
      .populate('sellerId', 'firstName username');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transaction: {
        id: transaction._id,
        reference: transaction.reference,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        itemName: transaction.itemName,
        cause: transaction.cause,
        mpesaReceiptNumber: transaction.mpesaReceiptNumber,
        transactionDate: transaction.transactionDate,
        createdAt: transaction.createdAt,
        description: transaction.description
      }
    });
    
  } catch (error) {
    console.error('Transaction lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to lookup transaction'
    });
  }
});

// Get user's payment history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, status, limit = 20, page = 1 } = req.query;

    const filter = {
      $or: [
        { buyerId: userId },
        { phoneNumber: { $regex: userId, $options: 'i' } } // In case we search by phone
      ]
    };

    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .populate('outfitId', 'title imageUrl')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalCount = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t._id,
        reference: t.reference,
        amount: t.amount,
        type: t.type,
        status: t.status,
        itemName: t.itemName,
        cause: t.cause,
        mpesaReceiptNumber: t.mpesaReceiptNumber,
        transactionDate: t.transactionDate,
        createdAt: t.createdAt,
        description: t.description
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: parseInt(page) * parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
});

// Get donation stats for a cause
router.get('/donations/:cause', async (req, res) => {
  try {
    const { cause } = req.params;
    
    // Get completed donations for this cause
    const donations = await Transaction.find({
      type: 'donation',
      cause: cause,
      status: 'completed'
    }).sort({ createdAt: -1 });

    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const donorCount = new Set(donations.map(d => d.phoneNumber)).size;
    
    const recentDonations = donations.slice(0, 10).map(donation => ({
      amount: donation.amount,
      donor: 'Anonymous', // Keep privacy
      createdAt: donation.createdAt,
      reference: donation.reference
    }));

    res.json({
      success: true,
      stats: {
        cause,
        totalDonated,
        donorCount,
        recentDonations,
        lastUpdated: new Date()
      }
    });
    
  } catch (error) {
    console.error('Donation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get donation stats'
    });
  }
});

// Get overall platform stats
router.get('/stats/platform', async (req, res) => {
  try {
    const [totalTransactions, totalDonations, totalPurchases] = await Promise.all([
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.aggregate([
        { $match: { type: 'donation', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'purchase', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const stats = {
      totalTransactions,
      totalDonated: totalDonations[0]?.total || 0,
      totalSales: totalPurchases[0]?.total || 0,
      totalRevenue: (totalDonations[0]?.total || 0) + (totalPurchases[0]?.total || 0),
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get platform stats'
    });
  }
});

// Test M-PESA configuration endpoint
router.get('/test-config', (req, res) => {
  res.json({
    success: true,
    mpesa: {
      configured: !!(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET),
      consumerKey: process.env.MPESA_CONSUMER_KEY ? 'Set' : 'Missing',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET ? 'Set' : 'Missing',
      shortcode: process.env.MPESA_SHORTCODE,
      passkey: process.env.MPESA_PASSKEY ? 'Set' : 'Missing',
      callbackUrl: process.env.MPESA_CALLBACK_URL,
      baseUrl: 'https://sandbox.safaricom.co.ke'
    },
    timestamp: new Date().toISOString()
  });
});

// Test M-PESA access token
router.get('/test-token', async (req, res) => {
  try {
    const token = await MPESAService.getAccessToken();
    res.json({
      success: true,
      message: 'Access token retrieved successfully',
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Token test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
});

// Test STK Push endpoint (use with caution - sends real request)
router.post('/test-stk', async (req, res) => {
  try {
    const { phoneNumber = '254708374149', amount = 1 } = req.body;
    
    console.log('Testing STK Push with:', { phoneNumber, amount });
    
    const result = await MPESAService.initiateSTKPush({
      phoneNumber,
      amount: parseInt(amount),
      accountReference: `TEST-${Date.now()}`,
      transactionDesc: 'DripCheck Test Payment'
    });
    
    res.json({
      success: true,
      message: 'STK Push initiated successfully',
      result,
      instructions: 'Check your phone for M-PESA prompt'
    });
  } catch (error) {
    console.error('STK Push test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
});

module.exports = router;
