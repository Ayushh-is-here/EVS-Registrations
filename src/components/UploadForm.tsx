import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Copy, Check, AlertCircle, RefreshCw, Send, ArrowLeft, ExternalLink } from 'lucide-react';
import KineticHeading from './KineticHeading';
import CustomSelect from './CustomSelect';

interface StudentDetails {
  id: string;
  name: string;
  topic_title: string;
  has_uploaded: boolean;
}

const divisionOptions = [
  { value: 'A', label: 'Division A' },
  { value: 'B', label: 'Division B' },
  { value: 'C', label: 'Division C' },
  { value: 'D', label: 'Division D' },
  { value: 'E-Commerce', label: 'Division E-Commerce' },
  { value: 'E-Arts', label: 'Division E-Arts' },
];

// Target professor / submission inbox email address
const DEFAULT_SUBMISSION_EMAIL = 'ayushh108@gmail.com';

export default function UploadForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [lookupData, setLookupData] = useState({ division: 'A', rollNumber: '', name: '' });
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Safety guard: Lock user to Step 1 if student details are missing/unverified
  useEffect(() => {
    if (step === 2 && !studentDetails) {
      setStep(1);
    }
  }, [step, studentDetails]);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roll = lookupData.rollNumber.trim();
    const name = lookupData.name.trim();

    if (!roll || !name) {
      setError('Please enter both your Roll Number and Full Name before proceeding.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          division: lookupData.division,
          rollNumber: roll,
          name: name,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.student) {
        throw new Error(data.error || 'Student registration not found. Please check your Division, Roll Number, and Name.');
      }

      setStudentDetails(data.student);
      setStep(2);
    } catch (err: any) {
      console.error('Lookup error:', err);
      setStudentDetails(null);
      setError(err.message || 'Verification failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate structured email subject and body
  const emailSubject = studentDetails
    ? `[EVS Presentation] Div ${lookupData.division} | Roll ${lookupData.rollNumber} - ${studentDetails.name}`
    : '';

  const emailBody = studentDetails
    ? `Respected Professor,

Please find attached my Environmental Studies (EVS) presentation file.

--- STUDENT SUBMISSION DETAILS ---
Division: Division ${lookupData.division}
Roll Number: ${lookupData.rollNumber}
Student Name: ${studentDetails.name}
Topic Title: ${studentDetails.topic_title}

(Attached File: My Presentation .pptx / .pdf)

Thank you,
${studentDetails.name}`
    : '';

  // Direct Gmail Web Compose URL (bypasses OS mailto handler issues!)
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(DEFAULT_SUBMISSION_EMAIL)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  
  // Standard mailto link fallback
  const mailtoUrl = `mailto:${DEFAULT_SUBMISSION_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopySubject = () => {
    navigator.clipboard.writeText(emailSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(emailBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const isStep1Valid = lookupData.rollNumber.trim().length > 0 && lookupData.name.trim().length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[560px] px-2 sm:px-0"
    >
      <div className="editorial-card relative overflow-hidden !p-5 sm:!p-10">
        <div className="mb-6 sm:mb-8 text-center">
          <KineticHeading 
            as="h1" 
            text="Email Presentation" 
            className="text-3xl sm:text-4xl font-heading font-medium tracking-tight mb-2 text-ink"
            glowSweep
          />
          <p className="text-xs sm:text-sm text-ink-light font-sans font-light">
            {step === 1 ? "Verify your student registration details" : "Send your presentation directly via Gmail"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3.5 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs sm:text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <span className="leading-snug">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 ? (
          <form onSubmit={handleLookupSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="editorial-label text-xs sm:text-sm">Division</label>
              <CustomSelect
                options={divisionOptions}
                value={lookupData.division}
                onChange={(val) => setLookupData({ ...lookupData, division: val })}
                placeholder="Select Division"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="editorial-label text-xs sm:text-sm" htmlFor="rollNumber">Roll Number</label>
              <input 
                type="number"
                id="rollNumber"
                placeholder="e.g. 101"
                value={lookupData.rollNumber}
                onChange={(e) => setLookupData({ ...lookupData, rollNumber: e.target.value })}
                className="editorial-input min-h-[48px] text-base"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="editorial-label text-xs sm:text-sm" htmlFor="name">Full Name</label>
              <input 
                type="text"
                id="name"
                placeholder="Enter registered full name"
                value={lookupData.name}
                onChange={(e) => setLookupData({ ...lookupData, name: e.target.value })}
                className="editorial-input min-h-[48px] text-base"
                disabled={isLoading}
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="editorial-button-primary w-full py-3.5 text-sm sm:text-base min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isStep1Valid}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin h-5 w-5 text-white" />
                    Verifying Details...
                  </span>
                ) : 'Verify & Generate Email Draft'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Student Verified Banner */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-xs sm:text-sm">
              <span className="text-[10px] sm:text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                Verified Student Details
              </span>
              <p className="text-ink font-semibold text-sm sm:text-base mb-0.5">{studentDetails?.name}</p>
              <p className="text-ink-light text-xs mb-2">
                Division {lookupData.division} • Roll No. {lookupData.rollNumber}
              </p>
              <p className="text-ink-light text-xs border-t border-accent/20 pt-2 font-medium">
                Topic: <span className="text-accent">{studentDetails?.topic_title}</span>
              </p>
            </div>

            {/* Email Instructions Card */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>Prewritten Email Draft</span>
                </div>
                <span className="text-[11px] text-ink-light font-mono">To: {DEFAULT_SUBMISSION_EMAIL}</span>
              </div>

              {/* Subject Box */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-ink-light">Subject:</span>
                  <button 
                    onClick={handleCopySubject}
                    className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedSubject ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border text-xs font-mono text-ink truncate select-all">
                  {emailSubject}
                </div>
              </div>

              {/* Body Box */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-ink-light">Message Body:</span>
                  <button 
                    onClick={handleCopyBody}
                    className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedBody ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBody ? 'Copied' : 'Copy Message'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border text-xs font-sans text-ink leading-relaxed whitespace-pre-line select-all max-h-44 overflow-y-auto">
                  {emailBody}
                </div>
              </div>
            </div>

            {/* Direct Gmail & Mail App Actions */}
            <div className="space-y-3 pt-1">
              <a 
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-button-primary w-full py-3.5 flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base shadow-glow bg-[#EA4335] hover:bg-[#d93025] text-white border-0"
              >
                <Mail className="w-5 h-5" />
                <span>Open & Compose in Gmail</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              <a 
                href={mailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-button-secondary w-full py-2.5 flex items-center justify-center gap-2 min-h-[42px] text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Open Default Desktop Mail App</span>
              </a>

              <p className="text-[11px] text-center text-ink-light px-2">
                📌 <strong>Important:</strong> Remember to attach your presentation file (<code>.pptx</code> or <code>.pdf</code>) in Gmail before sending!
              </p>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="editorial-button-secondary w-full py-2.5 text-xs sm:text-sm min-h-[42px] flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Student Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
