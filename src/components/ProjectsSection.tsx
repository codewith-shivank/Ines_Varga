/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Github,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Project } from '../data/portfolioData';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Full Stack', 'Frontend'];

  const filteredProjects = projects.filter((p) => {
    if (filterCategory === 'All') return true;
    return p.category === filterCategory;
  });

  return (
    <section 
      id="projects" 
      className="py-24 lg:py-32 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 relative overflow-hidden"
      aria-label="Engineering Projects"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-violet-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold font-mono tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              Production-grade applications & case studies.
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Real software built from scratch — showcasing full-stack architecture, clean state management, API integration, and performance optimization.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  filterCategory === cat
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/70 dark:border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards Showcase */}
        <div className="space-y-12">
          {filteredProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-7 sm:p-10 rounded-3xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group relative overflow-hidden"
            >
              {/* Subtle top border gradient accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left: Project Details */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                      {project.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {project.status}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      Role: {project.role}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-base text-zinc-600 dark:text-zinc-300 mt-2 font-medium">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Problem & Solution Preview */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Problem & Context
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                        {project.problemSolved}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        Architectural Solution
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
                      Key Technologies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 6 && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50">
                          +{project.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
                    >
                      <span>Deep Dive Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center gap-2 border border-zinc-700/50"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100 font-semibold text-xs border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 transition-all flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-500" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Key Features & Architecture Preview Box */}
                <div className="lg:col-span-5 h-full flex flex-col justify-between">
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      <Cpu className="w-4 h-4" />
                      <span>Architecture Highlights</span>
                    </div>

                    <div className="space-y-2.5">
                      {project.architecture.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Key Features
                      </div>
                      <div className="space-y-1.5">
                        {project.keyFeatures.slice(0, 3).map((feat, i) => (
                          <div key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span>Click for full problem breakdown, challenges & outcomes</span>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Read &rarr;
                    </button>
                  </div>
                </div>

              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
