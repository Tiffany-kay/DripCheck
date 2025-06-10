import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

function DebugPanel() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  const getLocalOnboardingStatus = () => {
    if (!user?.id) return false;
    return localStorage.getItem(`onboarding_completed_${user.id}`) === 'true';
  };

  const forceCompleteOnboarding = () => {
    if (user) {
      // Set localStorage flag
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      
      // Try to update Clerk metadata
      user.update({
        publicMetadata: {
          ...user.publicMetadata,
          hasCompletedOnboarding: true
        }
      }).then(() => {
        console.log('Force completed onboarding');
        window.location.href = '/home';
      }).catch(() => {
        console.log('Metadata update failed, but localStorage set');
        window.location.href = '/home';
      });
    }
  };

  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 glass-card p-4 rounded-lg text-xs max-w-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-electric-cyan font-bold mb-2">🛠️ Debug Panel</h3>
      <div className="space-y-1 text-cloud-white/80">
        <div>Signed In: {isSignedIn ? '✅' : '❌'}</div>
        <div>User ID: {user?.id?.slice(0, 8)}...</div>
        <div>Username: {user?.username || user?.firstName}</div>
        <div>Clerk Onboarding: {user?.publicMetadata?.hasCompletedOnboarding ? '✅' : '❌'}</div>
        <div>Local Onboarding: {getLocalOnboardingStatus() ? '✅' : '❌'}</div>
        <div>Current Path: {window.location.pathname}</div>
        <div className="mt-2 pt-2 border-t border-cloud-white/20">
          <button 
            onClick={forceCompleteOnboarding}
            className="text-drip-green hover:text-electric-cyan"
          >
            🚀 Force Complete Onboarding
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default DebugPanel;
