/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * About Page View — Conforms to target structure pages/About.js
 * Showcases engineering profile, operational discipline, competencies, and experience.
 */

import React from 'react';
import { initialPortfolioData } from '../data/portfolioData';
import { About as AboutComponent } from '../components/About';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { SectionDivider } from '../components/SectionDivider';

export const About: React.FC = () => {
  const data = initialPortfolioData;

  return (
    <div className="pt-20">
      <SectionDivider sectionNumber="01" label="ARCHITECTURAL_PROFILE" />
      <AboutComponent data={data} />
      <SectionDivider sectionNumber="02" label="CORE_COMPETENCIES" />
      <SkillsSection categories={data.skills} />
      <SectionDivider sectionNumber="04" label="COMMERCIAL_ENGINEERING" />
      <ExperienceSection experienceList={data.experience} />
      <SectionDivider sectionNumber="05" label="ACADEMIC_FOUNDATIONS" />
      <EducationSection educationList={data.education} certifications={data.certifications} />
    </div>
  );
};

export default About;
