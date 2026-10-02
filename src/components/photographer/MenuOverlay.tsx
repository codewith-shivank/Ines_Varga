import React, { useRef } from 'react';
import { INES_BIO } from '../../data/inesPortfolio';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Frames', href: '#frames' },
  { label: 'Clients', href: '#clients' },
  { label: 'Commissions', href: '#commissions' },
  { label: 'Contact', href: '#footer' },
];

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const handleClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9000] bg-[#1A1814]/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] z-[9001] bg-[#E9E4D8] border-l border-ink-14 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-14">
          <span className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/50">
            NAVIGATION
          </span>
          <button
            onClick={onClose}
            className="font-space-mono text-xs uppercase tracking-widest text-[#1A1814] hover:opacity-60 transition-opacity cursor-pointer underline underline-offset-4"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* Menu Links */}
        <div className="px-6 py-10 space-y-1">
          {MENU_LINKS.map((link, index) => (
            <button
              key={index}
              onClick={() => handleClick(link.href)}
              className={`w-full text-left py-4 border-b border-ink-14 group cursor-pointer transition-all duration-500 hover:pl-4 ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: isOpen ? `${index * 0.06 + 0.2}s` : '0s',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-anton text-3xl md:text-4xl uppercase tracking-tight text-[#1A1814] group-hover:text-[#1A1814]/70 transition-colors">
                  {link.label}
                </span>
                <span className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/40 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-ink-14 space-y-3">
          <a
            href={`mailto:${INES_BIO.email}`}
            className="block font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/60 hover:text-[#1A1814] transition-colors"
          >
            {INES_BIO.email}
          </a>
          <a
            href={INES_BIO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/60 hover:text-[#1A1814] transition-colors"
          >
            {INES_BIO.instagram}
          </a>
          <div className="font-space-mono text-[9px] uppercase tracking-widest text-[#1A1814]/30 pt-2">
            {INES_BIO.copyright}
          </div>
        </div>
      </div>
    </>
  );
};
