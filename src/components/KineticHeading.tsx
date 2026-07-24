import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface KineticHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  glowSweep?: boolean;
}

const KineticHeading: React.FC<KineticHeadingProps> = ({ 
  text, 
  className = '', 
  as = 'h1',
  glowSweep = false 
}) => {
  const Component = as;
  const words = text.split(' ');

  // Separate margin classes (e.g. mb-2, mb-4, mb-6, my-*, mt-*) from other styling classes
  const classList = className.split(' ').filter(Boolean);
  const marginClasses = classList.filter(c => /^m[btlrxy]?-\d+/.test(c)).join(' ');
  const nonMarginClasses = classList.filter(c => !/^m[btlrxy]?-\d+/.test(c)).join(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      }
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${marginClasses}`}>
      <Component className={`${nonMarginClasses} flex flex-wrap justify-center overflow-visible pt-1 pb-3 leading-snug`}>
        <motion.span
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-[0.3em]"
        >
          {words.map((word, index) => (
            <motion.span key={index} variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Component>
      
      {glowSweep && (
        <motion.div
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 blur-[0.5px] mt-0.5"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ delay: 0.5 + words.length * 0.1, duration: 0.8, ease: 'easeOut' }}
        />
      )}
    </div>
  );
};

export default KineticHeading;
