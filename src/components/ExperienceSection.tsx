/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2,
  MapPin, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Experience } from '../data/portfolioData';

interface ExperienceSectionProps {
  experienceList: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experienceList }) => {
  return (
    <section 
      id="experience" 
      className="py-24 lg:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60 relative overflow-hidden"
      aria-label="Work Experience"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold font-mono tracking-wide">
            <Briefcase className="w-3.5 h-3.5" />
            <span>PRODUCTION EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            Operational impact & production discipline.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Real customer operations, high-SLA food & quick-commerce platform support, and systematic root-cause incident troubleshooting.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/25 dark:border-zinc-800 space-y-12">
          {experienceList.map((exp) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 border-4 border-white dark:border-zinc-950 shadow-md" />

              {/* Main Experience Card */}
              <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-xl">
                
                {/* Header metadata */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {exp.title}
                      </h3>
                      {exp.isCurrent && (
                        <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          Current Role
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        {exp.company}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-zinc-400" />
                        {exp.location}
                      </span>
                      <span>&bull;</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                        Platform: {exp.platformSupported}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60 self-start lg:self-auto">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 font-normal">
                  {exp.summary}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {exp.metrics.map((metric, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-zinc-900 dark:text-white leading-none mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {metric.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5 mb-6">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Key Responsibilities & Operational Actions
                  </div>
                  {exp.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Skills Used */}
                <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 mr-2">Skills Applied:</span>
                  {exp.skillsUsed.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
