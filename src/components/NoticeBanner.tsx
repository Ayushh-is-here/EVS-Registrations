import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronDown, ChevronUp, Bell, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function NoticeBanner() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('evs_notice_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();

  // Do not show student notice banner on admin panel
  if (location.pathname === '/admin') {
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('evs_notice_collapsed', String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-4 pointer-events-auto">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* Compact Collapsed Pill Notice */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-surface/90 border border-amber-500/30 dark:border-amber-400/25 shadow-sm hover:shadow-md backdrop-blur-md transition-all text-ink text-xs sm:text-sm group"
          >
            <button
              onClick={toggleCollapse}
              className="flex items-center gap-2 text-left flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
              aria-label="Expand presentation notice"
            >
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-heading font-semibold text-amber-700 dark:text-amber-400 truncate">
                Important Notice:
              </span>
              <span className="text-ink-light truncate font-body text-[11px] sm:text-xs">
                Presentations start <strong>26th Sept</strong> • Last date <strong>30th Oct</strong>
              </span>
            </button>

            <button
              onClick={toggleCollapse}
              className="p-1 text-ink-light hover:text-ink transition-colors rounded-full hover:bg-surface/80 flex-shrink-0"
              title="Expand Notice"
              aria-label="Expand Notice"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          /* Full Expanded Rich Notice Banner */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-surface/95 to-amber-500/10 border border-amber-500/30 dark:border-amber-400/25 shadow-md backdrop-blur-xl p-4 sm:p-5"
          >
            {/* Ambient Background Glow Effect */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-accent/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-3.5">
              {/* Header row with badge and collapse button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bell className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm sm:text-base text-amber-900 dark:text-amber-300 tracking-tight">
                        Important Announcement
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        Presentations Schedule
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleCollapse}
                  className="text-xs text-ink-light hover:text-ink flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-surface/80 transition-colors border border-border/50"
                  title="Minimize Notice"
                  aria-label="Minimize Notice"
                >
                  <span className="hidden sm:inline text-[11px] font-medium">Collapse</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main schedule description */}
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed font-body">
                Please note that <strong className="text-ink font-semibold">presentations start from 26th September</strong> and the <strong className="text-ink font-semibold">last date is 30th of October</strong>. Make sure to complete your topic registration and organize your presentation slides on time.
              </p>

              {/* Date Highlight Chips & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border/60 shadow-sm text-xs font-medium text-ink">
                    <Calendar className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span>Starts: <strong className="font-semibold text-accent">26th September</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border/60 shadow-sm text-xs font-medium text-ink">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span>Last Date: <strong className="font-semibold text-amber-700 dark:text-amber-400">30th October</strong></span>
                  </div>
                </div>

                {location.pathname !== '/guidelines' && (
                  <Link
                    to="/guidelines"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover hover:underline transition-all self-end sm:self-auto py-1"
                  >
                    <span>Read Guidelines</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
