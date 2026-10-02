import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../data/inesPortfolio';

interface SelectedWorkProps {
  projects: Project[];
  setCursorMode: (mode: 'default' | 'drag' | 'view') => void;
}

interface WorkRowProps {
  project: Project;
  index: number;
  setCursorMode: (mode: 'default' | 'drag' | 'view') => void;
  onToggle: (id: string) => void;
  isExpanded: boolean;
}

const WorkRow: React.FC<WorkRowProps> = ({ project, index, setCursorMode, onToggle, isExpanded }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="scroll-reveal" style={{ animationDelay: `${index * 0.08}s` }}>
      <div
        ref={rowRef}
        className={`relative group cursor-pointer border-b border-ink-14 transition-colors duration-500 ${
          isHovered && !isExpanded ? 'bg-[#1A1814] text-[#E9E4D8]' : 'bg-transparent text-[#1A1814]'
        }`}
        onMouseEnter={() => {
          setIsHovered(true);
          setCursorMode('view');
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCursorMode('default');
        }}
        onMouseMove={handleMouseMove}
        onClick={() => onToggle(project.id)}
      >
        {/* Main Row Content */}
        <div className="grid grid-cols-12 items-center px-4 md:px-8 py-5 md:py-7 gap-2 md:gap-4">
          {/* Index */}
          <div className="col-span-2 md:col-span-1 font-space-mono text-[10px] md:text-xs uppercase tracking-widest opacity-50">
            ({project.id})
          </div>

          {/* Client (serif italic) + Title (Anton uppercase) */}
          <div className="col-span-7 md:col-span-6 flex flex-col md:flex-row md:items-baseline md:space-x-4">
            <span className="font-serif-italic text-lg md:text-xl opacity-80">{project.client}</span>
            <span className="font-anton text-xl md:text-3xl lg:text-4xl uppercase tracking-tight leading-none">
              {project.title}
            </span>
          </div>

          {/* Category */}
          <div className="hidden md:block col-span-2 font-space-mono text-[10px] md:text-xs uppercase tracking-widest opacity-50">
            {project.category}
          </div>

          {/* Year */}
          <div className="hidden md:block col-span-2 font-space-mono text-[10px] md:text-xs uppercase tracking-widest opacity-50 text-right">
            {project.year}
          </div>

          {/* Arrow */}
          <div className="col-span-3 md:col-span-1 text-right font-inter-tight text-lg md:text-xl">
            <span className={`inline-block transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'group-hover:translate-x-1'}`}>
              →
            </span>
          </div>
        </div>

        {/* Floating Image Preview (follows cursor on desktop) */}
        {isHovered && !isExpanded && (
          <div
            className="absolute pointer-events-none z-50 hidden md:block"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: 'translate(-50%, -110%)',
            }}
          >
            <div className="w-[200px] h-[260px] rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-3">
              <img
                src={project.portrait}
                alt={project.title}
                className="w-full h-full object-cover warm-photo"
              />
            </div>
          </div>
        )}
      </div>

      {/* Expanded Detail Panel */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-out bg-[#F2EEE5] ${
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 md:px-8 py-8 md:py-12 space-y-8">
          {/* Two Large Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
              <img
                src={project.portrait}
                alt={`${project.title} — Portrait`}
                className="w-full h-full object-cover warm-photo hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
            <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-lg self-center">
              <img
                src={project.landscape}
                alt={`${project.title} — Landscape`}
                className="w-full h-full object-cover warm-photo hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
          </div>

          {/* Description + Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/50 mb-3">
                BRIEF
              </div>
              <p className="font-inter-tight text-base md:text-lg leading-relaxed text-[#1A1814]/90">
                {project.description}
              </p>
            </div>
            <div>
              <div className="font-space-mono text-[10px] uppercase tracking-widest text-[#1A1814]/50 mb-3">
                DELIVERABLES
              </div>
              <ul className="space-y-1.5">
                {project.deliverables.map((d, i) => (
                  <li key={i} className="font-space-mono text-xs uppercase tracking-wider text-[#1A1814]/70 flex items-center space-x-2">
                    <span className="w-1 h-1 rounded-full bg-[#1A1814]/40" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectedWork: React.FC<SelectedWorkProps> = ({ projects, setCursorMode }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="work" className="w-full bg-[#E9E4D8] border-b border-ink-14">
      {/* Section Label */}
      <div className="px-4 md:px-8 pt-12 md:pt-20 pb-6 md:pb-10">
        <div className="font-space-mono text-[10px] md:text-xs uppercase tracking-widest text-[#1A1814]/50">
          (02) — SELECTED WORK
        </div>
      </div>

      {/* Top Border */}
      <div className="border-t border-ink-14">
        {projects.map((project, index) => (
          <WorkRow
            key={project.id}
            project={project}
            index={index}
            setCursorMode={setCursorMode}
            onToggle={handleToggle}
            isExpanded={expandedId === project.id}
          />
        ))}
      </div>
    </section>
  );
};
