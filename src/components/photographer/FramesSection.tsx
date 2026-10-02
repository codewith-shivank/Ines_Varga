import React, { useRef, useState } from 'react';
import { FRAMES_GALLERY } from '../../data/inesPortfolio';

export const FramesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section id="frames" className="w-full py-16 md:py-28 bg-[#E9E4D8] border-b border-ink-14 overflow-hidden scroll-reveal">
      {/* Section Label */}
      <div className="px-4 md:px-8 mb-8 md:mb-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/50">
          (04) — FRAMES
        </div>
        <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/40">
          Hover to straighten · Drag to browse
        </div>
      </div>

      {/* Horizontal Drag-Scroll Strip */}
      <div
        ref={scrollRef}
        className={`flex items-center gap-6 md:gap-10 px-8 md:px-16 overflow-x-auto no-scrollbar ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {FRAMES_GALLERY.map((frame, index) => (
          <div
            key={index}
            className="flex-shrink-0 group transition-all duration-500 ease-out"
            style={{
              transform: `rotate(${frame.tilt}deg)`,
            }}
          >
            <div
              className={`relative bg-white p-2 md:p-[8px] shadow-xl border border-[#1A1814]/8 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 ease-out ${
                frame.aspect === 'portrait'
                  ? 'w-[180px] h-[260px] md:w-[220px] md:h-[310px]'
                  : 'w-[280px] h-[200px] md:w-[340px] md:h-[240px]'
              }`}
            >
              <img
                src={frame.src}
                alt={frame.caption}
                className="w-full h-full object-cover warm-photo"
                draggable={false}
              />
            </div>

            {/* Caption */}
            <div className="mt-3 text-center font-space-mono text-[9px] md:text-[10px] uppercase tracking-widest text-[#1A1814]/50 group-hover:text-[#1A1814]/80 transition-colors duration-300">
              {frame.caption}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
