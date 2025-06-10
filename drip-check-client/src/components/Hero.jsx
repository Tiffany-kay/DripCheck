import { motion } from 'framer-motion';

function Hero() {
  return (
    <motion.section 
      className="relative z-10 text-center py-20 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.h1 
        className="font-heading text-6xl md:text-8xl text-cloud-white neon-text mb-6"
        animate={{ 
          textShadow: [
            "0 0 10px #9b5de5",
            "0 0 20px #00f0ff", 
            "0 0 10px #9b5de5"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        FLEX. VOTE. SELL. SUPPORT.
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl text-cloud-white/80 mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        👟 Rate fits. 🎯 Buy fits. 🧠 Let AI pick the fit of the week.
      </motion.p>
    </motion.section>
  );
}

export default Hero;
