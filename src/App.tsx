/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { initialPortfolioData } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

const ResumeModal = React.lazy(() => import('./components/ResumeModal').then(m => ({ default: m.ResumeModal })));

export default function App() {
  const data = initialPortfolioData;
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/20 selection:text-indigo-400 transition-colors duration-200">
        
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

          {/* About & Professional Positioning */}
          <About
            data={data}
          />

          {/* Skills & Technical Competencies */}
          <SkillsSection
            categories={data.skills}
          />

          {/* Featured Engineering Projects & Deep Case Studies */}
          <ProjectsSection
            projects={data.projects}
          />

          {/* Work Experience & Production Platform Support */}
          <ExperienceSection
            experienceList={data.experience}
          />

          {/* Academic Background & Certified Credentials */}
          <EducationSection
            educationList={data.education}
            certifications={data.certifications}
          />

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
    </ThemeProvider>
  );
}
