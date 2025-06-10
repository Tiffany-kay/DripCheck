// Auth routes placeholder
const express = require('express');
const router = express.Router();
const { getGeminiFeedback } = require('../config/gemini');

// TODO: Add Clerk authentication endpoints
router.get('/', (req, res) => {
  res.send('Auth route');
});

// AI feedback for outfit (caption + filename)
router.post('/feedback', async (req, res) => {
  const { caption, filename } = req.body;
  try {
    const feedback = await getGeminiFeedback(caption, filename);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Gemini feedback failed' });
  }
});

module.exports = router;
