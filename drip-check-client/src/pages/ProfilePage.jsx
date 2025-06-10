import { motion } from 'framer-motion';
import { User, Calendar, Trophy, Heart, DollarSign, Users, ShoppingBag, MessageCircle, Gift, Smartphone } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';

function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('fits');
  const [showEditModal, setShowEditModal] = useState(false);
    const userStats = {
    totalOutfits: 12,
    totalLikes: 347,
    totalSales: 8,
    earnings: 1250,
    aiRating: 8.4,
    rank: 23,
    joinDate: 'March 2024',
    followers: 543,
    following: 287,
    totalDonations: 450,
    battleWins: 15
  };

  const userOutfits = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
      likes: 45,
      aiRating: 8.5,
      isForSale: true,
      price: 150
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop",
      likes: 32,
      aiRating: 7.8,
      isForSale: false
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=400&fit=crop",
      likes: 67,
      aiRating: 9.2,
      isForSale: true,
      price: 200
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop",
      likes: 28,
      aiRating: 7.5,
      isForSale: false
    }
  ];

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          className="glass-card rounded-2xl p-8 mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-r from-soft-purple to-electric-cyan flex items-center justify-center text-6xl"
              whileHover={{ scale: 1.05 }}
            >
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                '👤'
              )}
            </motion.div>            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-heading text-4xl text-cloud-white neon-text mb-2">
                {user?.username || user?.firstName || 'Fashion Enthusiast'}
              </h1>
              <p className="text-cloud-white/70 mb-2">
                ✨ Thrift Queen | Nairobi | Alt-core vibes ✨
              </p>
              <p className="text-cloud-white/60 text-sm mb-4">
                Drip connoisseur since {userStats.joinDate}
              </p>
              
              {/* Followers/Following */}
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-cloud-white">{userStats.followers}</p>
                  <p className="text-cloud-white/60 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-cloud-white">{userStats.following}</p>
                  <p className="text-cloud-white/60 text-sm">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold ai-rating">{userStats.aiRating}</p>
                  <p className="text-cloud-white/60 text-sm">Avg Drip Score</p>
                </div>
              </div>              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem icon={Trophy} label="Battle Wins" value={userStats.battleWins} />
                <StatItem icon={Heart} label="Total Likes" value={userStats.totalLikes} />
                <StatItem icon={DollarSign} label="Earnings" value={`KES ${userStats.earnings}`} />
                <StatItem icon="💝" label="Donations" value={`KES ${userStats.totalDonations}`} isAI />
              </div>
              
              {/* M-PESA Stats Banner */}
              <motion.div 
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-drip-green/10 to-electric-cyan/10 border border-drip-green/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone size={24} className="text-drip-green" />
                    <div>
                      <h3 className="font-semibold text-cloud-white">M-PESA Impact 🇰🇪</h3>
                      <p className="text-cloud-white/70 text-sm">Your fashion footprint</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-drip-green">KES {userStats.earnings + userStats.totalDonations}</div>
                    <div className="text-cloud-white/60 text-xs">Total M-PESA Activity</div>
                  </div>
                </div>
              </motion.div>
            </div>{/* Edit Profile Button */}
            <motion.button
              className="btn-primary px-6 py-3 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </motion.button>
          </div>
        </motion.div>        {/* Profile Tabs */}
        <motion.div
          className="glass-card rounded-xl mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex overflow-x-auto border-b border-soft-purple/20">
            {[
              { id: 'fits', label: '👗 My Fits', icon: ShoppingBag },
              { id: 'sold', label: '🛍️ Sold Looks', icon: DollarSign },
              { id: 'battles', label: '🥇 Battles', icon: Trophy },
              { id: 'comments', label: '💬 Comments', icon: MessageCircle },
              { id: 'donations', label: '💝 Donations', icon: Gift },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-electric-cyan border-b-2 border-electric-cyan bg-electric-cyan/10'
                    : 'text-cloud-white/70 hover:text-cloud-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'fits' && (
            <div>
              <h2 className="font-heading text-3xl text-cloud-white neon-text mb-6">
                My Drip Collection 👗
              </h2>
              <div className="outfit-grid">
                {userOutfits.map((outfit, index) => (
                  <ProfileOutfitCard key={outfit.id} outfit={outfit} delay={index * 0.1} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sold' && (
            <div>
              <h2 className="font-heading text-3xl text-cloud-white neon-text mb-6">
                Sold Looks 🛍️
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    className="glass-card p-4 rounded-lg flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-soft-purple/20 to-electric-cyan/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👗</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-cloud-white font-semibold">Vintage Denim Jacket</h3>
                      <p className="text-cloud-white/60 text-sm">Sold to @streetstyle_queen</p>
                      <p className="text-electric-cyan font-semibold">KES 180</p>
                    </div>
                    <div className="text-right">
                      <p className="text-drip-green text-sm">✓ Sold</p>
                      <p className="text-cloud-white/60 text-xs">2 days ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'battles' && (
            <div>
              <h2 className="font-heading text-3xl text-cloud-white neon-text mb-6">
                Battle History 🥇
              </h2>
              <div className="space-y-4">
                {[
                  { result: 'won', votes: '67%', opponent: '@urban_fashionista' },
                  { result: 'lost', votes: '43%', opponent: '@vintage_queen' },
                  { result: 'won', votes: '78%', opponent: '@minimal_maven' },
                ].map((battle, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-4 rounded-lg flex items-center justify-between"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        battle.result === 'won' ? 'bg-drip-green/20' : 'bg-soft-purple/20'
                      }`}>
                        <span className="text-2xl">{battle.result === 'won' ? '👑' : '💪'}</span>
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          battle.result === 'won' ? 'text-drip-green' : 'text-cloud-white'
                        }`}>
                          {battle.result === 'won' ? 'Victory!' : 'Good Fight!'}
                        </p>
                        <p className="text-cloud-white/60 text-sm">vs {battle.opponent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-electric-cyan font-bold">{battle.votes}</p>
                      <p className="text-cloud-white/60 text-xs">votes</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h2 className="font-heading text-3xl text-cloud-white neon-text mb-6">
                Recent Comments 💬
              </h2>
              <div className="space-y-4">
                {[
                  { user: '@streetstyle_queen', comment: 'This fit is absolutely fire! 🔥', outfit: 'Vintage Y2K Look' },
                  { user: '@minimal_maven', comment: 'Where did you get those boots?', outfit: 'All Black Everything' },
                  { user: '@neo_drip', comment: 'Tutorial pleaseee! 🙏', outfit: 'Layering Masterclass' },
                ].map((comment, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-4 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-soft-purple to-electric-cyan rounded-full flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-cloud-white font-semibold text-sm">{comment.user}</p>
                          <p className="text-cloud-white/40 text-xs">on {comment.outfit}</p>
                        </div>
                        <p className="text-cloud-white/80">{comment.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}          {activeTab === 'donations' && (
            <div>
              <h2 className="font-heading text-3xl text-cloud-white neon-text mb-6">
                M-PESA Donations & Impact 💝🇰🇪
              </h2>
              
              {/* M-PESA Summary */}
              <motion.div 
                className="mb-6 p-6 rounded-xl bg-gradient-to-r from-drip-green/10 to-electric-cyan/10 border border-drip-green/30"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Smartphone size={24} className="text-drip-green" />
                  <h3 className="font-semibold text-cloud-white text-lg">M-PESA Transaction Summary</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-drip-green">KES {userStats.totalDonations}</div>
                    <div className="text-cloud-white/60 text-sm">Total Donated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-electric-cyan">15</div>
                    <div className="text-cloud-white/60 text-sm">Battle Votes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-soft-purple">8</div>
                    <div className="text-cloud-white/60 text-sm">Causes Supported</div>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <motion.div
                  className="glass-card p-6 rounded-lg text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-2">💝</div>
                  <p className="text-2xl font-bold ai-rating">KES {userStats.totalDonations}</p>
                  <p className="text-cloud-white/60">Total Donated</p>
                </motion.div>
                <motion.div
                  className="glass-card p-6 rounded-lg text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-2">🌟</div>
                  <p className="text-2xl font-bold text-drip-green">8</p>
                  <p className="text-cloud-white/60">Causes Supported</p>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cloud-white mb-4 flex items-center space-x-2">
                  <Smartphone size={20} className="text-electric-cyan" />
                  <span>Recent M-PESA Donations</span>
                </h3>
                {[
                  { cause: 'Climate Justice Kenya', amount: 10, date: '2 hours ago', type: 'Battle Vote', phone: '***456' },
                  { cause: 'Youth Mental Health Week', amount: 200, date: '2 days ago', type: 'Direct Donation', phone: '***456' },
                  { cause: 'Climate Justice Kenya', amount: 10, date: '3 days ago', type: 'Battle Vote', phone: '***456' },
                  { cause: 'Education for All', amount: 150, date: '1 week ago', type: 'Direct Donation', phone: '***456' },
                ].map((donation, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-4 rounded-lg flex items-center justify-between"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-drip-green to-electric-cyan rounded-full flex items-center justify-center">
                        <Smartphone size={20} className="text-noir" />
                      </div>
                      <div>
                        <p className="text-cloud-white font-semibold">{donation.cause}</p>
                        <div className="flex items-center space-x-2 text-cloud-white/60 text-sm">
                          <span>{donation.type}</span>
                          <span>•</span>
                          <span>{donation.date}</span>
                          <span>•</span>
                          <span>From {donation.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-drip-green font-bold">KES {donation.amount}</p>
                      <p className="text-cloud-white/60 text-xs">donated</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Achievements - moved after tabs */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <AchievementCard
            title="Style Master"
            description="Achieved 5 AI ratings above 9.0"
            icon="🎯"
            earned={true}
          />
          <AchievementCard
            title="Trendsetter"
            description="Get 100 likes in a week"
            icon="📈"
            earned={true}
          />
          <AchievementCard
            title="Drip Legend"
            description="Reach top 10 on leaderboard"
            icon="👑"
            earned={false}
            progress={75}
          />        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal 
          user={user} 
          userStats={userStats}
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </motion.div>
  );
}

function StatItem({ icon: Icon, label, value, isAI = false }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        {typeof Icon === 'string' ? (
          <span className="text-2xl">{Icon}</span>
        ) : (
          <Icon size={24} className="text-electric-cyan" />
        )}
      </div>
      <p className={`text-lg font-bold ${isAI ? 'ai-rating' : 'text-cloud-white'}`}>
        {value}
      </p>
      <p className="text-cloud-white/60 text-sm">{label}</p>
    </div>
  );
}

function AchievementCard({ title, description, icon, earned, progress }) {
  return (
    <motion.div
      className={`glass-card p-6 rounded-lg ${earned ? 'border-drip-green' : 'border-soft-purple/30'}`}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className={`font-semibold ${earned ? 'text-drip-green' : 'text-cloud-white'}`}>
            {title}
          </h3>
          {earned && <span className="text-drip-green text-sm">✓ Earned</span>}
        </div>
      </div>
      <p className="text-cloud-white/70 text-sm mb-3">{description}</p>
      
      {!earned && progress && (
        <div>
          <div className="w-full bg-noir/50 rounded-full h-2 mb-2">
            <div 
              className="progress-bar h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-cloud-white/60 text-xs">{progress}% complete</p>
        </div>
      )}
    </motion.div>
  );
}

function ProfileOutfitCard({ outfit, delay }) {
  return (
    <motion.div
      className="outfit-card rounded-lg overflow-hidden group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={outfit.image} 
          alt="Outfit"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-noir/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="text-center text-cloud-white">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Heart size={16} />
                <span>{outfit.likes}</span>
              </div>
              <div className="flex items-center space-x-1 text-drip-green">
                <span className="ai-rating font-bold">{outfit.aiRating}</span>
                <span className="text-xs">AI</span>
              </div>
            </div>
            
            {outfit.isForSale && (
              <div className="bg-electric-cyan text-noir px-3 py-1 rounded-full text-sm font-semibold">
                KES {outfit.price}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ user, userStats, onClose }) {
  const [bio, setBio] = useState("✨ Thrift Queen | Nairobi | Alt-core vibes ✨");
  const [interests, setInterests] = useState("Y2K, Vintage, Streetwear, Sustainable Fashion");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "@zuri_stylista",
    tiktok: "@zuristyle",
    twitter: "@zuridrip"
  });

  return (
    <motion.div
      className="fixed inset-0 bg-noir/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-cloud-white neon-text">
            Edit Profile ✨
          </h2>
          <button
            onClick={onClose}
            className="text-cloud-white/60 hover:text-cloud-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-soft-purple to-electric-cyan flex items-center justify-center text-4xl mx-auto mb-4">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                '👤'
              )}
            </div>
            <button className="text-electric-cyan hover:text-electric-cyan/80 text-sm">
              Change Photo
            </button>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-cloud-white font-semibold mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-lg bg-noir/50 border border-soft-purple/30 text-cloud-white placeholder-cloud-white/50 focus:border-electric-cyan"
              rows="3"
              placeholder="Tell everyone about your style..."
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-cloud-white font-semibold mb-2">Style Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full p-3 rounded-lg bg-noir/50 border border-soft-purple/30 text-cloud-white placeholder-cloud-white/50 focus:border-electric-cyan"
              placeholder="Y2K, Vintage, Streetwear..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-cloud-white font-semibold mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-lg bg-noir/50 border border-soft-purple/30 text-cloud-white placeholder-cloud-white/50 focus:border-electric-cyan"
              placeholder="Your city..."
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-cloud-white font-semibold mb-2">Social Links</label>
            <div className="space-y-3">
              <input
                type="text"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                className="w-full p-3 rounded-lg bg-noir/50 border border-soft-purple/30 text-cloud-white placeholder-cloud-white/50 focus:border-electric-cyan"
                placeholder="Instagram handle"
              />
              <input
                type="text"
                value={socialLinks.tiktok}
                onChange={(e) => setSocialLinks({...socialLinks, tiktok: e.target.value})}
                className="w-full p-3 rounded-lg bg-noir/50 border border-soft-purple/30 text-cloud-white placeholder-cloud-white/50 focus:border-electric-cyan"
                placeholder="TikTok handle"
              />
              <input
                type="text"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                className="w-full p-3 rounded-lg bg-noir/50 border border-soft-purple/30 text-cloud-white placeholder-cloud-white/50 focus:border-electric-cyan"
                placeholder="Twitter handle"
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-cloud-white font-semibold mb-3">Privacy Settings</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="accent-electric-cyan" defaultChecked />
                <span className="text-cloud-white/80">Allow AI to analyze my outfits</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="accent-electric-cyan" defaultChecked />
                <span className="text-cloud-white/80">Show my profile in battle suggestions</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="accent-electric-cyan" defaultChecked />
                <span className="text-cloud-white/80">Allow others to see my donation activity</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <motion.button
            className="flex-1 btn-primary py-3 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Save Changes
          </motion.button>
          <motion.button
            className="px-6 py-3 border border-soft-purple/30 text-cloud-white/70 rounded-lg hover:text-cloud-white hover:border-soft-purple/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProfilePage;
