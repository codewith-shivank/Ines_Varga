/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ScrollProvider } from './core/ScrollProvider';
import { initialPortfolioData } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Preloader } from './components/Preloader';
import { GlobalCanvas } from './components/GlobalCanvas';
import { CustomCursor } from './components/CustomCursor';
import { SectionDivider } from './components/SectionDivider';
import { Marquee } from './components/Marquee';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

const ResumeModal = React.lazy(() => import('./components/ResumeModal').then(m => ({ default: m.ResumeModal })));

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

export default function App() {
  const data = initialPortfolioData;
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <ThemeProvider>
      <ScrollProvider>
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/20 selection:text-indigo-400 transition-colors duration-200">
        
        {/* Entrance Preloader */}
        <Preloader />

        {/* Unified Single WebGL Canvas (owned by SceneManager) */}
        <GlobalCanvas />

        {/* High-Precision Interactive Reticle Cursor */}
        <CustomCursor />

        {/* Skip to Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-semibold focus:text-xs"
        >
          Skip to main content
        </a>

        {/* Global Navigation */}
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* Main Content Landmark */}
        <main id="main-content">
          {/* Hero Section with Interactive 3D */}
          <Hero
            data={data}
          />

          {/* Infinite Architecture & Competency Telemetry Ticker */}
          <Marquee items={MARQUEE_TELEMETRY} />

          <SectionDivider sectionNumber="01" label="ARCHITECTURAL_PROFILE" />

          {/* About & Professional Positioning */}
          <About
            data={data}
          />

          <SectionDivider sectionNumber="02" label="CORE_COMPETENCIES" />

          {/* Skills & Technical Competencies */}
          <SkillsSection
            categories={data.skills}
          />

          <SectionDivider sectionNumber="03" label="PRODUCTION_CASE_STUDIES" />

          {/* Featured Engineering Projects & Deep Case Studies */}
          <ProjectsSection
            projects={data.projects}
          />

          <SectionDivider sectionNumber="04" label="COMMERCIAL_ENGINEERING" />

          {/* Work Experience & Production Platform Support */}
          <ExperienceSection
            experienceList={data.experience}
          />

          <SectionDivider sectionNumber="05" label="ACADEMIC_FOUNDATIONS" />

          {/* Academic Background & Certified Credentials */}
          <EducationSection
            educationList={data.education}
            certifications={data.certifications}
          />

          <SectionDivider sectionNumber="06" label="TRANSMISSION_DISPATCH" />

          {/* Contact & Inquiries */}
          <ContactSection
            data={data}
          />
        </main>

        {/* Global Footer */}
        <Footer
          data={data}
        />

        {/* Full ATS Resume Modal (Printable & Plain Text) */}
        {isResumeOpen && (
          <React.Suspense fallback={null}>
            <ResumeModal
              isOpen={isResumeOpen}
              onClose={() => setIsResumeOpen(false)}
              data={data}
            />
          </React.Suspense>
        )}

      </div>
      </ScrollProvider>
    </ThemeProvider>
  );
}
