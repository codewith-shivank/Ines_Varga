import React from 'react';
import { INES_BIO } from '../../data/inesPortfolio';

export const PhotographerFooter: React.FC = () => {
  return (
    <footer id="footer" className="w-full bg-[#E9E4D8] scroll-reveal">
      {/* Main Footer Content */}
      <div className="px-4 md:px-8 py-12 md:py-20 border-t border-ink-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left Column — Based in */}
          <div className="space-y-6">
            <div className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/40 mb-4">
              BASED IN
            </div>
            <div className="space-y-2">
              <div className="font-inter-tight text-lg md:text-xl text-[#1A1814]">
                Lisbon — Portugal
              </div>
              <div className="font-inter-tight text-lg md:text-xl text-[#1A1814]">
                New York — United States
              </div>
            </div>

            <div className="pt-6 border-t border-ink-14 space-y-2">
              <div className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/40">
                CONTACT
              </div>
              <a
                href={`mailto:${INES_BIO.email}`}
                className="block font-inter-tight text-base text-[#1A1814] hover:opacity-60 transition-opacity underline underline-offset-4"
              >
                {INES_BIO.email}
              </a>
              <a
                href={INES_BIO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-inter-tight text-base text-[#1A1814] hover:opacity-60 transition-opacity underline underline-offset-4"
              >
                {INES_BIO.instagram}
              </a>
            </div>
          </div>

          {/* Right Column — Credits & Socials */}
          <div className="space-y-6 md:text-right">
            <div className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/40 mb-4">
              CREDITS
            </div>
            <div className="space-y-1.5">
              <div className="font-inter-tight text-sm text-[#1A1814]/60">
                © 2026 {INES_BIO.firstName} {INES_BIO.lastName}
              </div>
              <div className="font-inter-tight text-sm text-[#1A1814]/60">
                Template — Louver
              </div>
              <div className="font-inter-tight text-sm text-[#1A1814]/60">
                All rights reserved
              </div>
            </div>

            <div className="pt-6 border-t border-ink-14 flex flex-wrap gap-4 md:justify-end">
              <a
                href={INES_BIO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/60 hover:text-[#1A1814] transition-colors underline underline-offset-4"
              >
                INSTAGRAM
              </a>
              <a
                href="#"
                className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/60 hover:text-[#1A1814] transition-colors underline underline-offset-4"
              >
                VIMEO
              </a>
              <a
                href="#"
                className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/60 hover:text-[#1A1814] transition-colors underline underline-offset-4"
              >
                BEHANCE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Giant Cropped Outline LAST Name at very bottom */}
      <div className="w-full overflow-hidden border-t border-ink-14 relative">
        <div className="font-anton text-[22vw] md:text-[18vw] uppercase leading-[0.75] text-stroke-ink select-none tracking-tight text-center pt-4 pb-0 translate-y-[15%]">
          {INES_BIO.lastName}
        </div>
      </div>
    </footer>
  );
};
