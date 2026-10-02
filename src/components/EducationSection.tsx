/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, MapPin, Calendar, Award, Shield, BarChart3, Database, CheckCircle2 } from 'lucide-react';
import { Education, Certification } from '../data/portfolioData';

interface EducationSectionProps {
  educationList: Education[];
  certifications?: Certification[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educationList, certifications = [] }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'degrees' | 'certifications'>('all');

  const getIconForCert = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('cyber')) return Shield;
    if (lower.includes('data') || lower.includes('visualization')) return BarChart3;
    if (lower.includes('node') || lower.includes('mongo')) return Database;
    return Award;
  };

  return (
    <section 
      id="education" 
      className="py-24 lg:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 relative overflow-hidden"
      aria-label="Education and Certifications"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold font-mono tracking-wide">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>EDUCATION & CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              Academic foundations & industry simulations.
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Computer science studies coupled with accredited corporate simulations from Deloitte, Accenture, and Tata Group.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/70 dark:border-zinc-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('degrees')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'degrees'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/70 dark:border-zinc-800'
              }`}
            >
              Degrees ({educationList.length})
            </button>
            {certifications.length > 0 && (
              <button
                onClick={() => setActiveTab('certifications')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'certifications'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/70 dark:border-zinc-800'
                }`}
              >
                Certifications ({certifications.length})
              </button>
            )}
          </div>
        </div>

        {/* Degrees Grid */}
        {(activeTab === 'all' || activeTab === 'degrees') && (
          <div className="mb-12">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Degrees</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationList.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-7 rounded-3xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700/60 shadow-xs">
                        {edu.period}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 leading-snug">
                      {edu.degree}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {edu.institution}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {edu.location}
                      </span>
                    </div>

                    {edu.details && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80">
                        {edu.details}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Grid */}
        {(activeTab === 'all' || activeTab === 'certifications') && certifications.length > 0 && (
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Certifications & Job Simulations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.map((cert, idx) => {
                const Icon = getIconForCert(cert.title);
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="p-6 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                          {cert.credentialType}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cert.title}
                      </h4>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                        {cert.issuer}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80">
                      {cert.skillsGained.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
