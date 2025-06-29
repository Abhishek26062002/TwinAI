import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

import { useDarkMode } from './hooks/useDarkMode.js';
import { isAuthenticated } from './api.js';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MediaCapture from './pages/MediaCapture.jsx';
import ShareLinks from './pages/ShareLinks.jsx';
import WebChat from './pages/WebChat.jsx';
import VoiceChat from './pages/VoiceChat.jsx';
import WizardLayout from './wizard/WizardLayout.jsx';

// Dark mode context
const DarkModeContext = createContext();

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkModeContext must be used within DarkModeProvider');
  }
  return context;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Dark mode toggle component (hidden for pure black theme)
const DarkModeToggle = () => {
  return null; // Hidden since we're using pure black theme
};

function App() {
  const darkModeProps = useDarkMode();

  return (
    <DarkModeContext.Provider value={darkModeProps}>
      <Router>
        <div className="min-h-screen bg-black transition-colors duration-200">
          <DarkModeToggle />
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/media-capture" 
              element={
                <ProtectedRoute>
                  <MediaCapture />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wizard/:step" 
              element={
                <ProtectedRoute>
                  <WizardLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/share" 
              element={
                <ProtectedRoute>
                  <ShareLinks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <WebChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/voice" 
              element={
                <ProtectedRoute>
                  <VoiceChat />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </DarkModeContext.Provider>
  );
}

export default App;