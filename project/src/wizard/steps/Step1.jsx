import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Globe, Heart, Sparkles } from 'lucide-react';

const Step1 = ({ data, onNext }) => {
  const [formData, setFormData] = useState({
    // Basic Identity
    full_name: data.personal?.full_name || '',
    preferred_name: data.personal?.preferred_name || '',
    nicknames: data.personal?.nicknames?.join(', ') || '',
    age: data.personal?.age || '',
    date_of_birth: data.personal?.date_of_birth || '',
    gender: data.personal?.gender || '',
    pronouns: data.personal?.pronouns || '',
    
    // Location & Background
    current_location: data.personal?.current_location || '',
    hometown: data.personal?.hometown || '',
    nationality: data.personal?.nationality || '',
    languages_spoken: data.personal?.languages_spoken?.join(', ') || '',
    
    // Family & Relationships
    family_status: data.personal?.family_status || '',
    relationship_status: data.personal?.relationship_status || '',
    has_children: data.personal?.has_children || '',
    pets: data.personal?.pets?.join(', ') || '',
    
    ...data
  });

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'];
  const pronounOptions = ['he/him', 'she/her', 'they/them', 'other', 'prefer not to say'];
  const familyStatusOptions = ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed', 'It\'s complicated'];
  const childrenOptions = ['No children', 'Has children', 'Expecting', 'Prefer not to say'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const personal = {
      full_name: formData.full_name,
      preferred_name: formData.preferred_name,
      nicknames: formData.nicknames.split(',').map(n => n.trim()).filter(n => n),
      age: formData.age ? parseInt(formData.age) : null,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      pronouns: formData.pronouns,
      current_location: formData.current_location,
      hometown: formData.hometown,
      nationality: formData.nationality,
      languages_spoken: formData.languages_spoken.split(',').map(l => l.trim()).filter(l => l),
      family_status: formData.family_status,
      relationship_status: formData.relationship_status,
      has_children: formData.has_children,
      pets: formData.pets.split(',').map(p => p.trim()).filter(p => p)
    };

    onNext({ personal });
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
        {/* Basic Identity */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Basic Identity</h3>
                <p className="text-sm text-gray-400 mt-1">Tell us who you are</p>
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
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
                required
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Full Name *</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="preferred_name"
                value={formData.preferred_name}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
                required
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Preferred Name *</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="nicknames"
                value={formData.nicknames}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Nicknames</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
                min="1"
                max="120"
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Age</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="input-field"
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Date of Birth</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select gender</option>
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Gender</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="pronouns"
                value={formData.pronouns}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select pronouns</option>
                {pronounOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Pronouns</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Location & Background */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Location & Background</h3>
                <p className="text-sm text-gray-400 mt-1">Where you're from and where you are</p>
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
                name="current_location"
                value={formData.current_location}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Current Location</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Hometown</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Nationality</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="languages_spoken"
                value={formData.languages_spoken}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Languages Spoken</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Family & Relationships */}
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
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Family & Relationships</h3>
                <p className="text-sm text-gray-400 mt-1">Your personal connections</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="relationship_status"
                value={formData.relationship_status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select status</option>
                {familyStatusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Relationship Status</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="has_children"
                value={formData.has_children}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select option</option>
                {childrenOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Children</label>
            </motion.div>

            <motion.div 
              className="floating-label md:col-span-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="pets"
                value={formData.pets}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Pets</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Fun completion indicator */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Looking great! Let's continue building your digital twin</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Step1;