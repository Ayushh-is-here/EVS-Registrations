import React, { useEffect, useRef } from 'react';

// You can place your external video URL here or set VITE_BACKGROUND_VIDEO_URL in your .env / Vercel Environment Variables
const EXTERNAL_VIDEO_URL =
  (import.meta as any).env?.VITE_BACKGROUND_VIDEO_URL ||
  ''; // Paste your Supabase Storage, Cloudinary, or Cloudflare URL here

const AnimatedBackground: React.FC = () = https://znwftdisykivjvexudwe.supabase.co/storage/v1/object/public/assets/background.mp4> {
const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 1.0;
    videoRef.current.currentTime = 3;
  }
}, []);

return (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background transition-colors duration-700">
    {/* Dynamic Ambient Mesh / Gradient (always present as instant zero-bandwidth backdrop) */}
    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-surface dark:from-accent/15 dark:via-background dark:to-surface" />
    <div className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-accent/10 blur-[120px] pointer-events-none animate-pulse duration-10000" />
    <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

    {/* External Background Video (Only rendered if an external URL is configured) */}
    {EXTERNAL_VIDEO_URL && (
      <video
        ref={videoRef}
        src={EXTERNAL_VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
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
);
};

export default AnimatedBackground;
