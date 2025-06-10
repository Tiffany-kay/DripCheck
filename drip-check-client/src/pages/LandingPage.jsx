import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Crown, Zap, Heart, Trophy, TrendingUp, Sparkles } from 'lucide-react';

function LandingPage() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  // Redirect authenticated users
  useEffect(() => {
    if (isSignedIn && user) {
      console.log('LandingPage Debug:', {
        isSignedIn,
        userMetadata: user.publicMetadata,
        hasCompletedOnboarding: user.publicMetadata?.hasCompletedOnboarding
      });
      
      // Check if user needs onboarding (new user)
      const isNewUser = !user.publicMetadata?.hasCompletedOnboarding;
      if (isNewUser) {
        console.log('Redirecting to onboarding');
        navigate('/onboarding');
      } else {
        console.log('Redirecting to home');
        navigate('/home');
      }
    }
  }, [isSignedIn, user, navigate]);

  const featuredOutfits = [
    {
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
      username: "@neo_drip",
      aiScore: 9.4,
      likes: 234
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop",
      username: "@cyberpunk_queen",
      aiScore: 8.9,
      likes: 187
    },
    {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=400&fit=crop",
      username: "@vintage_soul",
      aiScore: 9.1,
      likes: 156
    }
  ];

  const leaderboard = [
    { rank: 1, username: "@drip_goddess", score: 94.2, badge: "👑" },
    { rank: 2, username: "@style_maverick", score: 91.8, badge: "🔥" },
    { rank: 3, username: "@fashion_rebel", score: 89.5, badge: "⭐" },
    { rank: 4, username: "@urban_prophet", score: 87.3, badge: "💫" },
    { rank: 5, username: "@retro_future", score: 85.9, badge: "✨" }
  ];

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="font-heading text-6xl md:text-8xl text-cloud-white neon-text mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
          >
            Welcome to the<br />
            <span className="bg-gradient-to-r from-soft-purple via-electric-cyan to-drip-green bg-clip-text text-transparent">
              Dripverse
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-cloud-white/80 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Where fashion meets AI, thrift meets tech, and your drip supports real causes. 
            <br />
            <span className="ai-rating">Rate • Battle • Sell • Donate</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <SignUpButton mode="modal">
              <motion.button 
                className="btn-primary px-8 py-4 rounded-full text-lg font-bold flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={20} />
                <span>Step Into The Dripverse</span>
              </motion.button>
            </SignUpButton>
            
            <SignInButton mode="modal">
              <motion.button 
                className="border border-soft-purple/30 text-cloud-white px-8 py-4 rounded-full hover:border-soft-purple/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Already Dripping? Sign In
              </motion.button>
            </SignInButton>
          </motion.div>
        </motion.div>

        {/* Floating Outfit Previews */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-soft-purple/20 to-electric-cyan/20 backdrop-blur-sm"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-2xl absolute inset-0 flex items-center justify-center">
                {['👗', '👔', '👟', '🧥', '👜', '🕶️'][i]}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="font-heading text-4xl text-center text-cloud-white neon-text mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Why Gen Z is Obsessed 🔥
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="text-electric-cyan" size={32} />,
                title: "AI Drip Scoring",
                description: "Get real-time AI feedback on your fits with Gen Z commentary that actually slaps"
              },
              {
                icon: <Trophy className="text-drip-green" size={32} />,
                title: "Drip Battles",
                description: "Vote in style battles while supporting real causes like mental health and climate action"
              },
              {
                icon: <TrendingUp className="text-soft-purple" size={32} />,
                title: "Thrift Marketplace",
                description: "Buy and sell pre-loved fits with M-PESA payments and WhatsApp connections"
              },
              {
                icon: <Heart className="text-pink-400" size={32} />,
                title: "Impact Driven",
                description: "Every vote and purchase can support youth causes across Kenya"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-xl text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-cloud-white mb-3">{feature.title}</h3>
                <p className="text-cloud-white/70 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drip of the Week */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="font-heading text-4xl text-center text-cloud-white neon-text mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            🔮 Featured Drip of the Week
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredOutfits.map((outfit, index) => (
              <motion.div
                key={index}
                className="outfit-card rounded-xl overflow-hidden group"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={outfit.image} 
                    alt="Featured outfit"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/80 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-cloud-white font-bold">{outfit.username}</p>
                          <div className="flex items-center space-x-2">
                            <Heart size={14} className="text-electric-cyan" />
                            <span className="text-cloud-white/80 text-sm">{outfit.likes}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="ai-rating font-bold text-lg">{outfit.aiScore}</div>
                          <div className="text-cloud-white/60 text-xs">AI Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Leaderboard */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="font-heading text-4xl text-center text-cloud-white neon-text mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
          >
            🏆 Current Drip Leaderboard
          </motion.h2>
          
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-soft-purple/10 to-electric-cyan/10"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user.rank === 1 ? 'bg-gradient-to-r from-drip-green to-electric-cyan' :
                      user.rank === 2 ? 'bg-gradient-to-r from-electric-cyan to-soft-purple' :
                      'bg-gradient-to-r from-soft-purple to-electric-cyan'
                    }`}>
                      <span className="text-xl">{user.badge}</span>
                    </div>
                    <div>
                      <p className="text-cloud-white font-bold">#{user.rank} {user.username}</p>
                      <p className="text-cloud-white/60 text-sm">Drip Legend</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="ai-rating font-bold text-xl">{user.score}</div>
                    <div className="text-cloud-white/60 text-xs">AI Score</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vote & Donate CTA */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-card rounded-2xl p-8 bg-gradient-to-r from-drip-green/10 to-electric-cyan/10 border border-drip-green/20"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.6 }}
          >
            <Crown size={48} className="mx-auto mb-6 text-drip-green" />
            <h2 className="font-heading text-3xl text-cloud-white neon-text mb-4">
              💸 This Week's Battle Supports Climate Justice
            </h2>
            <p className="text-cloud-white/80 text-lg mb-6">
              Vote for your favorite sustainable fashion fits while supporting environmental causes across Kenya
            </p>
            <SignUpButton mode="modal">
              <motion.button 
                className="btn-primary px-8 py-4 rounded-full text-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join & Vote for a Cause 💝
              </motion.button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-soft-purple/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            <h3 className="font-heading text-2xl text-cloud-white neon-text mb-4">
              Ready to Join the Revolution?
            </h3>
            <p className="text-cloud-white/60 mb-6">
              Where your drip meets purpose. Join thousands of Gen Z fashion rebels making a difference.
            </p>
            <div className="flex justify-center space-x-8 text-cloud-white/40">
              <span>AI-Powered</span>
              <span>•</span>
              <span>M-PESA Enabled</span>
              <span>•</span>
              <span>Impact Driven</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
}

export default LandingPage;
