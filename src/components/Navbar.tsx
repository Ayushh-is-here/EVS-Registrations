import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardEdit, Mail, BookOpen, Info, Shield, FileText } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: 'Register', path: '/register', icon: ClipboardEdit },
    { name: 'Submit', path: '/upload', icon: Mail },
    { name: 'Topics', path: '/topics', icon: BookOpen },
    { name: 'Assignments', path: '/assignments', icon: FileText },
    { name: 'Guidelines', path: '/guidelines', icon: Info },
    { name: 'Admin', path: '/admin', icon: Shield },
  ];

  return (
    <>
      {/* Mobile Top Header with Theme Toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 flex md:hidden justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-lg border-b border-border/50">
        <span className="font-heading font-bold text-sm tracking-tight text-ink">EVS Portal</span>
        <ThemeToggle />
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center mt-6 px-4 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-2 lg:gap-6 px-6 py-3 bg-surface/80 backdrop-blur-md border border-border shadow-md rounded-full"
          >
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-accent rounded-full -z-10 shadow-glow"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </motion.div>
          
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </nav>

      {/* Mobile Bottom Bar Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-border/60 shadow-lg pb-safe">
        <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth px-3 py-2 gap-1.5 justify-between">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex flex-col items-center justify-center min-w-[62px] h-[52px] px-2 rounded-xl transition-all touch-manipulation flex-shrink-0 ${
                  isActive ? 'text-accent font-semibold' : 'text-ink-light hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon size={19} className="mb-0.5" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] tracking-tight whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
