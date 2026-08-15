import React, { useEffect, useRef, useState } from 'react';
import EcoPreloader from './EcoPreloader';

// External hosted video URL
const EXTERNAL_VIDEO_URL =
  (import.meta as any).env?.VITE_BACKGROUND_VIDEO_URL ||
  'https://github.com/Ayushh-is-here/EVS-Registrations/releases/download/v1.0.0/background_1080p_hd.mp4';

const AnimatedBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  // Smooth progress ticker
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1600; // Target duration to reach ~88% if waiting for video

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (!videoReady) {
        // Asymptotically approach 90% while buffering
        const target = Math.min(90, (elapsed / duration) * 90);
        setProgress((prev) => Math.max(prev, target));
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Video is ready -> accelerate to 100%
        setProgress((prev) => {
          const next = prev + (100 - prev) * 0.25;
          if (next >= 99.5) {
            setTimeout(() => setPreloaderFinished(true), 350);
            return 100;
          }
          animationFrameId = requestAnimationFrame(updateProgress);
          return next;
        });
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    // Safety timeout: dismiss preloader after 4.5s max even on slow/broken connections
    const safetyTimeout = setTimeout(() => {
      setVideoReady(true);
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimeout);
    };
  }, [videoReady]);

  const hasStartedRef = useRef(false);

  // Video playback initialization
  const handleVideoReady = () => {
    if (!hasStartedRef.current && videoRef.current) {
      hasStartedRef.current = true;
      const video = videoRef.current;
      video.defaultMuted = true;
      video.muted = true;
      video.playbackRate = 1.0;
      video.play().catch((err) => {
        console.warn('Autoplay prevented or waiting for interaction:', err);
      });
    }
    setVideoReady(true);
  };

  // Ensure playback starts on mount if already cached/ready
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.defaultMuted = true;
      video.muted = true;
      if (video.readyState >= 2) {
        handleVideoReady();
      }
    }
  }, []);

  return (
    <>
      {/* Cool EVS-Themed Preloader */}
      <EcoPreloader progress={progress} isReady={preloaderFinished} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background transition-colors duration-700">
        {/* Dynamic Ambient Mesh / Gradient (always present as instant zero-bandwidth backdrop) */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-surface dark:from-accent/15 dark:via-background dark:to-surface" />
        <div className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-accent/10 blur-[120px] pointer-events-none animate-pulse duration-10000" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

        {/* External Background Video */}
        {EXTERNAL_VIDEO_URL && (
          <video
            ref={videoRef}
            src={EXTERNAL_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoReady}
            onCanPlay={handleVideoReady}
            onError={() => setVideoReady(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'
              }`}
          />
        )}

        {/* Theme-Aware Overlay to Ensure Legibility */}
        <div className="absolute inset-0 bg-background/30 dark:bg-background/60 transition-colors duration-700 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40 dark:from-background/80 dark:via-background/20 dark:to-background/80" />

        {/* High-End Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] z-10 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </>
  );
};

export default AnimatedBackground;
