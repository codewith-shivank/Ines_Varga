import React, { useState } from 'react';
import { SELECTED_CLIENTS } from '../../data/inesPortfolio';

export const ClientsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="clients" className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#E9E4D8] border-b border-ink-14 scroll-reveal">
      {/* Bordered Box */}
      <div className="max-w-5xl mx-auto border border-ink-14 rounded-sm">
        {/* Header */}
        <div className="px-6 md:px-10 py-5 md:py-7 border-b border-ink-14">
          <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/50">
            SELECTED CLIENTS
          </div>
        </div>

        {/* Client Rows — each in a DIFFERENT font style */}
        <div>
          {SELECTED_CLIENTS.map((client, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-6 md:px-10 py-5 md:py-6 border-b border-ink-14 last:border-b-0 cursor-default group transition-all duration-500 ease-out ${
                hoveredIndex === index ? 'bg-[#F2EEE5]' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`transition-all duration-500 ease-out ${
                  hoveredIndex === index ? 'translate-x-4' : 'translate-x-0'
                }`}
              >
                <span className={`${client.fontClass} text-[#1A1814] transition-opacity duration-300`}>
                  {client.name}
                </span>
              </div>

              <div
                className={`font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/40 transition-all duration-500 ease-out ${
                  hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}
              >
                {client.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
