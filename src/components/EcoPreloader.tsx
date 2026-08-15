import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EcoPreloaderProps {
  progress: number;
  isReady: boolean;
}

const STATUS_MESSAGES = [
  { threshold: 0, title: 'SYSTEM INITIALIZATION', detail: 'Calibrating environmental matrix' },
  { threshold: 25, title: 'SYNTHESIZING VEIN NETWORKS', detail: 'Tracing botanical vascular pathways' },
  { threshold: 55, title: 'COMPUTING BIODIVERSITY GRID', detail: 'Aligning ecosystem parameters' },
  { threshold: 80, title: 'SYNCHRONIZING ATMOSPHERE', detail: 'Buffering live environment stream' },
  { threshold: 98, title: 'ENVIRONMENT ONLINE', detail: 'Biosphere initialized successfully' },
];

export const EcoPreloader: React.FC<EcoPreloaderProps> = ({ progress, isReady }) => {
  const [activeMessage, setActiveMessage] = useState(STATUS_MESSAGES[0]);

  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const progressRatio = normalizedProgress / 100;

  useEffect(() => {
    const msg = [...STATUS_MESSAGES].reverse().find((m) => normalizedProgress >= m.threshold) || STATUS_MESSAGES[0];
    setActiveMessage(msg);
  }, [normalizedProgress]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="eco-vector-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(16px)',
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-3xl px-6 select-none overflow-hidden"
        >
          {/* Subtle Ambient Light Gradients */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-accent/10 blur-[150px] pointer-events-none -top-24" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/8 blur-[130px] pointer-events-none -bottom-24" />

          {/* Technical Corner Brackets / Grid Accents */}
          <div className="absolute top-8 left-8 text-[10px] font-mono tracking-widest text-ink-light/40 uppercase hidden sm:block">
            LOC // 18.5204° N, 73.8567° E
          </div>
          <div className="absolute top-8 right-8 text-[10px] font-mono tracking-widest text-ink-light/40 uppercase hidden sm:block">
            ENV_SYS // LIVE_FEED
          </div>
          <div className="absolute bottom-8 left-8 text-[10px] font-mono tracking-widest text-ink-light/40 uppercase hidden sm:block">
            SYMBIOSIS // MATRIX
          </div>
          <div className="absolute bottom-8 right-8 text-[10px] font-mono tracking-widest text-ink-light/40 uppercase hidden sm:block">
            V4.2.0 // STABLE
          </div>

          {/* Main Animated Vector Artwork (Dynamic Leaf & Biosphere Drawing) */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
            <svg
              viewBox="0 0 240 240"
              className="w-full h-full text-accent drop-shadow-[0_0_16px_rgba(var(--color-accent),0.25)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Technical Orbital Rings */}
              <motion.circle
                cx="120"
                cy="120"
                r="110"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="opacity-25"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '120px', originY: '120px' }}
              />

              <motion.circle
                cx="120"
                cy="120"
                r="96"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="40 12 10 12"
                className="opacity-35"
                animate={{ rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '120px', originY: '120px' }}
              />

              {/* Dynamic Progress Arc with Glowing Tip */}
              <circle
                cx="120"
                cy="120"
                r="86"
                stroke="currentColor"
                strokeWidth="1.5"
                className="opacity-15"
              />
              <motion.circle
                cx="120"
                cy="120"
                r="86"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 86}
                strokeDashoffset={(2 * Math.PI * 86) * (1 - progressRatio)}
                className="opacity-90 transition-all duration-200"
                style={{
                  transformOrigin: 'center',
                  transform: 'rotate(-90deg)',
                }}
              />

              {/* ROOT SYSTEM (Draws 0% - 30%) */}
              <motion.path
                d="M 120 160 Q 110 185 92 198"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(1, progressRatio * 3.3) }}
                className="opacity-60"
              />
              <motion.path
                d="M 120 160 Q 130 185 148 198"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(1, progressRatio * 3.3) }}
                className="opacity-60"
              />
              <motion.path
                d="M 120 160 V 205"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(1, progressRatio * 3.3) }}
                className="opacity-75"
              />

              {/* MAIN STEM / SPINAL TRUNK (Draws 0% - 100%) */}
              <motion.path
                d="M 120 165 C 120 120 120 80 120 38"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressRatio }}
                className="opacity-95"
              />

              {/* LEFT LEAF CONTOUR (Draws 15% - 80%) */}
              <motion.path
                d="M 120 148 C 65 125 55 70 120 38"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.15) * 1.5)),
                }}
                className="opacity-80"
              />

              {/* RIGHT LEAF CONTOUR (Draws 20% - 85%) */}
              <motion.path
                d="M 120 148 C 175 125 185 70 120 38"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.2) * 1.5)),
                }}
                className="opacity-80"
              />

              {/* LEFT VASCULAR VEINS (Draws 35% - 95%) */}
              <motion.path
                d="M 120 130 Q 90 118 78 102"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.35) * 2.2)),
                }}
                className="opacity-60"
              />
              <motion.path
                d="M 120 108 Q 94 92 84 76"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.45) * 2.2)),
                }}
                className="opacity-60"
              />
              <motion.path
                d="M 120 84 Q 102 70 94 56"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.55) * 2.2)),
                }}
                className="opacity-60"
              />

              {/* RIGHT VASCULAR VEINS (Draws 40% - 95%) */}
              <motion.path
                d="M 120 130 Q 150 118 162 102"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.4) * 2.2)),
                }}
                className="opacity-60"
              />
              <motion.path
                d="M 120 108 Q 146 92 156 76"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.5) * 2.2)),
                }}
                className="opacity-60"
              />
              <motion.path
                d="M 120 84 Q 138 70 146 56"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: Math.max(0, Math.min(1, (progressRatio - 0.6) * 2.2)),
                }}
                className="opacity-60"
              />

              {/* Bioluminescent Micro-Nodes */}
              {progressRatio >= 0.35 && (
                <circle cx="120" cy="160" r="3" fill="currentColor" className="animate-ping opacity-60" />
              )}
              {progressRatio >= 0.75 && (
                <circle cx="120" cy="38" r="3.5" fill="currentColor" className="animate-pulse opacity-90" />
              )}
              {progressRatio >= 0.9 && (
                <>
                  <circle cx="78" cy="102" r="2" fill="currentColor" className="opacity-80" />
                  <circle cx="162" cy="102" r="2" fill="currentColor" className="opacity-80" />
                  <circle cx="84" cy="76" r="2" fill="currentColor" className="opacity-80" />
                  <circle cx="156" cy="76" r="2" fill="currentColor" className="opacity-80" />
                </>
              )}
            </svg>
          </div>

          {/* Precision Percentage Display */}
          <div className="flex flex-col items-center gap-1.5 mb-6">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-ink tabular-nums">
                {Math.min(100, Math.floor(normalizedProgress)).toString().padStart(2, '0')}
              </span>
              <span className="font-mono text-lg font-medium text-accent">%</span>
            </div>

            {/* Precision Micro Progress Rail */}
            <div className="w-48 sm:w-56 h-[3px] bg-border/40 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-accent rounded-full"
                style={{ width: `${normalizedProgress}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>
          </div>

          {/* Minimalist Technical Status */}
          <motion.div
            key={activeMessage.title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center max-w-xs"
          >
            <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-ink uppercase">
              {activeMessage.title}
            </span>
            <span className="text-[11px] sm:text-xs text-ink-light font-body mt-0.5 tracking-normal">
              {activeMessage.detail}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EcoPreloader;
