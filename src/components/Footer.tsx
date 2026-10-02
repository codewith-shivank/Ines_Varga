/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Linkedin, Github, Mail, ArrowUp, Heart } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';

interface FooterProps {
  data: PortfolioData;
}

export const Footer: React.FC<FooterProps> = ({ data }) => {
  const { profile, socialLinks } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'mail':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="py-16 bg-zinc-950 text-zinc-400 border-t border-zinc-900 no-print relative overflow-hidden" aria-label="Site Footer">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-12 border-b border-zinc-900">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                SM
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                {profile.name}
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-md">
              {profile.headline} &bull; {profile.location}
            </p>
          </div>

          {/* Social Links & Back to top */}
          <div className="flex items-center gap-5 text-xs font-mono">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                aria-label={link.label}
              >
                {getIcon(link.icon)}
                <span className="hidden sm:inline">{link.name}</span>
              </a>
            ))}

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800 ml-2"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-zinc-600">
            <span>React 19</span>
            <span>&bull;</span>
            <span>TypeScript</span>
            <span>&bull;</span>
            <span>Tailwind CSS</span>
            <span>&bull;</span>
            <span>Motion</span>
            <span>&bull;</span>
            <span>React Three Fiber</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
