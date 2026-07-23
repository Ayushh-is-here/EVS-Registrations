const Leaf = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.75 3.99997C17.75 3.99997 12 2.99997 7.5 7.49997C3 12 3.5 17.5 3.5 17.5C3.5 17.5 4.5 19 6.5 19C8.5 19 9.5 17.5 9.5 17.5C9.5 17.5 16 17 20 12.5C24 7.99997 17.75 3.99997 17.75 3.99997ZM15.5 10.5L9.5 16.5L8 15L14 9L15.5 10.5Z" />
  </svg>
);

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-300">
      
      {/* Floating Leaves */}
      <Leaf className="particle" style={{ left: '10%', animationDelay: '0s', animationDuration: '35s' }} />
      <Leaf className="particle" style={{ left: '25%', animationDelay: '-12s', animationDuration: '40s', transform: 'scale(0.8)' }} />
      <Leaf className="particle" style={{ left: '40%', animationDelay: '-25s', animationDuration: '32s', transform: 'scale(1.2)' }} />
      <Leaf className="particle" style={{ left: '60%', animationDelay: '-5s', animationDuration: '38s' }} />
      <Leaf className="particle" style={{ left: '75%', animationDelay: '-18s', animationDuration: '45s', transform: 'scale(0.7)' }} />
      <Leaf className="particle" style={{ left: '90%', animationDelay: '-30s', animationDuration: '36s', transform: 'scale(1.5)' }} />

      {/* Subtle noise texture overlay for atmosphere */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] z-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
