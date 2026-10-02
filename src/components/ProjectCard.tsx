/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ProjectCard component — High-density technical command center project card.
 * Features architectural topology visualizer, live simulated telemetry badges,
 * cursor-mode hooks (data-cursor="view"), keyboard access, and deep case study links.
 */

import React, { useEffect, useRef } from 'react';
import {
  ExternalLink,
  Github,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  Activity,
  Terminal,
} from 'lucide-react';
import { Project } from '../data/portfolioData';
import { DistortionPlane } from '../three/DistortionPlane';
import { sceneManager } from '../three/SceneManager';
import { PROJECT_THUMBNAILS } from '../data/projectThumbnails';

export interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, index }) => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const distortionPlaneRef = useRef<DistortionPlane | null>(null);
  const thumbnailUrl = PROJECT_THUMBNAILS[project.id] || PROJECT_THUMBNAILS.omnisync;

  useEffect(() => {
    if (!imageContainerRef.current) return;
    if (!sceneManager.isAvailable()) return;

    try {
      distortionPlaneRef.current = new DistortionPlane({
        id: `distortion-${project.id}-${index}`,
        domElement: imageContainerRef.current,
        textureUrl: thumbnailUrl,
      });
    } catch (e) {
      console.warn('DistortionPlane fallback active:', e);
    }

    return () => {
      distortionPlaneRef.current?.dispose();
      distortionPlaneRef.current = null;
    };
  }, [project.id, index, thumbnailUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Open modal on Enter or Space when card itself has keyboard focus
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect(project);
    }
  };

  // Extract or synthesize real architectural telemetry metrics
  const getTelemetryMetrics = () => {
    if (project.id === 'omnisync') {
      return [
        { label: 'E2E P99 LATENCY', val: '< 18ms', status: 'optimal' },
        { label: 'DELIVERY RELIABILITY', val: '99.99%', status: 'optimal' },
        { label: 'PIPELINE', val: 'CMF + Outbox + BullMQ', status: 'optimal' },
      ];
    }
    if (project.id === 'cloudpulse') {
      return [
        { label: 'INGESTION RATE', val: '50k eps', status: 'optimal' },
        { label: 'AGGREGATION WINDOW', val: '500ms', status: 'optimal' },
        { label: 'STREAM TRANSPORT', val: 'WebSocket / SSE', status: 'optimal' },
      ];
    }
    if (project.id === 'flowboard') {
      return [
        { label: 'SYNC CONFLICTS', val: '0 (OT/CRDT)', status: 'optimal' },
        { label: 'STATE UPDATE', val: '< 12ms optimistic', status: 'optimal' },
        { label: 'STORAGE ENGINE', val: 'MongoDB + Redis', status: 'optimal' },
      ];
    }
    return [
      { label: 'AST PARSE SPEED', val: '1.2ms', status: 'optimal' },
      { label: 'TEST HARNESS', val: 'Sandboxed V8', status: 'optimal' },
      { label: 'RUNTIME', val: 'Node.js / Express', status: 'optimal' },
    ];
  };

  const metrics = getTelemetryMetrics();

  return (
    <article
      tabIndex={0}
      role="region"
      data-cursor="view"
      aria-labelledby={`project-title-${project.id}`}
      aria-haspopup="dialog"
      onKeyDown={handleKeyDown}
      className="p-7 sm:p-10 rounded-3xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 cursor-pointer"
      onClick={(e) => {
        // Prevent opening modal if user clicked an anchor link or button inside
        const target = e.target as HTMLElement;
        if (target.closest('a') || target.closest('button')) return;
        onSelect(project);
      }}
    >
      {/* Top Hairline Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Background Ambient Radial Glow on Hover */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-500" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        
        {/* Left Column: Project Identity & Engineering Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/60 dark:border-zinc-700/60">
              SYS.0{index + 1}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{project.status}</span>
            </span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-auto hidden sm:inline">
              ROLE: {project.role.toUpperCase()}
            </span>
          </div>

          {/* Title & Tagline */}
          <div>
            <h3
              id={`project-title-${project.id}`}
              className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-display"
            >
              {project.title}
            </h3>
            <p className="text-base text-zinc-600 dark:text-zinc-300 mt-2 font-medium leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Problem & Architectural Solution Preview */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Problem & Context</span>
              </span>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {project.problemSolved}
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Architectural Solution</span>
              </span>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Technologies Chips */}
          <div>
            <div className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
              Core Technologies & Frameworks
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 7).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 7 && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50">
                  +{project.technologies.length - 7} more
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelect(project)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <span>Inspect Case Study</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center gap-2 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-zinc-400"
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
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100 font-semibold text-xs border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <ExternalLink className="w-4 h-4 text-indigo-500" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Architectural Highlights & Live Telemetry Panel */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between space-y-4">
          
          {/* Architectural Topology Blueprint (WebGL Synced Distortion Plane) */}
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-md group/img"
          >
            <img
              src={thumbnailUrl}
              alt={`${project.title} Architectural Pipeline Topology`}
              className="w-full h-full object-cover object-center opacity-85 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-700/60 flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>TOPOLOGY_STREAM</span>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 space-y-3 font-mono">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Activity className="w-3.5 h-3.5" />
                <span>ARCHITECTURE BENCHMARKS</span>
              </span>
              <span className="text-[10px] text-emerald-400">VERIFIED</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[10px]">{m.label}:</span>
                  <span className="text-zinc-200 font-bold">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Network className="w-4 h-4" />
              <span>Core Architectural Highlights</span>
            </div>

            <div className="space-y-2.5">
              {project.architecture.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Engineering Capabilities
              </div>
              <div className="space-y-1.5">
                {project.keyFeatures.slice(0, 3).map((feat, i) => (
                  <div key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Click to inspect prompt */}
            <div className="pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>CASE STUDY TELEMETRY</span>
              <span className="text-indigo-500 dark:text-indigo-400 flex items-center gap-1 group-hover:underline font-bold">
                OPEN [ENTER] &rarr;
              </span>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};

export default ProjectCard;
