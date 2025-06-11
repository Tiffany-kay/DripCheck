import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Home, Zap, Trophy, User, ShoppingBag, Heart } from 'lucide-react';
import MPESAModal from './MPESAModal';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  
  // Don't show navigation on landing page for non-authenticated users
  if (!isSignedIn && location.pathname === '/') {
    return null;
  }
  
  // Always show navigation for signed-in users (including onboarding)
  if (!isSignedIn) {
    return null;
  }
  
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/battle', icon: Zap, label: 'Battle', badge: 'Donate' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  const scrollToMarketplace = () => {
    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const marketplace = document.querySelector('[data-section="marketplace"]');
        if (marketplace) {
          marketplace.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const marketplace = document.querySelector('[data-section="marketplace"]');
      if (marketplace) {
        marketplace.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleQuickDonation = () => {
    setShowDonationModal(true);
  };

  const handleQuickPurchase = () => {
    // Navigate to marketplace and trigger shopping experience
    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const marketplace = document.querySelector('[data-section="marketplace"]');
        if (marketplace) {
          marketplace.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const marketplace = document.querySelector('[data-section="marketplace"]');
      if (marketplace) {
        marketplace.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Show a quick purchase demo modal
    setShowMarketplaceModal(true);
  };

  const handleDonationSuccess = (paymentData) => {
    console.log('Quick donation successful:', paymentData);
    setShowDonationModal(false);
    // Show success feedback or navigate to battle page
    navigate('/battle');
  };

  const handlePurchaseSuccess = (paymentData) => {
    console.log('Quick purchase successful:', paymentData);
    setShowMarketplaceModal(false);
    // Show success feedback
  };
  return (
    <nav className="relative z-30 mx-4 mt-4">
      <div className="glass-card px-6 py-4">
        <div className="flex justify-center items-center space-x-8">
          {navItems.map(({ path, icon: Icon, label, badge }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors relative ${
                location.pathname === path 
                  ? 'text-electric-cyan' 
                  : 'text-cloud-white/70 hover:text-cloud-white'
              }`}
            >
              <Icon size={20} />
              <span className="hidden md:inline">{label}</span>
              {badge && (
                <span className="absolute -top-1 -right-1 bg-drip-green text-noir text-xs px-2 py-0.5 rounded-full font-bold">
                  {badge}
                </span>
              )}
            </Link>
          ))}          
          {/* M-PESA Marketplace Button */}
          <motion.button
            onClick={handleQuickPurchase}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-cyan/20 to-drip-green/20 border border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={20} />
            <span className="hidden md:inline font-semibold">M-PESA Shop</span>
          </motion.button>

          {/* Quick Donate Button */}
          <motion.button
            onClick={handleQuickDonation}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-drip-green/20 to-electric-cyan/20 border border-drip-green/30 text-drip-green hover:bg-drip-green/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={20} />
            <span className="hidden md:inline font-semibold">Donate KES 10</span>
          </motion.button>
        </div>
      </div>

      {/* M-PESA Donation Modal */}
      <MPESAModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        type="donation"
        amount="10"
        cause="Climate Justice Kenya"
        onSuccess={handleDonationSuccess}
      />

      {/* M-PESA Quick Purchase Modal */}
      <MPESAModal
        isOpen={showMarketplaceModal}
        onClose={() => setShowMarketplaceModal(false)}
        type="purchase"
        amount="150"
        itemName="Featured Thrift Outfit"
        onSuccess={handlePurchaseSuccess}
      />
    </nav>
  );
}

export default Navigation;
