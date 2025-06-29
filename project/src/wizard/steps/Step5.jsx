import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Shield, Target, Lightbulb, Award, Crown, Rocket } from 'lucide-react';

const Step5 = ({ data, onNext }) => {
  const [formData, setFormData] = useState({
    // Core Characteristics
    core_values: data.characteristics?.core_values?.join(', ') || '',
    strengths: data.characteristics?.strengths?.join(', ') || '',
    weaknesses: data.characteristics?.weaknesses?.join(', ') || '',
    motivations: data.characteristics?.motivations?.join(', ') || '',
    
    // Behavioral Traits
    risk_tolerance: data.characteristics?.risk_tolerance || 3,
    adaptability: data.characteristics?.adaptability || 3,
    attention_to_detail: data.characteristics?.attention_to_detail || 3,
    creativity_level: data.characteristics?.creativity_level || 3,
    
    // Work & Life Philosophy
    work_life_balance: data.characteristics?.work_life_balance || '',
    success_definition: data.characteristics?.success_definition || '',
    failure_handling: data.characteristics?.failure_handling || '',
    stress_management: data.characteristics?.stress_management || '',
    
    // Personal Quirks
    pet_peeves: data.characteristics?.pet_peeves?.join(', ') || '',
    unique_habits: data.characteristics?.unique_habits?.join(', ') || '',
    superstitions: data.characteristics?.superstitions?.join(', ') || '',
    
    // Inspirations & Role Models
    role_models: data.characteristics?.role_models?.join(', ') || '',
    inspirational_quotes: data.characteristics?.inspirational_quotes?.join(', ') || '',
    life_philosophy: data.characteristics?.life_philosophy || '',
    
    ...data
  });

  const workLifeBalanceOptions = [
    'Work is my passion, I love what I do',
    'I maintain strict boundaries between work and personal life',
    'I prefer flexible work arrangements',
    'Family and personal life come first',
    'I\'m still figuring out the right balance',
    'Work and life are integrated, not separate',
    'I work hard and play hard',
    'I prioritize based on current life phase'
  ];

  const successDefinitions = [
    'Financial security and wealth',
    'Making a positive impact on others',
    'Personal growth and learning',
    'Recognition and achievement',
    'Work-life balance and happiness',
    'Creative expression and innovation',
    'Building meaningful relationships',
    'Contributing to something bigger than myself'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const characteristics = {
      core_values: formData.core_values.split(',').map(v => v.trim()).filter(v => v),
      strengths: formData.strengths.split(',').map(s => s.trim()).filter(s => s),
      weaknesses: formData.weaknesses.split(',').map(w => w.trim()).filter(w => w),
      motivations: formData.motivations.split(',').map(m => m.trim()).filter(m => m),
      risk_tolerance: parseInt(formData.risk_tolerance),
      adaptability: parseInt(formData.adaptability),
      attention_to_detail: parseInt(formData.attention_to_detail),
      creativity_level: parseInt(formData.creativity_level),
      work_life_balance: formData.work_life_balance,
      success_definition: formData.success_definition,
      failure_handling: formData.failure_handling,
      stress_management: formData.stress_management,
      pet_peeves: formData.pet_peeves.split(',').map(p => p.trim()).filter(p => p),
      unique_habits: formData.unique_habits.split(',').map(h => h.trim()).filter(h => h),
      superstitions: formData.superstitions.split(',').map(s => s.trim()).filter(s => s),
      role_models: formData.role_models.split(',').map(r => r.trim()).filter(r => r),
      inspirational_quotes: formData.inspirational_quotes.split(',').map(q => q.trim()).filter(q => q),
      life_philosophy: formData.life_philosophy
    };

    onNext({ characteristics });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
        {/* Core Characteristics */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Core Characteristics</h3>
                <p className="text-sm text-gray-400 mt-1">The fundamental aspects that define you</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="core_values"
                value={formData.core_values}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Core Values</label>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="floating-label"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <textarea
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder=" "
                />
                <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Strengths</label>
              </motion.div>

              <motion.div 
                className="floating-label"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <textarea
                  name="weaknesses"
                  value={formData.weaknesses}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder=" "
                />
                <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Areas for Growth</label>
              </motion.div>
            </div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="motivations"
                value={formData.motivations}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">What Motivates You</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Behavioral Traits */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Behavioral Traits</h3>
                <p className="text-sm text-gray-400 mt-1">How you approach different situations</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Risk Tolerance: {formData.risk_tolerance}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Cautious</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.risk_tolerance}
                  onChange={(e) => handleSliderChange('risk_tolerance', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Risk-taker</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Adaptability: {formData.adaptability}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Routine</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.adaptability}
                  onChange={(e) => handleSliderChange('adaptability', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Flexible</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Attention to Detail: {formData.attention_to_detail}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Big picture</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.attention_to_detail}
                  onChange={(e) => handleSliderChange('attention_to_detail', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Detail-focused</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-neutral-300 mb-4">
                Creativity Level: {formData.creativity_level}/5
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-500">Practical</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.creativity_level}
                  onChange={(e) => handleSliderChange('creativity_level', e.target.value)}
                  className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-neutral-500">Creative</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Life Philosophy */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Life Philosophy</h3>
                <p className="text-sm text-gray-400 mt-1">Your approach to life and success</p>
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
                name="work_life_balance"
                value={formData.work_life_balance}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">How do you approach work-life balance?</option>
                {workLifeBalanceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Work-Life Balance Approach</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="success_definition"
                value={formData.success_definition}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">What does success mean to you?</option>
                {successDefinitions.map(definition => (
                  <option key={definition} value={definition}>{definition}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Definition of Success</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="life_philosophy"
                value={formData.life_philosophy}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Life Philosophy</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Inspirations */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Inspirations & Role Models</h3>
                <p className="text-sm text-gray-400 mt-1">Who and what inspires you</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="role_models"
                value={formData.role_models}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Role Models or People You Admire</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="inspirational_quotes"
                value={formData.inspirational_quotes}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite Quotes or Sayings</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Final completion celebration */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full">
            <Rocket className="w-5 h-5" />
            <span className="text-lg font-semibold">Almost there! Your digital twin is ready to come to life</span>
            <Rocket className="w-5 h-5" />
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Step5;