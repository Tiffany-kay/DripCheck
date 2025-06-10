import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Crown, Zap } from 'lucide-react';

function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userVibe, setUserVibe] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  // AI-generated vibes based on username/name patterns
  const generateVibe = (username, firstName) => {
    const vibes = [
      'NeoStreetwear Goddess',
      'Thrift King',
      'Cyberpunk Royalty',
      'Y2K Fashion Prophet',
      'Vintage Soul Collector',
      'Alt-Core Pioneer',
      'Drip Architect',
      'Style Maverick',
      'Fashion Alchemist',
      'Retro Future Icon'
    ];
    
    // Simple logic to assign vibe based on username characteristics
    const name = (username || firstName || '').toLowerCase();
    if (name.includes('street') || name.includes('urban')) return 'NeoStreetwear Goddess';
    if (name.includes('vintage') || name.includes('retro')) return 'Vintage Soul Collector';
    if (name.includes('neo') || name.includes('cyber')) return 'Cyberpunk Royalty';
    
    // Default to random vibe
    return vibes[Math.floor(Math.random() * vibes.length)];
  };

  useEffect(() => {
    if (user) {
      // Simulate AI processing
      setTimeout(() => {
        const vibe = generateVibe(user.username, user.firstName);
        setUserVibe(vibe);
        setIsGenerating(false);
        setCurrentStep(1);
      }, 3000);
    }
  }, [user]);

  const onboardingSteps = [
    {
      id: 'generating',
      title: 'Analyzing your vibe...',
      subtitle: 'Our AI is reading your energy ✨',
      content: <GeneratingStep />
    },
    {
      id: 'vibe-reveal',
      title: `Your vibe is: ${userVibe}`,
      subtitle: 'Welcome to the Dripverse! 🌌',
      content: <VibeRevealStep userVibe={userVibe} user={user} />
    },
    {
      id: 'setup-complete',
      title: 'Profile ready!',
      subtitle: 'Now go flex your first fit 💫',
      content: <SetupCompleteStep user={user} onComplete={() => navigate('/home')} />
    }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-5xl text-cloud-white neon-text mb-4">
            {onboardingSteps[currentStep]?.title}
          </h1>
          <p className="text-cloud-white/70 text-xl mb-8">
            {onboardingSteps[currentStep]?.subtitle}
          </p>
          {onboardingSteps[currentStep]?.content}
        </motion.div>
      </div>
    </motion.div>
  );
}

function GeneratingStep() {
  return (
    <motion.div className="glass-card p-12 rounded-2xl">
      <motion.div
        className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-soft-purple via-electric-cyan to-drip-green flex items-center justify-center"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity }
        }}
      >
        <Sparkles size={48} className="text-cloud-white" />
      </motion.div>
      
      <div className="space-y-4">
        <motion.div
          className="h-3 bg-gradient-to-r from-soft-purple to-electric-cyan rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-cloud-white/30 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>
        
        <div className="text-cloud-white/60">
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Scanning your aesthetic DNA...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function VibeRevealStep({ userVibe, user }) {
  return (
    <motion.div
      className="glass-card p-12 rounded-2xl"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
    >
      <motion.div
        className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-soft-purple to-electric-cyan flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        {user?.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Crown size={64} className="text-cloud-white" />
        )}
      </motion.div>
      
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-cloud-white mb-2">
          Hi, {user?.firstName || user?.username} 👋
        </h2>
        <div className="inline-block bg-gradient-to-r from-soft-purple to-electric-cyan text-cloud-white px-6 py-3 rounded-full font-bold text-lg mb-6">
          {userVibe}
        </div>
        
        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-2xl text-drip-green font-bold">Fresh Dropper</div>
            <div className="text-cloud-white/60 text-sm">Badge Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-electric-cyan font-bold">AI Ready</div>
            <div className="text-cloud-white/60 text-sm">Drip Scoring Active</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SetupCompleteStep({ user, onComplete }) {
  const handleComplete = async () => {
    try {
      console.log('Starting onboarding completion...');
      console.log('Current user metadata:', user.publicMetadata);
      
      // Set localStorage immediately
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      console.log('Set localStorage onboarding flag');
      
      // Try to update user metadata (may fail on some Clerk plans)
      try {
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            hasCompletedOnboarding: true,
            onboardingCompletedAt: new Date().toISOString()
          }
        });
        console.log('User metadata updated successfully');
      } catch (metadataError) {
        console.warn('Metadata update failed, but continuing with localStorage:', metadataError);
      }
      
      // Complete onboarding
      onComplete();
      
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      
      // Force the completion anyway with localStorage
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      console.log('Forcing onboarding completion with localStorage');
      onComplete();
    }
  };
  return (
    <motion.div
      className="glass-card p-12 rounded-2xl"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
    >
      <motion.div
        className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-drip-green to-electric-cyan flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <Zap size={48} className="text-cloud-white" />
      </motion.div>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cloud-white mb-4">
          Welcome to Drip Check! 🎉
        </h2>
        <p className="text-cloud-white/70 mb-6">
          Your profile is ready to make waves in the Dripverse.
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-4xl mb-2">📸</div>
            <div className="text-cloud-white text-sm">Upload Fits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-cloud-white text-sm">Battle Others</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-cloud-white text-sm">Sell & Donate</div>
          </div>
        </div>
      </div>        <motion.button
          className="btn-primary w-full py-4 rounded-full text-lg font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
        >
          Enter the Dripverse ✨
        </motion.button>
          {/* Emergency bypass for demo purposes */}
        <motion.button
          className="mt-4 text-cloud-white/50 text-sm underline hover:text-cloud-white/80"
          onClick={() => {
            localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
            onComplete();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5 }}
        >
          Skip to app (demo only)
        </motion.button>
    </motion.div>
  );
}

export default OnboardingPage;
