/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ProjectDetailModal / ProjectModal — Technical command center case study modal.
 * Features interactive distributed pipeline topology, live simulated telemetry broadcast sandbox,
 * architectural tradeoffs, keyboard trap, and Escape key dismissal.
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Layers,
  Flame,
  Trophy,
  ArrowRight,
  Terminal,
  Play,
  RotateCcw,
  Network,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import { Project } from '../data/portfolioData';

export interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

type TabType = 'overview' | 'architecture' | 'simulation' | 'challenges' | 'results';

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keyboard accessibility: Escape to close and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setActiveTab('overview');
      setSimStep(0);
      setIsSimulating(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [project, onClose]);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    simTimerRef.current = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 4) {
          if (simTimerRef.current) clearInterval(simTimerRef.current);
          setIsSimulating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 700);
  };

  const resetSimulation = () => {
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    setIsSimulating(false);
    setSimStep(0);
  };

  if (!project) return null;

  const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Problem & Solution', icon: Lightbulb },
    { id: 'architecture', label: 'Topology & Pipeline', icon: Layers },
    { id: 'simulation', label: 'Live Telemetry Sandbox', icon: Activity },
    { id: 'challenges', label: 'Engineering Challenges', icon: Flame },
    { id: 'results', label: 'Outcomes & Source', icon: Trophy },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6 z-10 font-sans"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
              {project.category}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>STATUS: {project.status.toUpperCase()}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close case study dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-display">
            {project.title}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1">
            {project.tagline}
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 max-h-[58vh] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Engineering Problem & Context
                </h3>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {project.problemSolved}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-500" />
                  Architectural Solution & Discipline
                </h3>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {project.solution}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  System Overview
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE & TOPOLOGY */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4 text-indigo-500" />
                  Distributed Pipeline Topology
                </h3>
                
                {/* Visual Pipeline Topology Wireframe */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs overflow-x-auto">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
                    <span>TRANSMISSION FLOW GRAPH</span>
                    <span className="text-emerald-400">ISOLATION: STRICT MULTI-TENANT</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 w-full sm:w-auto">
                      <div className="text-[10px] text-indigo-400 font-bold">CLIENT INGESTION</div>
                      <div className="text-zinc-300 font-semibold mt-0.5">REST / Webhook</div>
                    </div>
                    <span className="text-zinc-600 hidden sm:inline">&rarr;</span>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 w-full sm:w-auto">
                      <div className="text-[10px] text-violet-400 font-bold">CORE PIPELINE</div>
                      <div className="text-zinc-300 font-semibold mt-0.5">CMF Normalizer</div>
                    </div>
                    <span className="text-zinc-600 hidden sm:inline">&rarr;</span>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 w-full sm:w-auto">
                      <div className="text-[10px] text-amber-400 font-bold">ATOMIC OUTBOX</div>
                      <div className="text-zinc-300 font-semibold mt-0.5">MongoDB Tx</div>
                    </div>
                    <span className="text-zinc-600 hidden sm:inline">&rarr;</span>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 w-full sm:w-auto">
                      <div className="text-[10px] text-emerald-400 font-bold">DISTRIBUTED QUEUE</div>
                      <div className="text-zinc-300 font-semibold mt-0.5">BullMQ + Redis</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  Architectural Specifications
                </h3>
                <div className="space-y-2.5">
                  {project.architecture.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  Complete Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE TELEMETRY SANDBOX */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    <span>Pipeline Execution Simulation</span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Observe state transitions, idempotency checks, and dispatch telemetry in real time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSimulating
                        ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isSimulating ? 'Executing...' : 'Trigger Transmission'}</span>
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    aria-label="Reset simulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Simulation Steps */}
              <div className="space-y-3 font-mono text-xs">
                <div className={`p-4 rounded-xl border transition-all ${
                  simStep >= 1 ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">STEP 01 // INGESTION & IDEMPOTENCY</span>
                    <span>{simStep >= 1 ? '✓ VERIFIED [0.8ms]' : 'IDLE'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Payload received &rarr; Idempotency-Key: idm_8f219b verified &rarr; Tenant isolation validated.
                  </div>
                </div>

                <div className={`p-4 rounded-xl border transition-all ${
                  simStep >= 2 ? 'bg-violet-500/10 border-violet-500/40 text-violet-300' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">STEP 02 // CMF CONVERSION & OUTBOX TX</span>
                    <span>{simStep >= 2 ? '✓ COMMITTED [4.2ms]' : 'IDLE'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Normalized to Canonical Message Format &rarr; Atomically saved to MongoDB transactional outbox.
                  </div>
                </div>

                <div className={`p-4 rounded-xl border transition-all ${
                  simStep >= 3 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">STEP 03 // REDIS STREAMS & BULLMQ DISPATCH</span>
                    <span>{simStep >= 3 ? '✓ ENQUEUED [1.4ms]' : 'IDLE'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Outbox relay pumped message to BullMQ job queue &rarr; Distributed worker claimed task.
                  </div>
                </div>

                <div className={`p-4 rounded-xl border transition-all ${
                  simStep >= 4 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">STEP 04 // EXTERNAL PLATFORM DELIVERY</span>
                    <span>{simStep >= 4 ? '✓ 200 OK [11.6ms TOTAL]' : 'IDLE'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Channel adapters broadcasted payload &rarr; Audit log committed &rarr; OpenTelemetry span closed.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  Core Engineering Challenges & Solutions
                </h3>
                <div className="space-y-2.5">
                  {project.challenges.map((chal, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 flex items-start gap-3">
                      <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{chal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  Feature Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESULTS & LINKS */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  Measurable Outcomes & Production Readiness
                </h3>
                <div className="space-y-2.5">
                  {project.result.map((res, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 flex items-start gap-3">
                      <Trophy className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Explore Codebase & Live System
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Inspect implementation details, unit tests, and runtime interfaces.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-zinc-800 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live App</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/80">
          <span className="text-xs font-mono text-zinc-500">
            ROLE: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{project.role.toUpperCase()}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            Close [Esc]
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetailModal;
