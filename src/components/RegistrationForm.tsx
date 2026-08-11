import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Check, AlertCircle, AlertTriangle, Loader2, CheckCircle2, BookOpen, Mail, Copy, Info, Image } from 'lucide-react';
import { toPng } from 'html-to-image';
import CustomSelect from './CustomSelect';
import KineticHeading from './KineticHeading';

interface ExistingTopic {
  id: number;
  division: string;
  topic: string;
  project_topic?: string | null;
  member2_project_topic?: string | null;
}

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
    projectTopic: '',
    isGroup: false,
    member2RollNumber: '',
    member2Name: '',
    member2ProjectTopic: ''
  });

  const [existingTopics, setExistingTopics] = useState<ExistingTopic[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Live roll checking states
  const [checkingRoll1, setCheckingRoll1] = useState(false);
  const [roll1Status, setRoll1Status] = useState<{ valid: boolean; taken?: boolean; message?: string } | null>(null);

  const [checkingRoll2, setCheckingRoll2] = useState(false);
  const [roll2Status, setRoll2Status] = useState<{ valid: boolean; taken?: boolean; message?: string } | null>(null);

  const divisions = ['A', 'B', 'C', 'D', 'E-Commerce', 'E-Arts'];

  const generateSummaryText = () => {
    return `=== EVS TOPIC REGISTRATION RECEIPT ===
Symbiosis College of Arts and Commerce
Division: Division ${formData.division}
Format: ${formData.isGroup ? 'Group Presentation (2 Members)' : 'Individual Presentation'}

--- STUDENT DETAILS ---
Name: ${formData.name}
Roll Number: ${formData.rollNumber}
${formData.projectTopic ? `Blue Book Project Topic: ${formData.projectTopic}` : ''}

${formData.isGroup && formData.member2Name ? `--- MEMBER 2 DETAILS ---
Name: ${formData.member2Name}
Roll Number: ${formData.member2RollNumber}
${formData.member2ProjectTopic ? `Blue Book Project Topic: ${formData.member2ProjectTopic}` : ''}` : ''}

--- REGISTERED SEMINAR TOPIC ---
Topic: ${formData.topic}

Registered Date: ${new Date().toLocaleString()}
=====================================`;
  };

  const receiptRef = useRef<HTMLDivElement>(null);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          borderRadius: '24px',
          padding: '24px',
        }
      });
      const link = document.createElement('a');
      link.download = `EVS_Registration_Div${formData.division}_Roll${formData.rollNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture receipt screenshot:', err);
    }
  };

  // Fetch registered topics on mount for live similarity checking
  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        if (data.topics) {
          setExistingTopics(data.topics);
        }
      })
      .catch(() => {});
  }, []);

  // Live check roll 1 (global check across all divisions)
  const checkRoll1Availability = useCallback(async (roll: string) => {
    if (!roll) {
      setRoll1Status(null);
      return;
    }
    const num = parseInt(roll);
    if (isNaN(num) || num < 2000 || num > 3000) {
      setRoll1Status({ valid: false, message: 'Enter a valid roll number between 2000 and 3000.' });
      return;
    }

    setCheckingRoll1(true);
    try {
      const res = await fetch(`/api/check-roll?rollNumber=${num}`);
      const data = await res.json().catch(() => ({}));
      if (data.taken) {
        setRoll1Status({
          valid: false,
          taken: true,
          message: 'This roll number has already registered a topic'
        });
      } else {
        setRoll1Status({ valid: true, taken: false });
      }
    } catch {
      setRoll1Status(null);
    } finally {
      setCheckingRoll1(false);
    }
  }, []);

  // Live check roll 2 (global check across all divisions)
  const checkRoll2Availability = useCallback(async (roll: string, roll1: string) => {
    if (!roll) {
      setRoll2Status(null);
      return;
    }
    const num = parseInt(roll);
    if (isNaN(num) || num < 2000 || num > 3000) {
      setRoll2Status({ valid: false, message: 'Member 2 roll number must be between 2000 and 3000.' });
      return;
    }
    if (roll === roll1) {
      setRoll2Status({ valid: false, message: 'Member 1 and Member 2 cannot have the exact same roll number.' });
      return;
    }

    setCheckingRoll2(true);
    try {
      const res = await fetch(`/api/check-roll?rollNumber=${num}`);
      const data = await res.json().catch(() => ({}));
      if (data.taken) {
        setRoll2Status({
          valid: false,
          taken: true,
          message: 'This roll number has already registered a topic'
        });
      } else {
        setRoll2Status({ valid: true, taken: false });
      }
    } catch {
      setRoll2Status(null);
    } finally {
      setCheckingRoll2(false);
    }
  }, []);

  // Trigger check immediately as user types 4 digits (regardless of division selection)
  useEffect(() => {
    if (formData.rollNumber.trim().length >= 4) {
      checkRoll1Availability(formData.rollNumber.trim());
    } else {
      setRoll1Status(null);
    }
  }, [formData.rollNumber, checkRoll1Availability]);

  useEffect(() => {
    if (formData.isGroup && formData.member2RollNumber.trim().length >= 4) {
      checkRoll2Availability(formData.member2RollNumber.trim(), formData.rollNumber.trim());
    } else {
      setRoll2Status(null);
    }
  }, [formData.isGroup, formData.member2RollNumber, formData.rollNumber, checkRoll2Availability]);

  // Helper function to find similar topics
  const getSimilarTopics = (inputTopic: string): string[] => {
    const text = inputTopic.trim().toLowerCase();
    if (text.length < 3) return [];

    const matches = new Set<string>();
    existingTopics.forEach(item => {
      if (item.topic && item.topic.toLowerCase().includes(text)) {
        matches.add(item.topic);
      }
      if (item.project_topic && item.project_topic.toLowerCase().includes(text)) {
        matches.add(item.project_topic);
      }
      if (item.member2_project_topic && item.member2_project_topic.toLowerCase().includes(text)) {
        matches.add(item.member2_project_topic);
      }
    });

    return Array.from(matches).slice(0, 3);
  };

  const similarPresentationTopics = getSimilarTopics(formData.topic);
  const similarProject1Topics = getSimilarTopics(formData.projectTopic);
  const similarProject2Topics = formData.isGroup ? getSimilarTopics(formData.member2ProjectTopic) : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Instant validation check for roll numbers
    if (roll1Status && !roll1Status.valid) {
      setError(roll1Status.message || 'Please correct the roll number for Member 1.');
      return;
    }
    if (formData.isGroup && roll2Status && !roll2Status.valid) {
      setError(roll2Status.message || 'Please correct the roll number for Member 2.');
      return;
    }

    // Basic validation for Member 1
    if (!formData.division || !formData.rollNumber || !formData.name.trim() || !formData.topic.trim() || !formData.projectTopic.trim()) {
      setError('Please fill out all required fields for Member 1, including Seminar Topic and Blue Book Project Topic.');
      return;
    }

    if (formData.isGroup) {
      if (!formData.member2RollNumber || !formData.member2Name.trim() || !formData.member2ProjectTopic.trim()) {
        setError('Please fill out all fields for Member 2, including their Blue Book Project Topic.');
        return;
      }

      if (formData.projectTopic.trim().toLowerCase() === formData.member2ProjectTopic.trim().toLowerCase()) {
        setError('Member 1 and Member 2 cannot choose the exact same Blue Book Project Topic. Each student must have a unique Blue Book Project Topic.');
        return;
      }
    }

    if (isNaN(Number(formData.rollNumber)) || Number(formData.rollNumber) < 2000 || Number(formData.rollNumber) > 3000) {
      setError('Please enter a valid roll number between 2000 and 3000 for Member 1.');
      return;
    }

    if (formData.isGroup && (isNaN(Number(formData.member2RollNumber)) || Number(formData.member2RollNumber) < 2000 || Number(formData.member2RollNumber) > 3000)) {
      setError('Please enter a valid roll number between 2000 and 3000 for Member 2.');
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
        throw new Error(data.error || `Registration failed (${response.status}). Please verify server setup or try again.`);
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
        className="w-full max-w-[540px] mx-auto px-2 sm:px-0"
      >
        <div className="editorial-card relative overflow-hidden !p-5 sm:!p-8">
          <div ref={receiptRef} className="w-full flex flex-col items-center bg-surface p-6 sm:p-8 rounded-3xl">
            {/* Animated Success Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 relative shadow-glow"
            >
              <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping opacity-40" />
              <CheckCircle2 className="w-8 h-8" />
            </motion.div>

            <KineticHeading as="h2" text="Registration Confirmed!" className="text-2xl sm:text-3xl mb-1 font-heading font-bold text-ink" glowSweep />
            <p className="text-ink-light text-xs sm:text-sm text-center mb-6">
              Your EVS topic registration has been recorded successfully.
            </p>

            {/* Detailed Registration Summary Card */}
            <div className="w-full bg-background border border-border rounded-2xl p-5 space-y-4 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  REGISTRATION DETAILS
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface border border-border text-ink">
                  Division {formData.division} • {formData.isGroup ? 'Group' : 'Individual'}
                </span>
              </div>

              {/* Member 1 Info */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-light tracking-wider block">
                  {formData.isGroup ? 'Student Member 1' : 'Student Details'}
                </span>
                <p className="text-sm sm:text-base font-semibold text-ink">
                  {formData.name} <span className="font-mono text-xs text-ink-light font-normal">(Roll No. {formData.rollNumber})</span>
                </p>
                {formData.projectTopic && (
                  <p className="text-xs text-ink-light">
                    Blue Book Project: <span className="text-ink font-medium">{formData.projectTopic}</span>
                  </p>
                )}
              </div>

              {/* Member 2 Info if group */}
              {formData.isGroup && formData.member2Name && (
                <div className="pt-2 border-t border-border/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink-light tracking-wider block">
                    Student Member 2
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-ink">
                    {formData.member2Name} <span className="font-mono text-xs text-ink-light font-normal">(Roll No. {formData.member2RollNumber})</span>
                  </p>
                  {formData.member2ProjectTopic && (
                    <p className="text-xs text-ink-light">
                      Blue Book Project: <span className="text-ink font-medium">{formData.member2ProjectTopic}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Seminar Topic */}
              <div className="pt-2 border-t border-border/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                  Registered Seminar Topic
                </span>
                <p className="text-base font-semibold text-ink leading-snug">
                  {formData.topic}
                </p>
              </div>
            </div>
          </div>

          {/* Save Advice Disclaimer Banner (Excluded from downloaded image) */}
          <div className="w-full mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
            <Info className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="leading-relaxed font-sans">
              <strong className="font-semibold block mb-1 text-amber-800 dark:text-amber-300">Important Advice:</strong>
              Please save a copy or take a screenshot of your registration details now for your future reference when submitting your presentation file.
            </div>
          </div>

          {/* Action Buttons (Excluded from downloaded image) */}
          <div className="w-full space-y-3 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="editorial-button-primary py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Image className="w-4 h-4" />
                <span>Download Image Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="editorial-button-secondary py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-accent" />}
                <span>{copiedSummary ? 'Copied Details!' : 'Copy Summary Text'}</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/topics')}
              className="editorial-button-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-accent" />
              <span>View All Registered Topics</span>
            </button>

            <button
              onClick={() => navigate('/upload')}
              className="editorial-button-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-accent" />
              <span>Go to Submissions / Uploads Page</span>
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
          <div className="mb-10 text-center flex flex-col items-center">
            <KineticHeading
              text="Register a Topic"
              className="text-3xl sm:text-4xl mb-3 text-ink font-heading font-bold"
              glowSweep
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-ink-light text-sm sm:text-base font-medium mt-1"
            >
              Fill in the details below to register your EVS topic.
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <motion.div variants={itemVariants}>
                <label className="editorial-label" htmlFor="division">
                  Division <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={divisions.map(d => ({ value: d, label: d }))}
                  value={formData.division}
                  onChange={(val) => setFormData(prev => ({ ...prev, division: val }))}
                  placeholder="Select Division"
                  disabled={isSubmitting}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="editorial-label" htmlFor="rollNumber">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    onBlur={() => {
                      if (formData.rollNumber.trim()) {
                        checkRoll1Availability(formData.rollNumber.trim());
                      }
                    }}
                    min={2000}
                    max={3000}
                    placeholder="2712"
                    className={`editorial-input pr-10 transition-colors ${
                      roll1Status?.valid === true 
                        ? '!border-emerald-500 focus:!border-emerald-500' 
                        : roll1Status?.valid === false 
                        ? '!border-red-500 focus:!border-red-500 ring-1 ring-red-500' 
                        : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                    {checkingRoll1 ? (
                      <Loader2 className="w-5 h-5 animate-spin text-ink-light" />
                    ) : roll1Status?.valid === true ? (
                      <Check className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
                    ) : roll1Status?.valid === false ? (
                      <AlertCircle className="w-5 h-5 text-red-500 stroke-[2.5]" />
                    ) : null}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-ink-light font-sans">
                  Enter your 4-digit roll number
                </p>
                {roll1Status?.valid === false && (
                  <p className="mt-1 text-xs text-red-500 font-semibold leading-snug">
                    {roll1Status.message}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <label className="editorial-label" htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </label>
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

            <motion.div variants={itemVariants} className="my-1">
              <label className="editorial-label mt-0">
                Presentation Format <span className="text-red-500">*</span>
              </label>
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
                className="flex flex-col gap-y-4 mb-2 overflow-hidden p-4 rounded-xl bg-accent/5 border border-accent/15"
              >
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Member 2 Details</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="editorial-label mt-0" htmlFor="member2RollNumber">
                      Roll Number (Member 2) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="member2RollNumber"
                        name="member2RollNumber"
                        value={formData.member2RollNumber}
                        onChange={handleChange}
                        onBlur={() => {
                          if (formData.member2RollNumber.trim()) {
                            checkRoll2Availability(formData.member2RollNumber.trim(), formData.rollNumber.trim());
                          }
                        }}
                        min={2000}
                        max={3000}
                        placeholder="2713"
                        className={`editorial-input pr-10 transition-colors ${
                          roll2Status?.valid === true 
                            ? '!border-emerald-500 focus:!border-emerald-500' 
                            : roll2Status?.valid === false 
                            ? '!border-red-500 focus:!border-red-500 ring-1 ring-red-500' 
                            : ''
                        }`}
                        disabled={isSubmitting}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                        {checkingRoll2 ? (
                          <Loader2 className="w-5 h-5 animate-spin text-ink-light" />
                        ) : roll2Status?.valid === true ? (
                          <Check className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
                        ) : roll2Status?.valid === false ? (
                          <AlertCircle className="w-5 h-5 text-red-500 stroke-[2.5]" />
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-ink-light font-sans">
                      Enter Member 2 4-digit roll number
                    </p>
                    {roll2Status?.valid === false && (
                      <p className="mt-1 text-xs text-red-500 font-semibold leading-snug">
                        {roll2Status.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="editorial-label mt-0" htmlFor="member2Name">
                      Full Name (Member 2) <span className="text-red-500">*</span>
                    </label>
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

                <div>
                  <label className="editorial-label" htmlFor="member2ProjectTopic">
                    EVS Blue Book Project Topic (Member 2) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="member2ProjectTopic"
                      name="member2ProjectTopic"
                      value={formData.member2ProjectTopic}
                      onChange={handleChange}
                      maxLength={120}
                      placeholder="Individual Blue Book topic for Member 2"
                      className={`editorial-input pr-10 ${
                        formData.member2ProjectTopic.trim().length >= 3 ? '!border-emerald-500/80' : ''
                      }`}
                      disabled={isSubmitting}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                      {formData.member2ProjectTopic.trim().length >= 3 && (
                        <Check className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] text-ink-light text-right mt-1 font-mono">
                    {formData.member2ProjectTopic.length}/120
                  </div>

                  {similarProject2Topics.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2 mt-2"
                    >
                      <div className="flex items-start gap-2 font-semibold text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Looks like similar topics have already been selected:</span>
                      </div>
                      <ul className="pl-6 list-disc space-y-1 font-medium italic">
                        {similarProject2Topics.map(t => (
                          <li key={t}>"{t}"</li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 pt-0.5">
                        You can still continue, but choosing something different might help your project stand out.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <label className="editorial-label" htmlFor="topic">
                  Topic <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder="Title of your presentation"
                    className={`editorial-input pr-10 ${
                      formData.topic.trim().length >= 3 ? '!border-emerald-500/80' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                    {formData.topic.trim().length >= 3 && (
                      <Check className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-ink-light text-right mt-1 font-mono">
                  {formData.topic.length}/120
                </div>

                {similarPresentationTopics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2 mt-2"
                  >
                    <div className="flex items-start gap-2 font-semibold text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Looks like similar topics have already been selected:</span>
                    </div>
                    <ul className="pl-6 list-disc space-y-1 font-medium italic">
                      {similarPresentationTopics.map(t => (
                        <li key={t}>"{t}"</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 pt-0.5">
                      You can still continue, but choosing something different might help your presentation stand out.
                    </p>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="editorial-label" htmlFor="projectTopic">
                  EVS Blue Book Project Topic {formData.isGroup ? '(Member 1)' : '(Blue Book)'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="projectTopic"
                    name="projectTopic"
                    value={formData.projectTopic}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder="Individual Blue Book topic"
                    className={`editorial-input pr-10 ${
                      formData.projectTopic.trim().length >= 3 ? '!border-emerald-500/80' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                    {formData.projectTopic.trim().length >= 3 && (
                      <Check className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-ink-light text-right mt-1 font-mono">
                  {formData.projectTopic.length}/120
                </div>

                {similarProject1Topics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2 mt-2"
                  >
                    <div className="flex items-start gap-2 font-semibold text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Looks like similar topics have already been selected:</span>
                    </div>
                    <ul className="pl-6 list-disc space-y-1 font-medium italic">
                      {similarProject1Topics.map(t => (
                        <li key={t}>"{t}"</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 pt-0.5">
                      You can still continue, but choosing something different might help your project stand out.
                    </p>
                  </motion.div>
                )}

                <p className="mt-2 text-xs text-ink-light font-body">
                  Note: Each student in a group must have a unique Blue Book Project Topic. Once registered, topics cannot be changed online.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                className="editorial-button-primary"
                disabled={isSubmitting || (roll1Status?.valid === false) || (formData.isGroup && roll2Status?.valid === false)}
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
