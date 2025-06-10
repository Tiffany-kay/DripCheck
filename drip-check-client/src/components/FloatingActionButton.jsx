import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { SignedIn } from '@clerk/clerk-react';

function FloatingActionButton({ onClick }) {
  return (
    <SignedIn>
      <motion.button
        className="fab"
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Upload size={24} color="white" />
      </motion.button>
    </SignedIn>
  );
}

export default FloatingActionButton;
