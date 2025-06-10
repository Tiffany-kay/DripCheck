// Campaigns routes
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single campaign
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create campaign (admin only, TODO: add admin check)
router.post('/', async (req, res) => {
  try {
    const { name, description, bannerImage, goalAmount } = req.body;
    const newCampaign = new Campaign({ name, description, bannerImage, goalAmount });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign (admin only, TODO: add admin check)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign (admin only, TODO: add admin check)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

module.exports = router;
