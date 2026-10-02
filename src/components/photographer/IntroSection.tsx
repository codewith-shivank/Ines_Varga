import React from 'react';
import { INES_BIO } from '../../data/inesPortfolio';

interface IntroSectionProps {
  onOpenAboutModal: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onOpenAboutModal }) => {
  return (
    <section id="intro" className="w-full py-16 md:py-28 lg:py-36 px-4 md:px-12 lg:px-16 border-b border-ink-14 bg-[#E9E4D8] scroll-reveal">
      {/* Section Label */}
      <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/50 mb-10 md:mb-16">
        (01) — INTRO
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
        {/* Left Column: Label (hidden on mobile, visible as decorative element on desktop) */}
        <div className="hidden md:flex md:col-span-2 font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/40 leading-loose flex-col gap-2">
          <span>BORN</span>
          <span>LISBON</span>
          <span>1990</span>
        </div>

        {/* Center Column: Pill Portrait Image */}
        <div className="md:col-span-3 flex justify-center md:justify-start">
          <div className="relative w-[140px] h-[210px] md:w-[180px] md:h-[270px] rounded-full overflow-hidden border border-ink-14 shadow-lg group">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
              alt="Ines Varga Portrait"
              className="w-full h-full object-cover warm-photo group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

        {/* Right Column: Big Editorial Statement + Stats + Button */}
        <div className="md:col-span-7 flex flex-col space-y-6 md:space-y-8">
          <h2 className="font-inter-tight text-[22px] md:text-[28px] lg:text-[34px] leading-[1.25] font-normal text-[#1A1814]">
            {INES_BIO.bio}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-ink-14 gap-4">
            <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/60">
              {INES_BIO.stats}
            </div>

            <button
              onClick={onOpenAboutModal}
              className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full border border-[#1A1814] text-[#1A1814] font-space-mono text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#1A1814] hover:text-[#E9E4D8] transition-all duration-400 shadow-sm cursor-pointer self-start sm:self-auto group"
            >
              <span>About</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
