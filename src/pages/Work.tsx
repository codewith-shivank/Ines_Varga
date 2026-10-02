/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Work Page View — Conforms to target structure pages/Work.js
 * Showcases featured engineering projects, deep case studies, and horizontal tracks.
 */

import React from 'react';
import { initialPortfolioData } from '../data/portfolioData';
import { ProjectsSection } from '../components/ProjectsSection';
import { SectionDivider } from '../components/SectionDivider';
import { Marquee } from '../components/Marquee';

const WORK_TECH = [
  'Distributed Sagas',
  'Transactional Outbox',
  'Redis Streams',
  'BullMQ Queues',
  'MongoDB ACID Transactions',
  'WebSocket Telemetry',
  'CRDT State Synchronization',
  'Docker & GitHub Actions CI/CD',
];

export const Work: React.FC = () => {
  const data = initialPortfolioData;

  return (
    <div className="pt-20">
      <SectionDivider sectionNumber="03" label="PRODUCTION_CASE_STUDIES" />
      <ProjectsSection projects={data.projects} />
      <Marquee items={WORK_TECH} reverse speed={22} />
    </div>
  );
};

export default Work;
