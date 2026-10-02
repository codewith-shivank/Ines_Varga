import { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateMagnetOffset = () => {
      if (!cursorRef.current) return;

      const cursorX = cursorPos.x;
      const cursorY = cursorPos.y;

      // Query for all elements with data-magnet
      const magnets = document.querySelectorAll('[data-magnet]');
      let offsetX = 0;
      let offsetY = 0;
      let count = 0;

      magnets.forEach(magnet => {
        const rect = magnet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX - cursorX;
        const dy = centerY - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If within 100px, apply magnet effect
        if (distance < 100) {
          const strength = (100 - distance) / 100; // 0 to 1
          offsetX += dx * strength * 0.2; // 0.2 is the magnet strength factor
          offsetY += dy * strength * 0.2;
          count++;
        }
      });

      if (count > 0) {
        setMagnetOffset({ x: offsetX / count, y: offsetY / count });
      } else {
        setMagnetOffset({ x: 0, y: 0 });
      }
    };

    const animate = () => {
      updateMagnetOffset();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [cursorPos]);

  // Set the cursor position on the element
  useEffect(() => {
    if (!cursorRef.current) return;

    const x = cursorPos.x + magnetOffset.x;
    const y = cursorPos.y + magnetOffset.y;

    cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [cursorPos, magnetOffset]);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-none fixed -z-50"
    >
      <div className="custom-cursor-inner"></div>
      <div className="custom-cursor-outer"></div>
    </div>
  );
};

export default CustomCursor;