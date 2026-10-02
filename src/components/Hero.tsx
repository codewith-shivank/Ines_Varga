/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  ArrowDown,
  Github,
  MessageSquare,
  MapPin,
  Terminal,
} from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import { TextReveal } from './TextReveal';
import { MagneticButton } from './MagneticButton';

const HeroSceneWrapper = lazy(() => import('./HeroSceneWrapper').then(m => ({ default: m.HeroSceneWrapper })));

interface HeroProps {
  data: PortfolioData;
}

// Typing animation
const ROLES = [
  'FullStack MERN Developer',
  'React & TypeScript Engineer',
  'Node.js & Express Developer',
  'MongoDB & PostgreSQL Dev',
];

function useTypingAnimation(words: string[], typingSpeed = 65, pauseMs = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), typingSpeed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), typingSpeed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, typingSpeed, pauseMs]);

  return displayed;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const { profile } = data;
  const heroRef = useRef<HTMLElement>(null);
  const typedRole = useTypingAnimation(ROLES);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <section
        ref={heroRef}
        id="hero"
        className="relative pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 overflow-hidden"
        aria-label="Hero Introduction"
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-500/8 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/6 dark:bg-violet-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <motion.div
              className="lg:col-span-7 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Status badges */}
              <motion.div 
                className="flex flex-wrap items-center gap-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Open to Opportunities
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  {profile.location}
                </span>
              </motion.div>

              {/* Typed role */}
              <motion.div
                className="flex items-center gap-2 text-sm font-mono text-indigo-600 dark:text-indigo-400 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <Terminal className="w-4 h-4 shrink-0" />
                <span className="min-w-[220px]">
                  {typedRole}
                  <span className="inline-block w-[2px] h-[1em] bg-indigo-500 ml-0.5 animate-pulse align-middle" />
                </span>
              </motion.div>

              {/* Name */}
              <TextReveal
                as="h1"
                type="lines"
                sharpen={true}
                triggerOnScroll={false}
                delay={0.15}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] font-display"
              >
                {`I'm ${profile.name}`}
              </TextReveal>

              {/* Tagline */}
              <motion.p
                className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                I build{' '}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  performant web applications
                </span>{' '}
                with React, TypeScript & the MERN stack — backed by real-world production operations experience.
              </motion.p>

              {/* CTAs — 3 max */}
              <motion.div
                className="flex flex-wrap items-center gap-3 pt-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
              >
                {/* Primary: View Projects */}
                <MagneticButton strength={0.3}>
                  <motion.a
                    href="#projects"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <span>View My Work</span>
                    <ArrowDown className="w-4 h-4" />
                  </motion.a>
                </MagneticButton>

                {/* Secondary: GitHub */}
                <MagneticButton strength={0.25}>
                  <motion.a
                    href="https://github.com/shivankmaurya"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 border border-zinc-700/50 cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </motion.a>
                </MagneticButton>

                {/* Tertiary: Contact */}
                <MagneticButton strength={0.25}>
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-3 rounded-xl bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-200 font-semibold text-sm border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span>Let's Talk</span>
                  </motion.a>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Right: 3D Visual */}
            <motion.div
              className="lg:col-span-5 relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full relative rounded-2xl overflow-hidden">
                <Suspense
                  fallback={
                    <div className="w-full min-h-[320px] lg:min-h-[420px] flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    </div>
                  }
                >
                  <HeroSceneWrapper />
                </Suspense>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};