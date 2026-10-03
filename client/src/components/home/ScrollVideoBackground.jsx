import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Compass, Sparkles } from 'lucide-react';

/**
 * ScrollVideoBackground
 * Plays and scrubs background video dynamically tied to user's page scroll position.
 * Only applied on the HomePage.
 */
export default function ScrollVideoBackground() {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [mode, setMode] = useState('scroll'); // 'scroll' or 'autoplay'
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
      if (mode === 'autoplay') {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [mode]);

  // Smooth scroll scrubbing loop using requestAnimationFrame + Lerp
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (mode === 'autoplay') {
      video.play().catch(() => {});
      return;
    }

    video.pause();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
      setScrollProgress(progress);

      if (video.duration && Number.isFinite(video.duration)) {
        // Target time across video duration (repeat smoothly if needed or clamp)
        targetTimeRef.current = progress * (video.duration - 0.05);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Lerp loop for fluid 60fps video seek without stutter
    let isRunning = true;
    const renderLoop = () => {
      if (!isRunning) return;

      if (video && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const diff = targetTimeRef.current - video.currentTime;
        if (Math.abs(diff) > 0.03) {
          // Smoothly interpolate towards target time
          video.currentTime += diff * 0.25;
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'scroll' ? 'autoplay' : 'scroll'));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* Video Element */}
      <video
        ref={videoRef}
        src="/videos/homepage_bg.mp4"
        muted
        playsInline
        preload="auto"
        loop
        className="w-full h-full object-cover filter contrast-125 brightness-[0.45] transition-opacity duration-1000"
        style={{
          willChange: 'currentTime',
          transform: 'translateZ(0)',
        }}
        onError={(e) => {
          // Fallback to original file name if renamed
          if (!e.currentTarget.src.includes('istockphoto-2197565610')) {
            e.currentTarget.src = '/videos/istockphoto-2197565610-640_adpp_is.mp4';
          }
        }}
      />

      {/* Cyberpunk Vignette & Gradient Overlays for High Contrast & Crystal-Clear Text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/85" />

      {/* Subtle Scanline / Tech Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #06b6d4 0.75px, transparent 0.75px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Interactive HUD Control Pill (Floating bottom-right) */}
      <div className="pointer-events-auto absolute bottom-6 right-6 z-30 hidden sm:flex items-center gap-2">
        <button
          onClick={toggleMode}
          title="Toggle scroll-linked animation mode"
          className="px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-700/80 hover:border-cyan-500/80 text-[11px] font-mono text-neutral-300 hover:text-white backdrop-blur-md shadow-2xl transition-all flex items-center gap-2 group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-cyan-400 font-bold">
            {mode === 'scroll' ? 'SCROLL-SYNC PLAY' : 'AUTOPLAY LOOP'}
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-[10px] text-neutral-400">
            {mode === 'scroll' ? `${Math.round(scrollProgress * 100)}% DEPTH` : 'CONTINUOUS'}
          </span>
        </button>
      </div>
    </div>
  );
}
