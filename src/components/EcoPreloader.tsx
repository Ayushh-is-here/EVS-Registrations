import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Sparkles, Globe, Leaf } from 'lucide-react';

interface EcoPreloaderProps {
  progress: number;
  isReady: boolean;
}

const ECO_STAGES = [
  { threshold: 0, text: '🌱 Germinating Ecosystem Matrix...', sub: 'Initializing botanical environment' },
  { threshold: 28, text: '🍃 Synthesizing Chlorophyll & Airflow...', sub: 'Buffering high-definition stream' },
  { threshold: 58, text: '🌿 Calibrating Biodiversity Networks...', sub: 'Aligning environmental data' },
  { threshold: 85, text: '✨ Restoring Biosphere Balance...', sub: 'Finalizing live visual dynamics' },
  { threshold: 100, text: '🌍 Biosphere Ready', sub: 'Welcome to EVS Portal' },
];

export const EcoPreloader: React.FC<EcoPreloaderProps> = ({ progress, isReady }) => {
  const [currentStage, setCurrentStage] = useState(ECO_STAGES[0]);

  useEffect(() => {
    const stage = [...ECO_STAGES].reverse().find((s) => progress >= s.threshold) || ECO_STAGES[0];
    setCurrentStage(stage);
  }, [progress]);

  // Radius for circular progress ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="eco-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(12px)',
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl px-6 text-center select-none overflow-hidden"
        >
          {/* Ambient Glowing Orbs in Background */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-[130px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none" />
          
          {/* Central Circular Biosphere Graphic */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Pulsing Outer Glow */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-36 h-36 rounded-full bg-accent/25 blur-xl pointer-events-none"
            />

            {/* SVG Circular Progress Ring */}
            <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 128 128">
              {/* Background Track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-border dark:stroke-border/40"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Active Animated Progress Arc */}
              <motion.circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-accent"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: 'drop-shadow(0 0 8px currentColor)',
                  transition: 'stroke-dashoffset 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </svg>

            {/* Central Animated Plant Sprout Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [0.92, 1.08, 0.92],
                  rotate: [0, 4, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-14 h-14 rounded-full bg-surface shadow-lg border border-border/80 flex items-center justify-center text-accent"
              >
                {progress < 40 ? (
                  <Sprout className="w-7 h-7 animate-pulse" />
                ) : progress < 85 ? (
                  <Leaf className="w-7 h-7 transition-all duration-300" />
                ) : (
                  <Globe className="w-7 h-7 text-accent transition-all duration-300" />
                )}
              </motion.div>
            </div>
          </div>

          {/* Percentage Counter with Monospace Tabular Figure */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-ink tabular-nums">
              {Math.min(100, Math.floor(progress))}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-accent">%</span>
          </div>

          {/* Dynamic Eco Status Stage */}
          <motion.div
            key={currentStage.text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center max-w-sm"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-soft/50 border border-accent/20 text-ink text-xs sm:text-sm font-medium mb-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '4s' }} />
              <span>{currentStage.text}</span>
            </div>
            <p className="text-xs text-ink-light font-body tracking-wide">
              {currentStage.sub}
            </p>
          </motion.div>

          {/* Subtle Eco-Theme Bottom Decorative Line */}
          <div className="absolute bottom-8 flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-light/60 font-semibold">
            <span className="w-8 h-[1px] bg-border" />
            <span>Environmental Studies Portal</span>
            <span className="w-8 h-[1px] bg-border" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EcoPreloader;
