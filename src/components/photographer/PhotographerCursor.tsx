import React, { useEffect, useState } from 'react';

interface CursorProps {
  mode: 'default' | 'drag' | 'view';
}

export const PhotographerCursor: React.FC<CursorProps> = ({ mode }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device — don't show custom cursor
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  if (isTouch || !visible) return null;

  const isExpanded = mode === 'drag' || mode === 'view';

  return (
    <div
      className="fixed pointer-events-none z-[9990] hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.08s ease-out, top 0.08s ease-out',
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isExpanded
            ? 'w-16 h-16 bg-[#1A1814] text-[#E9E4D8] shadow-2xl scale-100'
            : 'w-3 h-3 bg-[#1A1814] opacity-70 scale-100'
        }`}
        style={{ mixBlendMode: isExpanded ? 'normal' : 'normal' }}
      >
        {mode === 'drag' && (
          <span className="font-space-mono text-[9px] uppercase font-bold tracking-widest animate-pulse">
            DRAG
          </span>
        )}
        {mode === 'view' && (
          <span className="font-space-mono text-[9px] uppercase font-bold tracking-widest">
            VIEW
          </span>
        )}
      </div>
    </div>
  );
};
