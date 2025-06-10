import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Sparkles, Lightbulb, DollarSign, Smartphone } from 'lucide-react';
import { useState } from 'react';
import AIFeaturesPanel from './AIFeaturesPanel';
import OutfitPurchaseModal from './OutfitPurchaseModal';

function OutfitCard({ outfit, onVote, onBuy, showActions = true }) {
  const [showTips, setShowTips] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [localVotes, setLocalVotes] = useState(outfit.votes || outfit.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  if (!outfit) {
    return <OutfitCardSkeleton />;
  }

  const handleVote = () => {
    // Toggle like state
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Update local vote count
    setLocalVotes(prevVotes => newLikedState ? prevVotes + 1 : prevVotes - 1);
    
    // Show animation feedback
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 600);
    
    // Call parent callback
    if (onVote) {
      onVote(outfit, newLikedState);
    }
  };

  return (
    <>
      <motion.div
        className="outfit-card rounded-lg overflow-hidden group"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-square bg-gradient-to-br from-soft-purple/20 to-electric-cyan/20 relative overflow-hidden">
          {outfit.imageUrl ? (
            <img 
              src={outfit.imageUrl} 
              alt="Outfit"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">👗</span>
            </div>
          )}
          
          {/* AI Score Badge */}
          {outfit.aiScore && (
            <button
              onClick={() => setShowAIPanel(true)}
              className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full flex items-center space-x-2 hover:bg-soft-purple/20 transition-colors cursor-pointer"
            >
              <Sparkles size={14} className="text-electric-cyan" />
              <span className="ai-rating font-bold text-sm">{outfit.aiScore.score}/100</span>
            </button>
          )}

          {/* Style Tips Button */}
          {(outfit.styleTips && outfit.styleTips.length > 0) || outfit.aiScore && (
            <button
              onClick={() => setShowAIPanel(true)}
              className="absolute top-3 left-3 glass-card p-2 rounded-full hover:bg-soft-purple/20 transition-colors"
            >
              <Lightbulb size={16} className="text-drip-green" />
            </button>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cloud-white font-semibold">{outfit.user?.name || '@fashionista'}</span>
            {outfit.price && (
              <span className="text-electric-cyan text-sm font-semibold">KES {outfit.price}</span>
            )}
          </div>
          
          {/* AI Comment */}
          {outfit.aiScore?.comment && (
            <div className="mb-3 p-2 rounded-lg bg-soft-purple/10 border border-soft-purple/20">
              <p className="text-electric-cyan text-xs italic">
                🧠 "{outfit.aiScore.comment}"
              </p>
            </div>
          )}
          
          <p className="text-cloud-white/70 text-sm mb-3 line-clamp-2">
            {outfit.caption || 'Serving looks and taking names! 💅'}
          </p>

          {/* Style Tips Dropdown */}
          {showTips && outfit.styleTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 rounded-lg bg-drip-green/10 border border-drip-green/20"
            >
              <h4 className="text-drip-green text-xs font-semibold mb-2 flex items-center">
                <Lightbulb size={12} className="mr-1" />
                AI Style Tips
              </h4>
              <ul className="space-y-1">
                {outfit.styleTips.map((tip, index) => (
                  <li key={index} className="text-cloud-white/80 text-xs">
                    • {tip.tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}          {showActions && (
          <div className="flex items-center justify-between space-x-2">
            <motion.button
              onClick={handleVote}
              className={`flex items-center space-x-1 transition-colors relative ${
                isLiked 
                  ? 'text-drip-green' 
                  : 'text-cloud-white/60 hover:text-drip-green'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={showLikeAnimation ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              </motion.div>
              <span className="text-sm">{localVotes}</span>
              {showLikeAnimation && (
                <motion.span
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-drip-green text-xs font-bold"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -10 }}
                  exit={{ opacity: 0 }}
                >
                  {isLiked ? '+1' : '-1'}
                </motion.span>
              )}
            </motion.button>{outfit.isForSale && (
              <motion.button
                onClick={() => setShowPurchaseModal(true)}
                className="flex items-center space-x-1 bg-gradient-to-r from-electric-cyan/20 to-drip-green/20 text-electric-cyan px-3 py-2 rounded-full hover:bg-electric-cyan/30 transition-colors border border-electric-cyan/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Smartphone size={12} />
                <DollarSign size={14} />
                <span className="text-sm font-semibold">KES {outfit.price}</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={() => setShowAIPanel(true)}
              className="flex items-center space-x-1 text-cloud-white/60 hover:text-soft-purple transition-colors ml-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={16} />
              <span className="text-sm">AI</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>      {/* AI Features Panel */}
      {showAIPanel && (
        <AIFeaturesPanel
          outfit={outfit}
          onClose={() => setShowAIPanel(false)}
        />
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <OutfitPurchaseModal
          outfit={outfit}
          seller={{
            username: outfit.username || '@streetstyle_queen',
            avatar: outfit.userAvatar,
            bio: 'Thrift Queen | Y2K Collector | Sustainable Fashion Advocate',
            rating: 4.8,
            sales: 23,
            whatsapp: '254712345678'
          }}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseSuccess={(paymentData) => {
            console.log('Purchase successful:', paymentData);
            onBuy?.(outfit, paymentData);
          }}
        />
      )}
    </>
  );
}

// Skeleton loader component
function OutfitCardSkeleton() {
  return (
    <div className="outfit-card rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-700"></div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700 rounded w-16"></div>
          <div className="h-8 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

export default OutfitCard;
