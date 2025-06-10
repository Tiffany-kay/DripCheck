import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Heart, ShoppingBag } from 'lucide-react';

function MPESAAwarenessBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner after 10 seconds if not dismissed
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-sm"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="glass-card p-6 rounded-2xl bg-gradient-to-r from-drip-green/20 to-electric-cyan/20 border border-drip-green/50 relative">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-cloud-white/60 hover:text-cloud-white"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ pulse: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Smartphone size={32} className="text-drip-green" />
              </motion.div>
              
              <div>
                <h3 className="font-bold text-cloud-white mb-2 flex items-center space-x-2">
                  <span>M-PESA Ready! 🇰🇪</span>
                </h3>
                <p className="text-cloud-white/80 text-sm mb-3">
                  Shop fashion & support causes with seamless mobile payments
                </p>
                
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1 text-electric-cyan">
                    <ShoppingBag size={12} />
                    <span>Buy Outfits</span>
                  </div>
                  <div className="flex items-center space-x-1 text-drip-green">
                    <Heart size={12} />
                    <span>Donate KES 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MPESAAwarenessBanner;
