import { motion } from 'framer-motion';
import { Trophy, Crown, Star, TrendingUp } from 'lucide-react';

function LeaderboardPage() {
  const topUsers = [
    {
      rank: 1,
      username: '@drip_goddess',
      avatar: '👑',
      score: 1247,
      outfits: 23,
      badge: 'Drip Queen'
    },
    {
      rank: 2,
      username: '@street_legend',
      avatar: '🔥',
      score: 1189,
      outfits: 19,
      badge: 'Style Master'
    },
    {
      rank: 3,
      username: '@fashion_rebel',
      avatar: '⚡',
      score: 1056,
      outfits: 17,
      badge: 'Trendsetter'
    },
    {
      rank: 4,
      username: '@vintage_vibes',
      avatar: '✨',
      score: 987,
      outfits: 15,
      badge: 'Thrift Lord'
    },
    {
      rank: 5,
      username: '@neo_stylist',
      avatar: '🌟',
      score: 876,
      outfits: 12,
      badge: 'Rising Star'
    }
  ];

  const categories = [
    { title: 'Weekly Champions', icon: Crown, color: 'text-drip-green' },
    { title: 'AI Favorites', icon: Star, color: 'text-electric-cyan' },
    { title: 'Most Sold', icon: TrendingUp, color: 'text-neon-peach' },
    { title: 'Top Donors', icon: Trophy, color: 'text-soft-purple' }
  ];

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          className="font-heading text-6xl text-cloud-white neon-text mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          DRIP LEADERBOARD 🏆
        </motion.h1>
        <motion.p 
          className="text-xl text-cloud-white/80"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          The ultimate fashion flex rankings
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Category Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.title}
              className={`glass-card px-6 py-3 rounded-full flex items-center space-x-2 ${
                index === 0 ? 'border-drip-green' : 'border-soft-purple/30'
              } hover:border-electric-cyan transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon size={20} className={category.color} />
              <span className="text-cloud-white">{category.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Second Place */}
          <PodiumCard user={topUsers[1]} delay={0.6} />
          
          {/* First Place */}
          <PodiumCard user={topUsers[0]} delay={0.4} isWinner />
          
          {/* Third Place */}
          <PodiumCard user={topUsers[2]} delay={0.8} />
        </motion.div>

        {/* Rankings List */}
        <motion.div 
          className="glass-card rounded-2xl p-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-heading text-2xl text-cloud-white mb-6 text-center neon-text">
            Top Drippers This Week
          </h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <RankingRow key={user.username} user={user} delay={0.8 + index * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <StatCard
            title="Total Votes"
            value="15,247"
            icon="🗳️"
            color="text-electric-cyan"
          />
          <StatCard
            title="Outfits Uploaded"
            value="1,892"
            icon="👗"
            color="text-soft-purple"
          />
          <StatCard
            title="Funds Raised"
            value="KES 45,230"
            icon="💰"
            color="text-drip-green"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function PodiumCard({ user, delay, isWinner = false }) {
  const heights = {
    1: 'h-32',
    2: 'h-24',
    3: 'h-20'
  };

  return (
    <motion.div
      className={`text-center ${isWinner ? 'order-first md:order-none' : ''}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      {/* Avatar */}
      <motion.div
        className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl ${
          isWinner ? 'bg-gradient-to-r from-drip-green to-electric-cyan' : 'glass-card'
        }`}
        whileHover={{ scale: 1.1 }}
        animate={isWinner ? { 
          boxShadow: [
            '0 0 20px rgba(110, 241, 149, 0.5)',
            '0 0 40px rgba(110, 241, 149, 0.8)',
            '0 0 20px rgba(110, 241, 149, 0.5)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {user.avatar}
      </motion.div>

      {/* Rank Badge */}
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
        user.rank === 1 ? 'bg-drip-green' : 
        user.rank === 2 ? 'bg-electric-cyan' : 'bg-neon-peach'
      }`}>
        <span className="text-noir font-bold">{user.rank}</span>
      </div>

      {/* User Info */}
      <h3 className="text-cloud-white font-semibold mb-1">{user.username}</h3>
      <p className="text-cloud-white/70 text-sm mb-2">{user.badge}</p>
      <p className="text-2xl font-bold text-electric-cyan mb-4">{user.score}</p>

      {/* Podium */}
      <div className={`${heights[user.rank]} bg-gradient-to-t from-soft-purple/30 to-electric-cyan/30 rounded-t-lg mx-auto w-24`}>
        <div className="h-full flex items-end justify-center pb-2">
          <span className="text-cloud-white font-bold text-lg">#{user.rank}</span>
        </div>
      </div>
    </motion.div>
  );
}

function RankingRow({ user, delay }) {
  return (
    <motion.div
      className="flex items-center justify-between p-4 glass-card rounded-lg hover:border-soft-purple/50 transition-colors"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          user.rank <= 3 ? 'bg-gradient-to-r from-soft-purple to-electric-cyan text-noir' : 'glass-card text-cloud-white'
        }`}>
          {user.rank}
        </div>
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-2xl">
          {user.avatar}
        </div>
        <div>
          <p className="text-cloud-white font-semibold">{user.username}</p>
          <p className="text-cloud-white/60 text-sm">{user.badge}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-electric-cyan font-bold text-lg">{user.score}</p>
        <p className="text-cloud-white/60 text-sm">{user.outfits} outfits</p>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      className="glass-card p-6 text-center rounded-lg"
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-cloud-white font-semibold mb-2">{title}</h4>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}

export default LeaderboardPage;
