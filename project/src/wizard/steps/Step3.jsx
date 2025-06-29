import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Gamepad2, Utensils, Music, Heart, Sparkles, Camera } from 'lucide-react';

const Step3 = ({ data, onNext }) => {
  const [formData, setFormData] = useState({
    // Childhood & School
    childhood_memories: data.background?.childhood_memories?.join(', ') || '',
    school_experiences: data.background?.school_experiences?.join(', ') || '',
    favorite_subjects: data.background?.favorite_subjects?.join(', ') || '',
    extracurricular_activities: data.background?.extracurricular_activities?.join(', ') || '',
    
    // College & Higher Education
    college_experiences: data.background?.college_experiences?.join(', ') || '',
    college_activities: data.background?.college_activities?.join(', ') || '',
    memorable_professors: data.background?.memorable_professors?.join(', ') || '',
    
    // Friends & Social Life
    friendship_style: data.background?.friendship_style || '',
    social_preferences: data.background?.social_preferences?.join(', ') || '',
    close_friends_description: data.background?.close_friends_description || '',
    
    // Interests & Hobbies
    hobbies: data.background?.hobbies?.join(', ') || '',
    favorite_games: data.background?.favorite_games?.join(', ') || '',
    sports_activities: data.background?.sports_activities?.join(', ') || '',
    creative_pursuits: data.background?.creative_pursuits?.join(', ') || '',
    
    // Food & Lifestyle
    favorite_foods: data.background?.favorite_foods?.join(', ') || '',
    cooking_preferences: data.background?.cooking_preferences || '',
    dietary_restrictions: data.background?.dietary_restrictions?.join(', ') || '',
    
    // Entertainment & Culture
    favorite_music: data.background?.favorite_music?.join(', ') || '',
    favorite_movies: data.background?.favorite_movies?.join(', ') || '',
    favorite_books: data.background?.favorite_books?.join(', ') || '',
    favorite_tv_shows: data.background?.favorite_tv_shows?.join(', ') || '',
    
    ...data
  });

  const friendshipStyles = [
    'I have a large circle of acquaintances',
    'I prefer a small group of close friends',
    'I\'m very social and outgoing',
    'I\'m more introverted and selective',
    'I make friends easily wherever I go',
    'I maintain long-term friendships',
    'I enjoy meeting new people regularly',
    'I prefer deep, meaningful connections'
  ];

  const cookingPreferences = [
    'Love cooking and trying new recipes',
    'Cook basic meals for necessity',
    'Prefer ordering takeout/delivery',
    'Enjoy cooking for others',
    'Baking is my specialty',
    'I\'m learning to cook',
    'Rarely cook, prefer eating out',
    'Meal prep and healthy cooking'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const background = {
      childhood_memories: formData.childhood_memories.split(',').map(m => m.trim()).filter(m => m),
      school_experiences: formData.school_experiences.split(',').map(e => e.trim()).filter(e => e),
      favorite_subjects: formData.favorite_subjects.split(',').map(s => s.trim()).filter(s => s),
      extracurricular_activities: formData.extracurricular_activities.split(',').map(a => a.trim()).filter(a => a),
      college_experiences: formData.college_experiences.split(',').map(e => e.trim()).filter(e => e),
      college_activities: formData.college_activities.split(',').map(a => a.trim()).filter(a => a),
      memorable_professors: formData.memorable_professors.split(',').map(p => p.trim()).filter(p => p),
      friendship_style: formData.friendship_style,
      social_preferences: formData.social_preferences.split(',').map(p => p.trim()).filter(p => p),
      close_friends_description: formData.close_friends_description,
      hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h),
      favorite_games: formData.favorite_games.split(',').map(g => g.trim()).filter(g => g),
      sports_activities: formData.sports_activities.split(',').map(s => s.trim()).filter(s => s),
      creative_pursuits: formData.creative_pursuits.split(',').map(c => c.trim()).filter(c => c),
      favorite_foods: formData.favorite_foods.split(',').map(f => f.trim()).filter(f => f),
      cooking_preferences: formData.cooking_preferences,
      dietary_restrictions: formData.dietary_restrictions.split(',').map(d => d.trim()).filter(d => d),
      favorite_music: formData.favorite_music.split(',').map(m => m.trim()).filter(m => m),
      favorite_movies: formData.favorite_movies.split(',').map(m => m.trim()).filter(m => m),
      favorite_books: formData.favorite_books.split(',').map(b => b.trim()).filter(b => b),
      favorite_tv_shows: formData.favorite_tv_shows.split(',').map(t => t.trim()).filter(t => t)
    };

    onNext({ background });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        {/* Childhood & School */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Childhood & School Years</h3>
                <p className="text-sm text-gray-400 mt-1">Your formative experiences</p>
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
                name="childhood_memories"
                value={formData.childhood_memories}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Childhood Memories</label>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="floating-label"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <textarea
                  name="school_experiences"
                  value={formData.school_experiences}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder=" "
                />
                <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">School Experiences</label>
              </motion.div>

              <motion.div 
                className="floating-label"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <input
                  type="text"
                  name="favorite_subjects"
                  value={formData.favorite_subjects}
                  onChange={handleChange}
                  className="input-field"
                  placeholder=" "
                />
                <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite Subjects</label>
              </motion.div>
            </div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="extracurricular_activities"
                value={formData.extracurricular_activities}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Extracurricular Activities</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Friends & Social Life */}
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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Friends & Social Life</h3>
                <p className="text-sm text-gray-400 mt-1">Your social connections and preferences</p>
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
                name="friendship_style"
                value={formData.friendship_style}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">How would you describe your approach to friendships?</option>
                {friendshipStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Friendship Style</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="social_preferences"
                value={formData.social_preferences}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Social Preferences</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="close_friends_description"
                value={formData.close_friends_description}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Close Friends Description</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Hobbies & Interests */}
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
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Hobbies & Interests</h3>
                <p className="text-sm text-gray-400 mt-1">What you love to do in your free time</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Hobbies</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="favorite_games"
                value={formData.favorite_games}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite Games</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="sports_activities"
                value={formData.sports_activities}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Sports & Physical Activities</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="creative_pursuits"
                value={formData.creative_pursuits}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Creative Pursuits</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Entertainment & Culture */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Entertainment & Culture</h3>
                <p className="text-sm text-gray-400 mt-1">Your cultural tastes and preferences</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="favorite_music"
                value={formData.favorite_music}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite Music</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="favorite_movies"
                value={formData.favorite_movies}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite Movies</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="favorite_books"
                value={formData.favorite_books}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite Books</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="favorite_tv_shows"
                value={formData.favorite_tv_shows}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Favorite TV Shows</label>
            </motion.div>
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
            <Camera className="w-4 h-4" />
            <span className="text-sm">Amazing! Your life story is coming together beautifully</span>
            <Camera className="w-4 h-4" />
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Step3;