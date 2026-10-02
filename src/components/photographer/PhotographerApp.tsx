import React, { useState, useEffect, useCallback } from 'react';
import { ScrollProvider } from '../../core/ScrollProvider';
import { PROJECTS } from '../../data/inesPortfolio';
import { Hero } from './Hero';
import { IntroSection } from './IntroSection';
import { SelectedWork } from './SelectedWork';
import { FramesSection } from './FramesSection';
import { ClientsSection } from './ClientsSection';
import { CommissionsSection } from './CommissionsSection';
import { PhotographerFooter } from './PhotographerFooter';
import { PhotographerCursor } from './PhotographerCursor';
import { MenuOverlay } from './MenuOverlay';

/** Lisbon timezone live clock */
function useLisbonClock(): string {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const lisbonTime = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Lisbon',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(lisbonTime);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

/** Scroll reveal observer hook */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    // Delay to let DOM settle
    const timer = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

export const PhotographerApp: React.FC = () => {
  const [cursorMode, setCursorMode] = useState<'default' | 'drag' | 'view'>('default');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lisbonTime = useLisbonClock();

  useScrollReveal();

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <ScrollProvider>
      <div className="min-h-screen bg-[#E9E4D8] text-[#1A1814] antialiased selection:bg-[#1A1814] selection:text-[#E9E4D8] font-inter-tight cursor-none md:cursor-none">
        {/* Film Grain Overlay */}
        <div className="grain-overlay" />

        {/* Custom Cursor (desktop only) */}
        <PhotographerCursor mode={cursorMode} />

        {/* Menu Overlay */}
        <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />

        {/* Main Content */}
        <main>
          {/* 1. HERO (100vh, drag to turn) */}
          <Hero
            projects={PROJECTS}
            setCursorMode={setCursorMode}
            onOpenMenu={openMenu}
            lisbonTime={lisbonTime}
          />

          {/* 2. (01) INTRO */}
          <IntroSection onOpenAboutModal={() => {}} />

          {/* 3. (02) SELECTED WORK */}
          <SelectedWork
            projects={PROJECTS}
            setCursorMode={setCursorMode}
          />

          {/* 4. (04) FRAMES */}
          <FramesSection />

          {/* 5. SELECTED CLIENTS */}
          <ClientsSection />

          {/* 6. (05) COMMISSIONS OPEN */}
          <CommissionsSection />
        </main>

        {/* 7. FOOTER */}
        <PhotographerFooter />
      </div>
    </ScrollProvider>
  );
};
