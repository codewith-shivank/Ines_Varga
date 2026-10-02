/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contact Page View — Conforms to target structure pages/Contact.js
 * Inquiries, direct communications, and technical transmission dispatch.
 */

import React from 'react';
import { initialPortfolioData } from '../data/portfolioData';
import { ContactSection } from '../components/ContactSection';
import { SectionDivider } from '../components/SectionDivider';

export const Contact: React.FC = () => {
  const data = initialPortfolioData;

  return (
    <div className="pt-20">
      <SectionDivider sectionNumber="06" label="TRANSMISSION_DISPATCH" />
      <ContactSection data={data} />
    </div>
  );
};

export default Contact;
