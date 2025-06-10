import { motion } from 'framer-motion';
import { Upload, TrendingUp, Heart, ShoppingBag, DollarSign, Smartphone, Vote, Gift } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useState } from 'react';
import Hero from '../components/Hero';
import OutfitCard from '../components/OutfitCard';
import LikeSuccessNotification from '../components/LikeSuccessNotification';
import apiService from '../services/api';

function HomePage() {
  const [showLikeNotification, setShowLikeNotification] = useState(false);
  const [lastLikeAction, setLastLikeAction] = useState({ outfit: null, isLiked: false });

  const sampleOutfits = [
    { 
      id: 1, 
      user: '@fashionista', 
      username: 'fashionista',
      caption: 'Serving Y2K realness with this thrifted find! 💅', 
      likes: 42, 
      aiScore: { score: 85, comment: "Major 2000s vibes, giving Destiny's Child energy!" }, 
      price: 150, 
      isForSale: true,
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
      availableSizes: ['S', 'M'],
      title: "Y2K Dream Fit"
    },
    { 
      id: 2, 
      user: '@streetstyle', 
      username: 'streetstyle',
      caption: 'Minimalist chic meets urban edge ✨', 
      likes: 67, 
      aiScore: { score: 92, comment: "Clean lines, very 'that girl' aesthetic!" }, 
      price: 200, 
      isForSale: true,
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop",
      availableSizes: ['M', 'L'],
      title: "Minimalist Edge Look"
    },
    { 
      id: 3, 
      user: '@vintage_queen', 
      username: 'vintage_queen',
      caption: 'Thrift store treasure transformed! 🌟', 
      likes: 38, 
      aiScore: { score: 78, comment: "Vintage soul with modern twist!" }, 
      isForSale: false,
      imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=400&fit=crop"
    },
    { 
      id: 4, 
      user: '@neo_drip', 
      username: 'neo_drip',
      caption: 'Future fashion meets retro vibes 🚀', 
      likes: 85, 
      aiScore: { score: 89, comment: "Cyberpunk meets streetwear - chef's kiss!" }, 
      price: 275, 
      isForSale: true,
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop",
      availableSizes: ['S', 'M', 'L'],
      title: "Neo Future Fit"
    },
    { 
      id: 5, 
      user: '@pastel_prince', 
      username: 'pastel_prince',
      caption: 'Soft boy aesthetic done right 🌸', 
      likes: 56, 
      aiScore: { score: 81, comment: "Soft boy summer vibes are immaculate!" }, 
      isForSale: false,
      imageUrl: "https://images.unsplash.com/photo-1506629905607-0da47810ce93?w=300&h=400&fit=crop"
    },
    { 
      id: 6, 
      user: '@chaos_couture', 
      username: 'chaos_couture',
      caption: 'Organized chaos in fabric form 🎭', 
      likes: 73, 
      aiScore: { score: 95, comment: "This is art! Deconstructed fashion at its finest!" }, 
      price: 320, 
      isForSale: true,
      imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop",
      availableSizes: ['M'],
      title: "Chaos Couture Masterpiece"
    }
  ];
  const handlePurchase = (outfit, paymentData) => {
    console.log('Purchase completed:', outfit, paymentData);
    // Here you would typically update the outfit as sold, 
    // send notifications, etc.
  };  const handleVote = async (outfit, isLiked) => {
    console.log(`${isLiked ? 'Liked' : 'Unliked'} outfit:`, outfit.id, outfit.caption);
    
    // Show notification
    setLastLikeAction({ outfit, isLiked });
    setShowLikeNotification(true);
    
    try {
      // Call the API to persist the vote
      const result = await apiService.voteOnOutfit(outfit.id, isLiked);
      console.log('Vote recorded:', result);
      
      // Show success feedback
      if (isLiked) {
        console.log('💚 Like recorded successfully!');
      } else {
        console.log('💔 Like removed successfully!');
      }
    } catch (error) {
      console.warn('Failed to record vote (database offline):', error.message);
      // Continue with local UI updates even if API fails
      console.log('✨ Local like state updated (will sync when database is available)');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 px-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <SignedOut>
          <SignInButton>
            <motion.button 
              className="btn-primary px-8 py-3 rounded-full flex items-center space-x-2 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Join the Drip 🔥</span>
            </motion.button>
          </SignInButton>
        </SignedOut>
          <motion.button 
          className="glass-card px-8 py-3 rounded-full text-cloud-white border-soft-purple hover:border-electric-cyan transition-colors flex items-center space-x-2 text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp size={20} />
          <span>View Leaderboard</span>
        </motion.button>

        <SignedIn>
          <motion.button 
            className="bg-gradient-to-r from-drip-green to-electric-cyan text-noir px-8 py-3 rounded-full font-bold flex items-center space-x-2 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Vote size={20} />
            <span>Vote & Donate 💚</span>
          </motion.button>

          <motion.button 
            className="glass-card px-8 py-3 rounded-full text-electric-cyan border-electric-cyan hover:bg-electric-cyan hover:text-noir transition-colors flex items-center space-x-2 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={20} />
            <span>Shop Thrift Market</span>
          </motion.button>
        </SignedIn>
      </motion.div>

      {/* M-PESA Impact Banner */}
      <motion.section 
        className="relative z-10 px-6 mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-4xl mx-auto glass-card p-8 rounded-2xl bg-gradient-to-r from-drip-green/10 to-electric-cyan/10 border border-drip-green/30">
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center space-x-3 mb-4"
              animate={{ pulse: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Smartphone size={32} className="text-drip-green" />
              <h2 className="font-heading text-3xl text-cloud-white neon-text">
                Shop & Vote with M-PESA 🇰🇪
              </h2>
            </motion.div>
            <p className="text-cloud-white/80 text-lg mb-6">
              Every purchase supports local creators. Every vote supports social causes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-noir/30">
              <DollarSign size={24} className="mx-auto mb-2 text-electric-cyan" />
              <h3 className="font-semibold text-cloud-white mb-1">Seamless Payments</h3>
              <p className="text-cloud-white/70 text-sm">Buy outfits instantly with M-PESA STK push</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-noir/30">
              <Gift size={24} className="mx-auto mb-2 text-drip-green" />
              <h3 className="font-semibold text-cloud-white mb-1">Impact Donations</h3>
              <p className="text-cloud-white/70 text-sm">Every battle vote donates to Kenyan causes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-noir/30">
              <Heart size={24} className="mx-auto mb-2 text-soft-purple" />
              <h3 className="font-semibold text-cloud-white mb-1">Support Creators</h3>
              <p className="text-cloud-white/70 text-sm">Direct payments to fashion entrepreneurs</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <motion.div 
              className="text-cloud-white/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              💰 <span className="text-drip-green font-semibold">KES 45,230</span> donated this month • 
              🛍️ <span className="text-electric-cyan font-semibold">1,247</span> successful transactions
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <motion.section 
        className="relative z-10 px-6 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🔥"
            title="AI Drip Rater"
            description="Get your fit rated by Gemini AI with witty feedback and style tips"
            delay={0.2}
          />
          <FeatureCard 
            icon="🛍️"
            title="Thrift Marketplace"
            description="Buy and sell fits with seamless M-PESA payments"
            delay={0.4}
          />
          <FeatureCard 
            icon="🎯"
            title="Drip for a Cause"
            description="Vote for your favorite fits while supporting social causes"
            delay={0.6}
          />
        </div>
      </motion.section>      {/* Recent Outfits Feed */}
      <motion.section 
        className="relative z-10 px-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="font-heading text-4xl text-cloud-white text-center mb-12 neon-text">
          Latest Drip 💧
        </h2>        <div className="max-w-6xl mx-auto outfit-grid">
          {sampleOutfits.map((outfit, index) => (
            <OutfitCard 
              key={outfit.id} 
              outfit={outfit}
              onVote={handleVote}
              onBuy={handlePurchase}
            />
          ))}
        </div>
      </motion.section>      {/* Thrift Marketplace Section */}
      <motion.section 
        data-section="marketplace"
        className="relative z-10 px-6 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="font-heading text-4xl text-cloud-white neon-text mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              🛍️ Thrift Marketplace
            </motion.h2>
            <p className="text-cloud-white/80 text-lg mb-6">
              Buy directly from creators with instant M-PESA payments
            </p>
            <motion.button 
              className="btn-primary px-8 py-3 rounded-full flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              <span>Browse All Items</span>
            </motion.button>
          </div>

          {/* Featured For Sale Items */}
          <div className="outfit-grid">
            {sampleOutfits.filter(outfit => outfit.isForSale).map((outfit, index) => (
              <motion.div
                key={`sale-${outfit.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <OutfitCard 
                  outfit={outfit}
                  onVote={handleVote}
                  onBuy={handlePurchase}
                />
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                    <Smartphone size={14} className="text-electric-cyan" />
                    <span className="text-cloud-white text-sm">M-PESA Ready</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>        </div>
      </motion.section>

      {/* Like Success Notification */}
      <LikeSuccessNotification 
        show={showLikeNotification}
        isLiked={lastLikeAction.isLiked}
        onClose={() => setShowLikeNotification(false)}
      />
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      className="outfit-card p-6 text-center group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <motion.div 
        className="text-5xl mb-4"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      >
        {icon}
      </motion.div>
      <h3 className="font-heading text-xl text-cloud-white mb-3 neon-text">{title}</h3>
      <p className="text-cloud-white/70">{description}</p>
    </motion.div>
  );
}

export default HomePage;
