/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Home Page View — Conforms to target structure pages/Home.js
 */

import React from 'react';
import { initialPortfolioData } from '../data/portfolioData';
import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { SectionDivider } from '../components/SectionDivider';
import { About } from '../components/About';
import { SkillsSection } from '../components/SkillsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { ContactSection } from '../components/ContactSection';

const MARQUEE_TELEMETRY = [
  'FullStack MERN Architecture',
  'Transactional Outbox Pattern',
  'Canonical Message Format (CMF)',
  'Redis Streams & BullMQ Jobs',
  'Multi-Tenant Data Isolation',
  'Optimistic UI State Synchronization',
  'TypeScript Strict Mode',
  'OpenTelemetry Distributed Tracing',
  'React 19 & High-Density UI',
];

export const Home: React.FC = () => {
  const data = initialPortfolioData;

  return (
    <div className="space-y-0">
      <Hero data={data} />
      <Marquee items={MARQUEE_TELEMETRY} />
      <SectionDivider sectionNumber="01" label="ARCHITECTURAL_PROFILE" />
      <About data={data} />
      <SectionDivider sectionNumber="02" label="CORE_COMPETENCIES" />
      <SkillsSection categories={data.skills} />
      <SectionDivider sectionNumber="03" label="PRODUCTION_CASE_STUDIES" />
      <ProjectsSection projects={data.projects} />
      <SectionDivider sectionNumber="04" label="COMMERCIAL_ENGINEERING" />
      <ExperienceSection experienceList={data.experience} />
      <SectionDivider sectionNumber="05" label="ACADEMIC_FOUNDATIONS" />
      <EducationSection educationList={data.education} certifications={data.certifications} />
      <SectionDivider sectionNumber="06" label="TRANSMISSION_DISPATCH" />
      <ContactSection data={data} />
    </div>
  );
};

export default Home;
