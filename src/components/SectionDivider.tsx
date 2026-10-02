/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SectionDivider — Technical command center section partition.
 * Renders editorial calibration hairlines, telemetry section indices (SEC.0X),
 * and precision alignment nodes with zero layout shift.
 */

import React from 'react';

export interface SectionDividerProps {
  sectionNumber: string;
  label: string;
  telemetryCode?: string;
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  sectionNumber,
  label,
  telemetryCode = '200 OK // READY',
  className = '',
}) => {
  return (
    <div
      className={`relative w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-6 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-4 border-y border-zinc-200/80 dark:border-zinc-800/80 py-2.5">
        {/* Left: Section Telemetry Coordinate */}
        <div className="flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
          <span className="w-1.5 h-1.5 rounded-sm bg-indigo-500/80" />
          <span className="font-bold text-zinc-700 dark:text-zinc-300">SEC.{sectionNumber}</span>
          <span className="text-zinc-400 dark:text-zinc-600">//</span>
          <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        </div>

        {/* Center: Calibration Tick Marks */}
        <div className="hidden sm:flex items-center gap-1.5 text-zinc-300 dark:text-zinc-800 font-mono text-[9px] tracking-tight">
          <span>+</span>
          <span className="w-8 border-b border-dashed border-zinc-300 dark:border-zinc-800" />
          <span>[COORD.LOCK]</span>
          <span className="w-8 border-b border-dashed border-zinc-300 dark:border-zinc-800" />
          <span>+</span>
        </div>

        {/* Right: Telemetry Status */}
        <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          <span>{telemetryCode}</span>
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
