import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Heart, Star, DollarSign, User, X } from 'lucide-react';
import MPESAModal from './MPESAModal';

function OutfitPurchaseModal({ outfit, seller, isOpen, onClose, onPurchaseSuccess }) {
  const [showMPESAModal, setShowMPESAModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSellerContact, setShowSellerContact] = useState(false);

  if (!isOpen || !outfit) return null;

  const handlePurchase = () => {
    setShowMPESAModal(true);
  };

  const handleMPESASuccess = (paymentData) => {
    setShowMPESAModal(false);
    setShowSellerContact(true);
    onPurchaseSuccess?.(paymentData);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-noir/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-soft-purple/20">
            <h2 className="font-heading text-2xl text-cloud-white neon-text">
              <ShoppingBag size={24} className="inline mr-2" />
              Outfit Details
            </h2>
            <button
              onClick={onClose}
              className="text-cloud-white/60 hover:text-cloud-white text-2xl"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Outfit Image & Details */}
            <div>
              <motion.div 
                className="aspect-square rounded-xl overflow-hidden mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src={outfit.image} 
                  alt="Outfit"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Outfit Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center glass-card p-3 rounded-lg">
                  <Heart size={20} className="mx-auto mb-1 text-electric-cyan" />
                  <div className="text-cloud-white font-bold">{outfit.likes || 67}</div>
                  <div className="text-cloud-white/60 text-xs">Likes</div>
                </div>
                <div className="text-center glass-card p-3 rounded-lg">
                  <Star size={20} className="mx-auto mb-1 text-drip-green" />
                  <div className="ai-rating font-bold">{outfit.aiRating || 8.9}</div>
                  <div className="text-cloud-white/60 text-xs">AI Score</div>
                </div>
                <div className="text-center glass-card p-3 rounded-lg">
                  <DollarSign size={20} className="mx-auto mb-1 text-electric-cyan" />
                  <div className="text-cloud-white font-bold">KES {outfit.price}</div>
                  <div className="text-cloud-white/60 text-xs">Price</div>
                </div>
              </div>

              {/* Outfit Description */}
              <div className="glass-card p-4 rounded-lg">
                <h3 className="font-semibold text-cloud-white mb-2">Description</h3>
                <p className="text-cloud-white/70 text-sm">
                  {outfit.description || "Absolutely fire Y2K-inspired streetwear piece! This look gives major cyberpunk princess vibes with the perfect balance of edgy and feminine. The color palette is *chef's kiss* and the layering game is unmatched. Perfect for anyone wanting to serve main character energy. 💫"}
                </p>
              </div>
            </div>

            {/* Purchase Section */}
            <div>
              {/* Seller Info */}
              <motion.div 
                className="glass-card p-6 rounded-xl mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-soft-purple to-electric-cyan flex items-center justify-center">
                    {seller?.avatar ? (
                      <img src={seller.avatar} alt="Seller" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={24} className="text-cloud-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-cloud-white font-bold text-lg">
                      {seller?.username || '@streetstyle_queen'}
                    </h3>
                    <p className="text-cloud-white/60 text-sm">
                      {seller?.bio || 'Thrift Queen | Y2K Collector | Sustainable Fashion Advocate'}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-drip-green text-sm">
                        ⭐ {seller?.rating || 4.8} rating
                      </span>
                      <span className="text-cloud-white/60 text-sm">
                        {seller?.sales || 23} sales
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Size Selection */}
              {outfit.availableSizes && (
                <div className="mb-6">
                  <h3 className="text-cloud-white font-semibold mb-3">Select Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {outfit.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 rounded-lg border font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-electric-cyan bg-electric-cyan/20 text-electric-cyan'
                            : 'border-soft-purple/30 text-cloud-white/70 hover:border-soft-purple/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase Actions */}
              {!showSellerContact ? (
                <div className="space-y-4">
                  <motion.button
                    className="w-full btn-primary py-4 rounded-lg text-lg font-bold flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                  >
                    <DollarSign size={20} />
                    <span>Buy Now - KES {outfit.price}</span>
                  </motion.button>

                  <motion.button
                    className="w-full border border-soft-purple/30 text-cloud-white py-3 rounded-lg hover:border-soft-purple/50 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={16} />
                    <span>Save for Later</span>
                  </motion.button>
                </div>
              ) : (
                <SellerContactInfo seller={seller} outfit={outfit} />
              )}

              {/* Payment Security Notice */}
              <div className="mt-6 p-4 bg-drip-green/10 rounded-lg border border-drip-green/20">
                <h4 className="text-drip-green font-semibold mb-2">🔒 Secure Payment</h4>
                <ul className="text-cloud-white/70 text-sm space-y-1">
                  <li>• Payment processed via M-PESA</li>
                  <li>• Direct seller communication via WhatsApp</li>
                  <li>• Buyer protection guarantee</li>
                  <li>• 24h return window for issues</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* M-PESA Payment Modal */}
      <MPESAModal
        isOpen={showMPESAModal}
        onClose={() => setShowMPESAModal(false)}
        type="purchase"
        amount={outfit.price}
        itemName={outfit.title || 'Stylish Outfit'}
        onSuccess={handleMPESASuccess}
      />
    </>
  );
}

function SellerContactInfo({ seller, outfit }) {
  const whatsappMessage = `Hi! I just purchased your outfit "${outfit.title || 'outfit'}" on Drip Check for KES ${outfit.price}. Looking forward to completing the transaction! 😊`;
  const whatsappUrl = `https://wa.me/${seller?.whatsapp || '254712345678'}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      className="glass-card p-6 rounded-xl bg-drip-green/10 border border-drip-green/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-4">
        <motion.div
          className="w-16 h-16 mx-auto mb-3 rounded-full bg-drip-green/20 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <MessageCircle size={24} className="text-drip-green" />
        </motion.div>
        <h3 className="text-drip-green font-bold text-lg mb-2">Payment Successful! 🎉</h3>
        <p className="text-cloud-white/70 text-sm mb-4">
          Now connect with the seller to arrange pickup/delivery
        </p>
      </div>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-drip-green text-noir py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-drip-green/90 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageCircle size={20} />
        <span>Chat on WhatsApp</span>
      </motion.a>

      <div className="mt-4 p-3 bg-noir/30 rounded-lg">
        <p className="text-cloud-white/60 text-xs text-center">
          Seller: {seller?.whatsapp || '+254 712 345 678'} <br />
          Reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </motion.div>
  );
}

export default OutfitPurchaseModal;
