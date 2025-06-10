import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';

function Header() {
  const { isSignedIn } = useUser();
  const homeLink = isSignedIn ? '/home' : '/';

  return (
    <header className="relative z-10 flex items-center justify-between p-6 glass-card mx-4 mt-4 neon-glow">
      <motion.div 
        className="flex items-center space-x-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to={homeLink} className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-soft-purple to-electric-cyan rounded-full flex items-center justify-center">
            <span className="text-2xl">👗</span>
          </div>
          <h1 className="font-heading text-2xl text-cloud-white neon-text">DRIPCHECK</h1>
        </Link>
      </motion.div>
      
      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton>
            <motion.button 
              className="btn-primary px-6 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join the Drip 🔥
            </motion.button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-full border-2 border-soft-purple"
              }
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}

export default Header;
