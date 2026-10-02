/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Code2, Headphones, GraduationCap, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';

interface AboutProps {
  data: PortfolioData;
}

export const About: React.FC<AboutProps> = ({ data }) => {
  const { profile } = data;

  const highlights = [
    {
      icon: Code2,
      title: 'Full-Stack MERN Craft',
      description: 'Building robust, end-to-end web apps with React 19, TypeScript, Node.js, Express, MongoDB, and PostgreSQL.',
      gradient: 'from-indigo-500/10 to-violet-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: Headphones,
      title: 'Production Platform Operations',
      description: "Supporting Swiggy's high-scale food and quick-commerce platform at Niftel with 50+ daily operational interactions.",
      gradient: 'from-violet-500/10 to-purple-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      icon: TrendingUp,
      title: 'Root-Cause Problem Solving',
      description: 'Achieved ~20% reduction in repeat incident tickets via structured post-mortems and clear escalation pathways.',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: GraduationCap,
      title: 'Academic Computer Science',
      description: 'Pursuing BCA at Babu Banarasi Das University, Lucknow (2025–2028), grounding software in core CS theory.',
      gradient: 'from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <section 
      id="about" 
      className="py-24 lg:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 relative overflow-hidden"
      aria-label="About Shivank Maurya"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold font-mono tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            Engineering software with empathy, resilience, and operational discipline.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            I'm a Full-Stack developer who combines modern JavaScript/TypeScript software engineering with real production platform support experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Narrative Content */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-zinc-600 dark:text-zinc-300 text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 font-medium text-zinc-900 dark:text-zinc-100 text-base sm:text-lg leading-relaxed shadow-sm">
              {profile.bioIntro}
            </div>

            {profile.bioParagraphs.map((para, i) => (
              <p key={i} className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                {para}
              </p>
            ))}

            {/* Practical engineering perspective */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent border border-indigo-500/20 dark:border-indigo-500/30">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                The Engineering Philosophy
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Clean code is only half the equation — knowing how systems behave when traffic surges, services timeout, and customers encounter edge cases is what makes software truly production-ready.
              </p>
            </div>
          </motion.div>

          {/* Right: Highlights Grid */}
          <motion.div 
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center ${item.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </section>
  );
};
