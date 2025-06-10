// Battle routes for drip battles
const express = require('express');
const router = express.Router();
const Battle = require('../models/Battle');
const Outfit = require('../models/Outfit');
const clerkAuth = require('../middleware/clerkAuth');
const { getBattleJudge } = require('../config/gemini');

// Get active battles
router.get('/active', async (req, res) => {
  try {
    const battles = await Battle.find({ status: 'active' })
      .populate('outfit1 outfit2')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(battles);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single battle
router.get('/:id', async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate('outfit1 outfit2');
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    res.json(battle);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new battle
router.post('/', clerkAuth, async (req, res) => {
  try {
    const { outfit1Id, outfit2Id } = req.body;
    
    // Verify outfits exist
    const outfit1 = await Outfit.findById(outfit1Id);
    const outfit2 = await Outfit.findById(outfit2Id);
    
    if (!outfit1 || !outfit2) {
      return res.status(404).json({ error: 'One or both outfits not found' });
    }
    
    const battle = new Battle({
      outfit1: outfit1Id,
      outfit2: outfit2Id
    });
    
    await battle.save();
    await battle.populate('outfit1 outfit2');
    
    // Get AI judge opinion asynchronously
    getBattleJudge(outfit1.imageUrl, outfit2.imageUrl)
      .then(aiResult => {
        battle.aiJudge = {
          winner: aiResult.winner,
          comment: aiResult.comment,
          generatedAt: new Date()
        };
        battle.save();
      })
      .catch(err => console.error('AI judge error:', err));
    
    res.status(201).json(battle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create battle' });
  }
});

// Vote on battle
router.post('/:id/vote', clerkAuth, async (req, res) => {
  try {
    const { outfitChoice } = req.body; // 1 or 2
    const battleId = req.params.id;
    const userId = req.user._id;
    
    if (outfitChoice !== 1 && outfitChoice !== 2) {
      return res.status(400).json({ error: 'Invalid outfit choice' });
    }
    
    const battle = await Battle.findById(battleId);
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    // Check if user already voted
    if (battle.voters.includes(userId)) {
      return res.status(400).json({ error: 'You have already voted on this battle' });
    }
    
    // Add vote
    if (outfitChoice === 1) {
      battle.outfit1Votes += 1;
    } else {
      battle.outfit2Votes += 1;
    }
    
    battle.voters.push(userId);
    await battle.save();
    
    res.json({ 
      message: 'Vote recorded',
      outfit1Votes: battle.outfit1Votes,
      outfit2Votes: battle.outfit2Votes
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Get battle results
router.get('/:id/results', async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate('outfit1 outfit2');
    
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    const totalVotes = battle.outfit1Votes + battle.outfit2Votes;
    const communityWinner = battle.outfit1Votes > battle.outfit2Votes ? 1 : 
                           battle.outfit2Votes > battle.outfit1Votes ? 2 : null;
    
    res.json({
      battle,
      results: {
        totalVotes,
        communityWinner,
        outfit1Percentage: totalVotes > 0 ? Math.round((battle.outfit1Votes / totalVotes) * 100) : 0,
        outfit2Percentage: totalVotes > 0 ? Math.round((battle.outfit2Votes / totalVotes) * 100) : 0,
        aiJudge: battle.aiJudge
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
