import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Building, Target, Award, TrendingUp } from 'lucide-react';

const Step2 = ({ data, onNext }) => {
  const [formData, setFormData] = useState({
    // Current Status
    current_status: data.professional?.current_status || '',
    job_title: data.professional?.job_title || '',
    company_organization: data.professional?.company_organization || '',
    industry: data.professional?.industry || '',
    work_experience_years: data.professional?.work_experience_years || '',
    
    // Education
    education_level: data.professional?.education_level || '',
    field_of_study: data.professional?.field_of_study || '',
    school_university: data.professional?.school_university || '',
    graduation_year: data.professional?.graduation_year || '',
    additional_certifications: data.professional?.additional_certifications?.join(', ') || '',
    
    // Career Details
    career_goals: data.professional?.career_goals?.join(', ') || '',
    key_achievements: data.professional?.key_achievements?.join(', ') || '',
    skills: data.professional?.skills?.join(', ') || '',
    work_style: data.professional?.work_style || '',
    
    ...data
  });

  const statusOptions = [
    'Full-time Employee',
    'Part-time Employee', 
    'Freelancer/Contractor',
    'Entrepreneur/Business Owner',
    'Student',
    'Recent Graduate',
    'Job Seeker',
    'Retired',
    'Career Break',
    'Other'
  ];

  const educationLevels = [
    'High School',
    'Some College',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Professional Degree',
    'Trade/Vocational School',
    'Self-taught',
    'Other'
  ];

  const workStyleOptions = [
    'Collaborative team player',
    'Independent self-starter',
    'Detail-oriented perfectionist',
    'Big picture strategist',
    'Creative problem solver',
    'Analytical thinker',
    'People-focused leader',
    'Process-oriented organizer'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const professional = {
      current_status: formData.current_status,
      job_title: formData.job_title,
      company_organization: formData.company_organization,
      industry: formData.industry,
      work_experience_years: formData.work_experience_years ? parseInt(formData.work_experience_years) : null,
      education_level: formData.education_level,
      field_of_study: formData.field_of_study,
      school_university: formData.school_university,
      graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
      additional_certifications: formData.additional_certifications.split(',').map(c => c.trim()).filter(c => c),
      career_goals: formData.career_goals.split(',').map(g => g.trim()).filter(g => g),
      key_achievements: formData.key_achievements.split(',').map(a => a.trim()).filter(a => a),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      work_style: formData.work_style
    };

    onNext({ professional });
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
        {/* Current Professional Status */}
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
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Current Professional Status</h3>
                <p className="text-sm text-gray-400 mt-1">Your current work situation</p>
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
                name="current_status"
                value={formData.current_status}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select your current status</option>
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Current Status *</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Job Title/Role</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="company_organization"
                value={formData.company_organization}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Company/Organization</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Industry</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="number"
                name="work_experience_years"
                value={formData.work_experience_years}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
                min="0"
                max="50"
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Years of Experience</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <select
                name="work_style"
                value={formData.work_style}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select your work style</option>
                {workStyleOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Work Style</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Education</h3>
                <p className="text-sm text-gray-400 mt-1">Your educational background</p>
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
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select education level</option>
                {educationLevels.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Education Level</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Field of Study</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                name="school_university"
                value={formData.school_university}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">School/University</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
                min="1950"
                max="2030"
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Graduation Year</label>
            </motion.div>

            <motion.div 
              className="floating-label md:col-span-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="additional_certifications"
                value={formData.additional_certifications}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Additional Certifications</label>
            </motion.div>
          </div>
        </motion.div>

        {/* Skills & Achievements */}
        <motion.div 
          className="card p-8 interactive-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="section-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Skills & Achievements</h3>
                <p className="text-sm text-gray-400 mt-1">What you excel at and have accomplished</p>
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
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Key Skills</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="key_achievements"
                value={formData.key_achievements}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Key Achievements</label>
            </motion.div>

            <motion.div 
              className="floating-label"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                name="career_goals"
                value={formData.career_goals}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder=" "
              />
              <label className="absolute -top-2 left-3 bg-black px-1 text-xs text-neutral-300">Career Goals</label>
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
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Excellent! Your professional profile is taking shape</span>
            <TrendingUp className="w-4 h-4" />
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Step2;