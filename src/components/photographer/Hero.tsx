import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project, INES_BIO } from '../../data/inesPortfolio';

interface HeroProps {
  projects: Project[];
  setCursorMode: (mode: 'default' | 'drag' | 'view') => void;
  onOpenMenu: () => void;
  lisbonTime: string;
}

export const Hero: React.FC<HeroProps> = ({ projects, setCursorMode, onOpenMenu, lisbonTime }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLouverActive, setIsLouverActive] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const startXRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentProject = projects[currentIndex];

  const triggerSlideChange = useCallback((nextIndex: number) => {
    if (isLouverActive) return;
    setIsLouverActive(true);
    setProgress(0);
    setCurrentIndex((nextIndex + projects.length) % projects.length);

    setTimeout(() => {
      setIsLouverActive(false);
    }, 750);
  }, [isLouverActive, projects.length]);

  const handleNext = useCallback(() => {
    triggerSlideChange(currentIndex + 1);
  }, [currentIndex, triggerSlideChange]);

  const handlePrev = useCallback(() => {
    triggerSlideChange(currentIndex - 1);
  }, [currentIndex, triggerSlideChange]);

  // Auto advance every 6s with progress tracking
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);
    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(elapsed / 6000, 1));
    }, 50);

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    startXRef.current = clientX;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) {
      handleNext();
    } else if (dragOffset > 60) {
      handlePrev();
    }
    setDragOffset(0);
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[680px] flex flex-col justify-between overflow-hidden select-none bg-[#E9E4D8] border-b border-ink-14"
      onMouseEnter={() => setCursorMode('drag')}
      onMouseLeave={() => {
        setCursorMode('default');
        handleMouseUp();
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 12 Vertical Louver Blinds Layer */}
      <div className="absolute inset-0 z-30 pointer-events-none grid grid-cols-12 h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`w-full h-full bg-[#1A1814] ${isLouverActive ? 'louver-active' : 'scale-y-0'}`}
            style={{ animationDelay: `${i * 0.035}s` }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <header className="relative z-40 w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between font-space-mono text-[10px] md:text-xs uppercase tracking-widest border-b border-ink-14 bg-[#E9E4D8]/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2 font-bold">
          <span>{INES_BIO.copyright}</span>
        </div>

        <div className="hidden md:block opacity-75 font-medium text-[11px] tracking-widest">
          {INES_BIO.role}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <span className="opacity-90 font-medium hidden sm:inline">
            LISBON {lisbonTime} WET
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenMenu(); }}
            className="hover:opacity-60 transition-opacity font-bold underline underline-offset-4 cursor-pointer"
          >
            [ MENU ]
          </button>
        </div>
      </header>

      {/* Role / Base center-top small */}
      <div className="relative z-20 w-full text-center pt-2 font-space-mono text-[10px] md:text-[11px] uppercase tracking-widest opacity-60">
        {INES_BIO.role} / {INES_BIO.base}
      </div>

      {/* Main Canvas with Images & Giant Typography */}
      <div
        className="relative flex-1 w-full flex items-center justify-center px-4 transition-transform duration-150 ease-out"
        style={{ transform: `translateX(${dragOffset * 0.25}px)` }}
      >
        {/* Behind Type Images Container */}
        <div className="absolute inset-0 flex items-center justify-between px-[4vw] md:px-[10vw] pointer-events-none z-0">
          {/* Left Vertical Portrait Image (22vw, 3:4 aspect, -4deg tilt) */}
          <div className="relative w-[44vw] md:w-[22vw] aspect-[3/4] -rotate-4 shadow-2xl rounded-sm overflow-hidden border border-ink-14/30">
            <img
              key={`portrait-${currentProject.id}`}
              src={currentProject.portrait}
              alt={currentProject.title}
              className="w-full h-full object-cover warm-photo hero-image-enter"
              loading="eager"
            />
          </div>

          {/* Right Pill Landscape Image (38vw, 16:10 aspect, fully rounded, +3deg tilt) */}
          <div className="relative w-[70vw] md:w-[38vw] aspect-[16/10] rotate-3 shadow-2xl rounded-full overflow-hidden border border-ink-14/30">
            <img
              key={`landscape-${currentProject.id}`}
              src={currentProject.landscape}
              alt={currentProject.title}
              className="w-full h-full object-cover warm-photo hero-image-enter"
              loading="eager"
            />
          </div>
        </div>

        {/* Center Giant Typography */}
        <div
          className="relative z-10 text-center pointer-events-none select-none my-auto"
          style={{ transform: `translateX(${dragOffset * 0.12}px)` }}
        >
          {/* Giant LAST Name in Anton */}
          <h1 className="font-anton text-[24vw] md:text-[18.5vw] uppercase leading-[0.85] tracking-tight text-[#1A1814] drop-shadow-sm">
            {INES_BIO.lastName}
          </h1>

          {/* First Name in Instrument Serif Italic overlapping at -8% offset */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[62%] -rotate-3 text-[#1A1814] font-serif-italic text-[18vw] md:text-[14vw] leading-none whitespace-nowrap drop-shadow-md"
            style={{ transform: `translate(-50%, -62%) rotate(-3deg) translateX(${dragOffset * 0.08}px)` }}
          >
            {INES_BIO.firstName}
          </div>
        </div>
      </div>

      {/* Bottom Corner Info */}
      <div className="relative z-20 w-full px-4 md:px-6 py-2 flex flex-col md:flex-row items-center justify-between font-space-mono text-[10px] md:text-[11px] uppercase tracking-wider text-[#1A1814]/80 gap-1 md:gap-2">
        <div className="text-left w-full md:w-auto">
          Selected work 2019—26 ↓ 05 stories
        </div>
        <div className="text-center font-bold tracking-widest text-[#1A1814]">
          ({currentProject.id}) {currentProject.client} — {currentProject.title}
        </div>
        <div className="hidden md:block text-right">
          {currentProject.category} · {currentProject.year}
        </div>
      </div>

      {/* Bottom Bar */}
      <footer className="relative z-40 w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between font-space-mono text-[10px] md:text-xs uppercase tracking-widest border-t border-ink-14 bg-[#E9E4D8]/80 backdrop-blur-sm">
        {/* Slide Counter */}
        <div className="font-bold tracking-widest">
          0{currentIndex + 1} / 05
        </div>

        {/* Center Name */}
        <div className="hidden sm:block font-bold">
          {INES_BIO.firstName.toUpperCase()} {INES_BIO.lastName}
        </div>

        {/* Right Drag hint & Dots Progress */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <span className="hidden md:inline opacity-75">Drag or swipe to turn</span>
          
          {/* Progress Dots */}
          <div className="flex items-center space-x-1.5">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); triggerSlideChange(idx); }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-6 bg-[#1A1814]' : 'w-2 bg-[#1A1814]/30 hover:bg-[#1A1814]/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </footer>

      {/* Thin progress line at very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] z-50 bg-[#1A1814]/10">
        <div
          className="h-full bg-[#1A1814] transition-[width] duration-75 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </section>
  );
};
