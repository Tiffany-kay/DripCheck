// Outfits routes
const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');
const clerkAuth = require('../middleware/clerkAuth');
const cloudinary = require('../config/cloudinary');
const { getDripScore, getStyleTips, getOutfitCaptions } = require('../config/gemini');

// Get all outfits
router.get('/', async (req, res) => {
  try {
    const outfits = await Outfit.find().populate('user campaign');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single outfit by ID
router.get('/:id', async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id).populate('user campaign');
    if (!outfit) return res.status(404).json({ error: 'Not found' });
    res.json(outfit);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new outfit (with image upload and AI features)
router.post('/', clerkAuth, async (req, res) => {
  try {
    const { image, caption, isForSale, sizes, price, campaign, enableAI } = req.body;
    
    // Upload image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, { folder: 'drip-check' });
    
    const newOutfit = new Outfit({
      user: req.user._id, // set by clerkAuth
      imageUrl: uploadRes.secure_url,
      caption,
      isForSale,
      sizes,
      price,
      campaign,
    });
    
    // If AI is enabled, get score and suggestions
    if (enableAI) {
      try {
        // Get AI drip score
        const aiScore = await getDripScore(uploadRes.secure_url, caption);
        newOutfit.aiScore = {
          score: aiScore.score,
          comment: aiScore.comment,
          generatedAt: new Date()
        };
        
        // Get style tips
        const styleTips = await getStyleTips(uploadRes.secure_url, caption);
        newOutfit.styleTips = styleTips.tips.map(tip => ({
          tip,
          generatedAt: new Date()
        }));
        
        // Get caption suggestions
        const captions = await getOutfitCaptions(uploadRes.secure_url);
        newOutfit.suggestedCaptions = captions.captions;
        
      } catch (aiError) {
        console.error('AI processing error:', aiError);
        // Continue without AI features if they fail
      }
    }
    
    await newOutfit.save();
    await newOutfit.populate('user campaign');
    
    res.status(201).json(newOutfit);
  } catch (err) {
    console.error('Create outfit error:', err);
    res.status(500).json({ error: 'Failed to create outfit' });
  }
});

// Update outfit
router.put('/:id', clerkAuth, async (req, res) => {
  try {
    const updated = await Outfit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update outfit' });
  }
});

// Vote/Like outfit
router.post('/:id/vote', clerkAuth, async (req, res) => {
  try {
    const { isLiked } = req.body;
    const outfitId = req.params.id;
    
    const outfit = await Outfit.findById(outfitId);
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
    
    // Update vote count based on like/unlike action
    const voteChange = isLiked ? 1 : -1;
    outfit.votes = Math.max(0, (outfit.votes || 0) + voteChange);
    
    await outfit.save();
    
    res.json({ 
      message: isLiked ? 'Outfit liked' : 'Outfit unliked',
      votes: outfit.votes
    });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Delete outfit
router.delete('/:id', clerkAuth, async (req, res) => {
  try {
    const deleted = await Outfit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete outfit' });
  }
});

module.exports = router;
