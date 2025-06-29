import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Brain, Heart, Zap, Smile, BedDouble as ThoughtBubble, Lightbulb } from 'lucide-react';

const Step4 = ({ data, onNext }) => {
  const [formData, setFormData] = useState({
    // Communication Style
    communication_tone: data.personality?.communication_tone || '',
    response_style: data.personality?.response_style || '',
    humor_level: data.personality?.humor_level || 3,
    formality_level: data.personality?.formality_level || 3,
    
    // Emotional Traits
    empathy_level: data.personality?.empathy_level || 3,
    optimism_level: data.personality?.optimism_level || 3,
    patience_level: data.personality?.patience_level || 3,
    enthusiasm_level: data.personality?.enthusiasm_level || 3,
    
    // Thinking Style
    decision_making_style: data.personality?.decision_making_style || '',
    problem_solving_approach: data.personality?.problem_solving_approach || '',
    learning_style: data.personality?.learning_style || '',
    
    // Social Traits
    introversion_extroversion: data.personality?.introversion_extroversion || 3,
    conflict_resolution: data.personality?.conflict_resolution || '',
    leadership_style: data.personality?.leadership_style || '',
    
    // Response Scenarios
    scenario_responses: data.personality?.scenario_responses || {},
    
    ...data
  });

  const communicationTones = [
    'Warm and friendly',
    'Professional and polished',
    'Casual and relaxed',
    'Enthusiastic and energetic',
    'Calm and measured',
    'Witty and playful',
    'Direct and straightforward',
    'Thoughtful and reflective'
  ];

  const responseStyles = [
    'Detailed explanations with examples',
    'Concise and to-the-point',
    'Story-telling with anecdotes',
    'Question-based to encourage thinking',
    'Step-by-step instructions',
    'Conversational back-and-forth',
    'Visual metaphors and analogies',
    'Data-driven with facts'
  ];

  const scenarios = [
    {
      id: 'disagreement',
      question: 'Someone strongly disagrees with your opinion on a topic you care about. How do you typically respond?',
      placeholder: 'Describe how you would handle this situation...'
    },
    {
      id: 'mistake',
      question: 'You made a mistake that affected others. How do you typically handle this?',
      placeholder: 'Explain your approach to handling mistakes...'
    },
    {
      id: 'help_request',
      question: 'A friend asks for advice about a personal problem. How do you typically respond?',
      placeholder: 'Describe how you give advice and support...'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const personality = {
      communication_tone: formData.communication_tone,
      response_style: formData.response_style,
      humor_level: parseInt(formData.humor_level),
      formality_level: parseInt(formData.formality_level),
      empathy_level: parseInt(formData.empathy_level),
      optimism_level: parseInt(formData.optimism_level),
      patience_level: parseInt(formData.patience_level),
      enthusiasm_level: parseInt(formData.enthusiasm_level),
      decision_making_style: formData.decision_making_style,
      problem_solving_approach: formData.problem_solving_approach,
      learning_style: formData.learning_style,
      introversion_extroversion: parseInt(formData.introversion_extroversion),
      conflict_resolution: formData.conflict_resolution,
      leadership_style: formData.leadership_style,
      scenario_responses: formData.scenario_responses
    };

    onNext({ personality });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleScenarioResponse = (scenarioId, response) => {
    setFormData({
      ...formData,
      scenario_responses: {
        ...formData.scenario_responses,
        [scenarioId]: response
      }
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <form id="step-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Communication Style */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Communication Style</h3>
                <p className="text-sm text-gray-400 mt-1">How you express yourself</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="communication_tone"
                value={formData.communication_tone}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">How would you describe your communication style?</option>
                {communicationTones.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Communication Tone</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="response_style"
                value={formData.response_style}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">How do you prefer to explain things?</option>
                {responseStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Response Style</label>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-neutral-300 mb-4">
                  Humor Level: {formData.humor_level}/5
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-500">Serious</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.humor_level}
                    onChange={(e) => handleSliderChange('humor_level', e.target.value)}
                    className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-neutral-500">Funny</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-neutral-300 mb-4">
                  Formality Level: {formData.formality_level}/5
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-500">Casual</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.formality_level}
                    onChange={(e) => handleSliderChange('formality_level', e.target.value)}
                    className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-neutral-500">Formal</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Emotional Traits */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Emotional Traits</h3>
                <p className="text-sm text-gray-400 mt-1">Your emotional characteristics</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Empathy Level: {formData.empathy_level}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Direct</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.empathy_level}
                  onChange={(e) => handleSliderChange('empathy_level', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Caring</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Optimism Level: {formData.optimism_level}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Realistic</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.optimism_level}
                  onChange={(e) => handleSliderChange('optimism_level', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Optimistic</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Patience Level: {formData.patience_level}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Quick</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.patience_level}
                  onChange={(e) => handleSliderChange('patience_level', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Patient</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Enthusiasm Level: {formData.enthusiasm_level}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Calm</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.enthusiasm_level}
                  onChange={(e) => handleSliderChange('enthusiasm_level', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Energetic</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Response Scenarios */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Response Scenarios</h3>
                <p className="text-sm text-gray-400 mt-1">How you typically respond in different situations</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {scenarios.map((scenario, index) => (
              <motion.div 
                key={scenario.id} 
                className="border border-neutral-700 rounded-xl p-6 bg-neutral-800/30"
                whileHover={{ scale: 1.02, borderColor: 'rgba(156, 163, 175, 0.4)' }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                  Scenario {index + 1}: {scenario.question}
                </h4>
                <textarea
                  value={formData.scenario_responses[scenario.id] || ''}
                  onChange={(e) => handleScenarioResponse(scenario.id, e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder={scenario.placeholder}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <Smile className="w-4 h-4" />
            <span className="text-sm">Perfect! Your personality is shining through</span>
            <Smile className="w-4 h-4" />
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Step4;