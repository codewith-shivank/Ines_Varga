import React, { useState, useRef, useEffect } from 'react';
import { INES_BIO } from '../../data/inesPortfolio';

export const CommissionsSection: React.FC = () => {
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;
    setMagneticOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  return (
    <section id="commissions" className="w-full bg-[#E9E4D8] border-b border-ink-14 scroll-reveal">
      {/* Section Label */}
      <div className="px-4 md:px-8 pt-16 md:pt-24 pb-4 md:pb-6">
        <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/50">
          (05) — COMMISSIONS OPEN
        </div>
      </div>

      {/* Centered Huge CTA */}
      <div className="flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20 text-center">
        {/* Giant Anton Headline */}
        <h2 className="font-anton text-[10vw] md:text-[7vw] lg:text-[6vw] uppercase leading-[0.9] tracking-tight text-[#1A1814] max-w-5xl mb-8 md:mb-12">
          LET'S MAKE<br />SOMETHING FELT
        </h2>

        {/* Green Pulse Dot Badge */}
        <div className="flex items-center space-x-2.5 mb-8 md:mb-12 px-5 py-2.5 rounded-full border border-ink-14 bg-[#F2EEE5]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/70">
            Reply within 48h
          </span>
        </div>

        {/* Magnetic Email Button */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          <a
            ref={buttonRef}
            href={`mailto:${INES_BIO.email}`}
            className="inline-flex items-center justify-center px-10 md:px-14 py-4 md:py-5 rounded-full bg-[#1A1814] text-[#E9E4D8] font-space-mono text-xs md:text-sm uppercase tracking-widest hover:bg-[#2a2620] transition-all duration-400 shadow-2xl group"
            style={{
              transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s',
            }}
          >
            <span className="mr-3">{INES_BIO.email}</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
          </a>
        </div>
      </div>

      {/* Marquee Strip */}
      <div className="w-full border-t border-ink-14 py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-space-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#1A1814]/40 mx-8 md:mx-12">
              COMMISSIONS OPEN — REPLY IN 48H —
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
