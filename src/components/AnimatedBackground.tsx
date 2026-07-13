import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div 
        className="absolute animate-blob" 
        style={{
          top: '-10%', left: '-10%', width: '70vw', height: '70vw', 
          background: 'var(--primary-glow)',
          opacity: 0.15,
          filter: 'blur(100px)',
          borderRadius: '50%',
          position: 'absolute'
        }}
      />
      <div 
        className="absolute animate-blob animation-delay-2000"
        style={{
          top: '20%', right: '-20%', width: '60vw', height: '60vw', 
          background: 'var(--secondary-glow)',
          opacity: 0.15,
          filter: 'blur(100px)',
          borderRadius: '50%',
          position: 'absolute'
        }}
      />
      <div 
        className="absolute animate-blob animation-delay-4000"
        style={{
          bottom: '-20%', left: '10%', width: '80vw', height: '80vw', 
          background: 'var(--tertiary-glow)',
          opacity: 0.15,
          filter: 'blur(100px)',
          borderRadius: '50%',
          position: 'absolute'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
