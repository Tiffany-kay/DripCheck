import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const location = useLocation();
  const [bypassOnboarding, setBypassOnboarding] = useState(false);

  // Check localStorage for onboarding completion
  const getLocalOnboardingStatus = () => {
    if (!user?.id) return false;
    const completed = localStorage.getItem(`onboarding_completed_${user.id}`);
    return completed === 'true';
  };

  // Set localStorage for onboarding completion
  const setLocalOnboardingStatus = (completed) => {
    if (!user?.id) return;
    localStorage.setItem(`onboarding_completed_${user.id}`, completed.toString());
  };

  // Debug logging
  useEffect(() => {
    if (isLoaded && user) {
      const localCompleted = getLocalOnboardingStatus();
      const clerkCompleted = user.publicMetadata?.hasCompletedOnboarding;
      
      console.log('ProtectedRoute Debug:', {
        isSignedIn,
        currentPath: location.pathname,
        userMetadata: user.publicMetadata,
        clerkHasCompletedOnboarding: clerkCompleted,
        localHasCompletedOnboarding: localCompleted,
        finalNeedsOnboarding: !clerkCompleted && !localCompleted && !bypassOnboarding,
        bypassOnboarding
      });
    }
  }, [isSignedIn, isLoaded, user, location.pathname, bypassOnboarding]);

  // Auto-bypass onboarding after 5 seconds if user seems stuck
  useEffect(() => {
    if (isSignedIn && user && location.pathname === '/onboarding') {
      const timer = setTimeout(() => {
        console.log('Auto-bypassing onboarding due to timeout');
        setBypassOnboarding(true);
        setLocalOnboardingStatus(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, user, location.pathname]);

  // Don't render anything until Clerk is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-soft-purple to-electric-cyan flex items-center justify-center animate-pulse">
            <span className="text-2xl">👗</span>
          </div>
          <p className="text-cloud-white">Loading your drip...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }  // Check if user needs onboarding (use both Clerk metadata and localStorage)
  const clerkCompleted = user?.publicMetadata?.hasCompletedOnboarding;
  const localCompleted = getLocalOnboardingStatus();
  const needsOnboarding = !clerkCompleted && !localCompleted && !bypassOnboarding;
  
  if (needsOnboarding && location.pathname !== '/onboarding') {
    console.log('Redirecting to onboarding from:', location.pathname);
    return <Navigate to="/onboarding" replace />;
  }

  if (!needsOnboarding && location.pathname === '/onboarding') {
    console.log('Redirecting to home from onboarding');
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
