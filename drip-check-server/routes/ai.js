const express = require('express');
const router = express.Router();
const { 
  getDripScore, 
  getBattleJudge, 
  getStyleTips, 
  getOutfitCaptions 
} = require('../config/gemini');

// 1. AI Drip Score - Rate outfit
router.post('/drip-score', async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const result = await getDripScore(imageUrl, caption);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Drip score error:', error);
    res.status(500).json({ 
      error: 'Failed to get drip score',
      message: error.message 
    });
  }
});

// 2. Battle AI Judge - Pick winner with commentary
router.post('/battle-judge', async (req, res) => {
  try {
    const { outfit1Url, outfit2Url } = req.body;
    
    if (!outfit1Url || !outfit2Url) {
      return res.status(400).json({ error: 'Both outfit URLs are required' });
    }

    const result = await getBattleJudge(outfit1Url, outfit2Url);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Battle judge error:', error);
    res.status(500).json({ 
      error: 'Failed to get battle judgment',
      message: error.message 
    });
  }
});

// 3. Style Tips - Fashion advice
router.post('/style-tips', async (req, res) => {
  try {
    const { imageUrl, description } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const result = await getStyleTips(imageUrl, description);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Style tips error:', error);
    res.status(500).json({ 
      error: 'Failed to get style tips',
      message: error.message 
    });
  }
});

// 4. Caption Generator - Gen Z captions
router.post('/generate-captions', async (req, res) => {
  try {
    const { imageUrl, vibe } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const result = await getOutfitCaptions(imageUrl, vibe);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate captions',
      message: error.message 
    });
  }
});

module.exports = router;
