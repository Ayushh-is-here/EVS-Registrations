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
    <div className="relative inline-block">
      <Component className={`${className} flex flex-wrap justify-center overflow-hidden py-2`}>
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
          className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent w-full opacity-50 blur-[1px]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ delay: 0.5 + words.length * 0.1, duration: 1, ease: 'easeOut' }}
        />
      )}
    </div>
  );
};

export default KineticHeading;
