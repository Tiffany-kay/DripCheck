import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, Heart, Sparkles, MessageCircle, DollarSign, Smartphone, Gift } from 'lucide-react';
import apiService from '../services/api';
import MPESAModal from '../components/MPESAModal';

function BattlePage() {
  const [currentBattle, setCurrentBattle] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [battleResults, setBattleResults] = useState(null);
  const [aiJudge, setAiJudge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  useEffect(() => {
    loadBattle();
  }, []);

  const loadBattle = async () => {
    try {
      setLoading(true);
      const battles = await apiService.getActiveBattles();
      if (battles.length > 0) {
        setCurrentBattle(battles[0]);
        // Load battle results to show current vote counts
        const results = await apiService.getBattleResults(battles[0]._id);
        setBattleResults(results.results);
        setAiJudge(results.results.aiJudge);
      } else {
        // Create mock battle for demo
        setCurrentBattle({
          _id: 'demo',
          outfit1: {
            _id: '1',
            imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
            caption: "Vintage vibes with modern twist 🌈",
            user: { name: "streetstyle_queen" },
            aiScore: { score: 88, comment: "Bold color blocking gives 90s NY vibes!" }
          },
          outfit2: {
            _id: '2',
            imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop",
            caption: "Minimalist chic for the win ✨",
            user: { name: "urban_fashionista" },
            aiScore: { score: 92, comment: "Clean lines, very 'that girl' aesthetic!" }
          }
        });
        setBattleResults({
          outfit1Percentage: 45,
          outfit2Percentage: 55,
          totalVotes: 234
        });
        setAiJudge({
          winner: 2,
          comment: "Outfit 2 wins - that minimalist aesthetic is chef's kiss and screams main character energy",
          generatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to load battle:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleVote = async (outfitChoice) => {
    if (userVote || !currentBattle) return;

    // Open donation modal first
    setSelectedOutfit(outfitChoice);
    setShowDonationModal(true);
  };

  const handleDonationSuccess = async (paymentData) => {
    try {
      setUserVote(selectedOutfit);
      
      if (currentBattle._id !== 'demo') {
        await apiService.voteOnBattle(currentBattle._id, selectedOutfit);
        const results = await apiService.getBattleResults(currentBattle._id);
        setBattleResults(results.results);
      }

      // Show celebration
      setWinner(selectedOutfit);
      setShowConfetti(true);
      
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => {
        setWinner(null);
        setUserVote(null);
        setSelectedOutfit(null);
        loadBattle(); // Load next battle
      }, 4000);
      
    } catch (error) {
      console.error('Vote failed:', error);
      setUserVote(null);
      setSelectedOutfit(null);
    }
  };

  const createConfetti = () => {
    const colors = ['#9b5de5', '#00f0ff', '#ffb3c1', '#6ef195'];
    return [...Array(50)].map((_, i) => (
      <div
        key={i}
        className="confetti"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-soft-purple mx-auto mb-4"></div>
          <p className="text-cloud-white">Loading epic battle...</p>
        </div>
      </div>
    );
  }

  if (!currentBattle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Zap size={64} className="mx-auto mb-4 text-soft-purple" />
          <h2 className="text-2xl font-heading text-cloud-white mb-2">No Active Battles</h2>
          <p className="text-cloud-white/70">Check back soon for more drip battles!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {createConfetti()}
        </div>
      )}      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          className="font-heading text-6xl text-cloud-white neon-text mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          DRIP BATTLE ⚡
        </motion.h1>
        <motion.p 
          className="text-xl text-cloud-white/80 mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Choose your champion! Vote for the ultimate drip.
        </motion.p>        {/* This Week's Cause */}
        <motion.div
          className="glass-card inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-drip-green/20 to-electric-cyan/20 border border-drip-green/30 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <Gift size={24} className="text-drip-green" />
            <span className="text-cloud-white font-bold text-lg">
              💚 Supporting: <span className="ai-rating">Climate Justice Kenya</span>
            </span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-cloud-white/80">
              <Smartphone size={16} className="text-electric-cyan" />
              <span>Vote with M-PESA</span>
            </div>
            <span className="text-cloud-white/60">•</span>
            <div className="flex items-center space-x-1 text-cloud-white/80">
              <DollarSign size={16} className="text-drip-green" />
              <span>KES 10 per vote</span>
            </div>
          </div>
        </motion.div>
        
        {/* Vote Count & Impact Stats */}
        {battleResults && (
          <motion.div 
            className="space-y-2 text-cloud-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-lg font-semibold">
              🗳️ {battleResults.totalVotes} votes cast • 💰 KES {(battleResults.totalVotes || 0) * 10} donated
            </div>
            <div className="text-sm text-cloud-white/60">
              This week: <span className="text-drip-green font-semibold">KES 12,450</span> raised for climate action
            </div>
          </motion.div>
        )}
      </div>

      {/* Battle Arena */}
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Outfit */}
          <BattleCard
            outfit={currentBattle.outfit1}
            side="left"
            isWinner={winner === 1}
            onVote={() => handleVote(1)}
            disabled={userVote !== null}
            votePercentage={battleResults?.outfit1Percentage}
            userVoted={userVote === 1}
          />

          {/* VS Divider */}
          <div className="text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
            <motion.div
              className="inline-block glass-card px-6 py-4 rounded-full border-2 border-soft-purple"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <span className="text-3xl font-heading text-cloud-white neon-text">VS</span>
            </motion.div>
          </div>

          {/* Right Outfit */}
          <BattleCard
            outfit={currentBattle.outfit2}
            side="right"
            isWinner={winner === 2}
            onVote={() => handleVote(2)}
            disabled={userVote !== null}
            votePercentage={battleResults?.outfit2Percentage}
            userVoted={userVote === 2}
          />
        </div>

        {/* AI Judge Commentary */}
        {aiJudge && (
          <motion.div
            className="mt-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass-card p-6 rounded-xl border border-electric-cyan border-opacity-30">
              <h3 className="text-xl font-semibold text-cloud-white mb-4 flex items-center justify-center">
                <Sparkles size={24} className="mr-3 text-electric-cyan" />
                AI Celebrity Judge
                <Sparkles size={24} className="ml-3 text-electric-cyan" />
              </h3>
              
              <div className="text-center">
                <div className="mb-4">
                  <span className="inline-block glass-card px-4 py-2 rounded-full text-electric-cyan font-semibold">
                    AI Pick: Outfit {aiJudge.winner}
                  </span>
                </div>
                
                <blockquote className="text-cloud-white/90 italic text-lg leading-relaxed">
                  "{aiJudge.comment}"
                </blockquote>
                
                <div className="mt-4 text-cloud-white/60 text-sm">
                  <MessageCircle size={16} className="inline mr-2" />
                  AI Fashion Expert
                </div>
              </div>
            </div>
          </motion.div>        )}
      </div>

      {/* Donation Modal */}
      <MPESAModal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setSelectedOutfit(null);
        }}
        type="donation"
        amount=""
        cause="Climate Justice Kenya"
        onSuccess={handleDonationSuccess}
      />
    </motion.div>
  );
}

// Enhanced BattleCard component
function BattleCard({ outfit, side, isWinner, onVote, disabled, votePercentage, userVoted }) {
  return (
    <motion.div
      className={`battle-card p-6 rounded-2xl cursor-pointer transition-all ${
        isWinner ? 'winner border-drip-green shadow-lg shadow-drip-green/30' : ''
      } ${userVoted ? 'border-electric-cyan' : ''}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onVote : undefined}
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Winner Crown */}
      {isWinner && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Crown size={32} className="text-drip-green" />
        </motion.div>
      )}

      {/* Outfit Image */}
      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative">
        <img
          src={outfit.imageUrl}
          alt="Battle outfit"
          className="w-full h-full object-cover"
        />
        
        {/* AI Score Badge */}
        {outfit.aiScore && (
          <div className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full flex items-center space-x-2">
            <Sparkles size={14} className="text-electric-cyan" />
            <span className="text-white font-bold text-sm">{outfit.aiScore.score}/100</span>
          </div>
        )}
        
        {/* Vote Percentage Overlay */}
        {votePercentage !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-semibold">{votePercentage}%</span>
              <div className="flex-1 mx-3 bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-soft-purple to-electric-cyan h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
              <Heart size={16} className={userVoted ? 'text-red-500 fill-current' : 'text-gray-400'} />
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="text-center mb-3">
        <h3 className="text-cloud-white font-semibold text-lg">
          @{outfit.user?.name || 'fashionista'}
        </h3>
        <p className="text-cloud-white/70 text-sm mt-1">
          {outfit.caption}
        </p>
      </div>

      {/* AI Comment */}
      {outfit.aiScore?.comment && (
        <div className="mb-4 p-3 rounded-lg bg-electric-cyan/10 border border-electric-cyan/20">
          <p className="text-electric-cyan text-xs italic text-center">
            🧠 "{outfit.aiScore.comment}"
          </p>
        </div>
      )}      {/* Vote Button */}
      {!disabled && (
        <motion.button 
          onClick={onVote}
          className="vote-btn w-full bg-gradient-to-r from-drip-green to-electric-cyan text-noir py-4 rounded-xl font-bold hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Smartphone size={20} />
            <span className="text-lg">Vote with M-PESA 💝</span>
          </div>
          <div className="text-sm opacity-90">
            KES 10 • Supports Climate Justice Kenya
          </div>
        </motion.button>
      )}
        {userVoted && (
        <div className="w-full bg-drip-green/20 border border-drip-green text-drip-green py-3 rounded-lg font-semibold text-center">
          <div className="flex items-center justify-center space-x-2">
            <Heart size={16} className="fill-current" />
            <span>Your vote donated KES 10! ✨</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default BattlePage;
