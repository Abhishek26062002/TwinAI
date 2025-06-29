import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Step1 from './steps/Step1.jsx';
import Step2 from './steps/Step2.jsx';
import Step3 from './steps/Step3.jsx';
import Step4 from './steps/Step4.jsx';
import Step5 from './steps/Step5.jsx';
import { syncProfile } from '../api.js';

const WizardLayout = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const [wizardData, setWizardData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const currentStep = parseInt(step);
  const totalSteps = 5;

  const steps = [
    { 
      id: 1, 
      title: 'Personal Information', 
      subtitle: 'Tell us about yourself',
      component: Step1,
      color: 'from-pink-500 to-rose-500'
    },
    { 
      id: 2, 
      title: 'Professional Life', 
      subtitle: 'Your career journey',
      component: Step2,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 3, 
      title: 'Life Story', 
      subtitle: 'Your experiences & interests',
      component: Step3,
      color: 'from-purple-500 to-violet-500'
    },
    { 
      id: 4, 
      title: 'Personality', 
      subtitle: 'How you think & communicate',
      component: Step4,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 5, 
      title: 'Your Characteristics', 
      subtitle: 'What makes you unique',
      component: Step5,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const currentStepData = steps.find(s => s.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const updateWizardData = (stepData) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = async (stepData) => {
    const updatedData = { ...wizardData, ...stepData };
    setWizardData(updatedData);
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < totalSteps) {
      navigate(`/wizard/${currentStep + 1}`);
    } else {
      // Final step - sync profile data
      await syncProfileData(updatedData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      navigate(`/wizard/${currentStep - 1}`);
    }
  };

  const syncProfileData = async (data) => {
    try {
      const uid = sessionStorage.getItem('uid');
      if (!uid) {
        throw new Error('No user ID found');
      }

      // Structure the data according to your comprehensive form format
      const profileData = {
        user_id: uid,
        personal: data.personal || {},
        professional: data.professional || {},
        background: data.background || {},
        personality: data.personality || {},
        characteristics: data.characteristics || {},
        timestamp: new Date().toISOString()
      };

      console.log('Syncing profile data:', profileData);

      // Send to /profile/sync/{userid} endpoint
      const response = await syncProfile(profileData);

      if (response.success) {
        console.log('Profile synced successfully:', response.data);
        navigate('/share');
      } else {
        console.error('Failed to sync profile:', response.error);
        // Still navigate to share page for demo purposes
        navigate('/share');
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
      // Still navigate to share page for demo purposes
      navigate('/share');
    }
  };

  const handleSkipToChat = () => {
    navigate('/chat');
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  if (!CurrentStepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Step not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black font-dm-sans">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="h-1 bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        {/* Step indicator */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <h1 className="text-lg font-semibold text-white">
                {currentStepData.title}
              </h1>
              <p className="text-sm text-gray-400">
                Step {currentStep} of {totalSteps} • {currentStepData.subtitle}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <CurrentStepComponent
                data={wizardData}
                onNext={handleNext}
                onBack={handlePrevious}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700">
          {/* Back Button */}
          <motion.button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              currentStep === 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
            }`}
            whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          {/* Step Dots */}
          <div className="flex space-x-2">
            {steps.map((stepItem) => (
              <motion.div
                key={stepItem.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  stepItem.id === currentStep
                    ? 'bg-white w-8'
                    : stepItem.id < currentStep || completedSteps.has(stepItem.id)
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* Next/Complete Button */}
          <motion.button
            type="submit"
            form="step-form"
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Skip button for testing */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={handleSkipToChat}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all duration-200 text-sm backdrop-blur-sm"
        >
          Skip to Chat (Testing)
        </button>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default WizardLayout;