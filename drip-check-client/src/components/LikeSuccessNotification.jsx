import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smartphone, CheckCircle } from 'lucide-react';

function LikeSuccessNotification({ show, isLiked, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-20 right-6 z-50 glass-card p-4 rounded-xl border border-drip-green/30 bg-drip-green/10"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          onAnimationComplete={() => {
            setTimeout(onClose, 2000);
          }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              <Heart 
                size={20} 
                className={`${isLiked ? 'fill-current text-drip-green' : 'text-cloud-white/60'}`} 
              />
            </motion.div>
            
            <div className="text-cloud-white">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-drip-green" />
                <span className="text-sm font-semibold">
                  {isLiked ? 'Outfit Liked!' : 'Like Removed'}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-cloud-white/70 mt-1">
                <Smartphone size={12} className="text-electric-cyan" />
                <span>M-PESA Ready for Donations</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LikeSuccessNotification;
