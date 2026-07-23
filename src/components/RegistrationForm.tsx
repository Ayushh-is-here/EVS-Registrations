import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import CustomSelect from './CustomSelect';

import KineticHeading from './KineticHeading';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    division: '',
    rollNumber: '',
    name: '',
    topic: '',
    isGroup: false,
    member2RollNumber: '',
    member2Name: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const divisions = ['A', 'B', 'C', 'D', 'E-Commerce', 'E-Arts'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.division || !formData.rollNumber || !formData.name.trim() || !formData.topic.trim()) {
      setError('Please fill out all primary fields.');
      return;
    }

    if (formData.isGroup && (!formData.member2RollNumber || !formData.member2Name.trim())) {
      setError('Please fill out all fields for Member 2.');
      return;
    }

    if (isNaN(Number(formData.rollNumber)) || Number(formData.rollNumber) <= 0) {
      setError('Please enter a valid roll number for Member 1.');
      return;
    }

    if (formData.isGroup && (isNaN(Number(formData.member2RollNumber)) || Number(formData.member2RollNumber) <= 0)) {
      setError('Please enter a valid roll number for Member 2.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit registration right now. Please try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong. Please try again in a few moments.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[520px]"
      >
        <div className="editorial-card !p-0">
          <div className="p-8 md:p-10 w-full h-full flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-8 relative shadow-glow"
            >
              <div className="absolute inset-0 rounded-full border border-accent/40 animate-ping opacity-50" />
              <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <KineticHeading as="h2" text="Topic Registered" className="text-3xl mb-4 font-heading text-ink" glowSweep />

            <p className="text-ink-light mb-8 max-w-md text-center">
              Your topic has been successfully registered. Come back to the Upload page and enter your Division + Roll Number + Name to find your submission when you're ready.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="editorial-button-primary w-full max-w-xs"
            >
              Go to Upload Page
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full max-w-[520px] ${error ? 'animate-shake' : ''}`}
    >
      <div className={`editorial-card !p-0 ${error ? 'error-glow' : ''}`}>
        <div className="p-8 md:p-10 w-full h-full">
          <div className="mb-10 text-center">
            <KineticHeading
              text="EVS Registration"
              className="text-4xl md:text-5xl mb-4 text-ink font-heading"
              glowSweep
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-ink-light"
            >
              Symbiosis College of Arts and Commerce
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <motion.div variants={itemVariants}>
                <label className="editorial-label" htmlFor="division">Division</label>
                <CustomSelect
                  options={divisions.map(d => ({ value: d, label: d }))}
                  value={formData.division}
                  onChange={(val) => setFormData(prev => ({ ...prev, division: val }))}
                  placeholder="Select Division"
                  disabled={isSubmitting}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="editorial-label" htmlFor="rollNumber">Roll Number (Member 1)</label>
                <input
                  type="number"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 104"
                  className="editorial-input"
                  disabled={isSubmitting}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <label className="editorial-label" htmlFor="name">Full Name (Member 1)</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Student Name"
                className="editorial-input"
                disabled={isSubmitting}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="my-6">
              <label className="editorial-label mt-0">Presentation Format</label>
              <div className="relative flex items-center p-1 bg-surface border border-border rounded-xl">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setFormData(prev => ({ ...prev, isGroup: false }))}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${!formData.isGroup ? 'text-ink' : 'text-ink-light hover:text-ink'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Individual
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setFormData(prev => ({ ...prev, isGroup: true }))}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${formData.isGroup ? 'text-ink' : 'text-ink-light hover:text-ink'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Group (2)
                </button>
                <div
                  className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-background border border-border shadow-sm rounded-lg transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${formData.isGroup ? 'translate-x-full' : 'translate-x-0'}`}
                ></div>
              </div>
            </motion.div>

            {formData.isGroup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-x-6 gap-y-4 mb-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <div>
                    <label className="editorial-label mt-0" htmlFor="member2RollNumber">Roll Number (Member 2)</label>
                    <input
                      type="number"
                      id="member2RollNumber"
                      name="member2RollNumber"
                      value={formData.member2RollNumber}
                      onChange={handleChange}
                      placeholder="e.g. 105"
                      className="editorial-input"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="editorial-label mt-0 md:mt-0" htmlFor="member2Name">Full Name (Member 2)</label>
                    <input
                      type="text"
                      id="member2Name"
                      name="member2Name"
                      value={formData.member2Name}
                      onChange={handleChange}
                      placeholder="Student Name"
                      className="editorial-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="editorial-label" htmlFor="topic">EVS Topic</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Title of your presentation"
                className="editorial-input"
                disabled={isSubmitting}
              />
              <p className="mt-2 text-xs text-ink-light">
                Note: Once registered, your topic cannot be changed online.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                className="editorial-button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : 'Register Topic'}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-2">
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="editorial-button-secondary"
                disabled={isSubmitting}
              >
                Already registered? Upload your presentation here
              </button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;
