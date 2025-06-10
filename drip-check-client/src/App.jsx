import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import page components
import HomePage from './pages/HomePage';
import BattlePage from './pages/BattlePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';

// Import modularized components
import Header from './components/Header';
import Navigation from './components/Navigation';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import FloatingActionButton from './components/FloatingActionButton';
import FloatingIcons from './components/FloatingIcons';
import UploadModal from './components/UploadModal';
import ProtectedRoute from './components/ProtectedRoute';
import DebugPanel from './components/DebugPanel';
import MPESAAwarenessBanner from './components/MPESAAwarenessBanner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-noir relative overflow-hidden">
        <BackgroundSlideshow />
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const location = useLocation();

  return (
    <>
      <Header />
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/battle" element={
              <ProtectedRoute>
                <BattlePage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      <FloatingActionButton onClick={() => setShowUploadModal(true)} />
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      <FloatingIcons />
      <DebugPanel />
      <MPESAAwarenessBanner />
    </>
  );
}

export default App;
