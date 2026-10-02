/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  problemSolved: string;
  solution: string;
  architecture: string[];
  technologies: string[];
  keyFeatures: string[];
  challenges: string[];
  result: string[];
  role: string;
  githubUrl?: string;
  liveUrl?: string;
  category: 'Full Stack' | 'Frontend' | 'Web App';
  status: 'Completed' | 'In Active Development';
  isFeatured: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  isCurrent: boolean;
  platformSupported: string;
  summary: string;
  highlights: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  skillsUsed: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  details?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialType: 'Course Certification' | 'Job Simulation' | 'Professional Skill';
  skillsGained: string[];
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: {
    name: string;
    highlight?: boolean;
  }[];
}

export interface Profile {
  name: string;
  initials: string;
  headline: string;
  location: string;
  email: string;
  bioIntro: string;
  bioParagraphs: string[];
  availability: string;
  primaryRole: string;
  secondaryRoles: string[];
  canonicalUrl: string;
}

export interface PortfolioData {
  profile: Profile;
  socialLinks: {
    name: string;
    url: string;
    icon: string;
    label: string;
    isPrimary?: boolean;
  }[];
  atsKeywords: string[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Shivank Maurya",
    initials: "SM",
    headline: "FullStack MERN Developer with Production Support & Operational Discipline",
    location: "Lucknow, India",
    email: "codewithshivank@gmail.com",
    availability: "Available for FullStack MERN & Frontend Engineering Opportunities",
    primaryRole: "FullStack MERN Developer",
    secondaryRoles: [
      "Full Stack Developer",
      "MERN Stack Developer",
      "Frontend Developer",
      "Software Engineer",
      "JavaScript & TypeScript Developer",
      "Production Support Engineer"
    ],
    canonicalUrl: "https://github.com/codewith-shivank",
    bioIntro: "FullStack MERN developer based in Lucknow, India. I engineer performant, accessible web applications with React, TypeScript, Node.js, and MongoDB — backed by hands-on operational experience managing high-SLA production platform incidents for Swiggy at Niftel Communications.",
    bioParagraphs: [
      "Currently pursuing a Bachelor of Computer Applications (BCA) at Babu Banarasi Das University (2025–2028), I apply core computer science foundations — algorithms, data structures, and database management — to real-world systems across the modern JavaScript and TypeScript ecosystem.",
      "My engineering workflow spans React 19, TypeScript, Next.js, Node.js, Express, MongoDB, and PostgreSQL. What distinguishes my approach is operational grounding: supporting Swiggy's high-volume food delivery and quick-commerce platform taught me how real systems break under load, how to diagnose root causes systematically, and why clear code and telemetry matter.",
      "I believe the best software is not just visually engaging, but maintainable, accessible, and designed to solve actual human problems without unnecessary complexity."
    ]
  },
  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/shivank-maurya-21257a303/",
      icon: "linkedin",
      label: "Connect on LinkedIn",
      isPrimary: true
    },
    {
      name: "GitHub",
      url: "https://github.com/shivankmaurya",
      icon: "github",
      label: "View Code on GitHub",
      isPrimary: true
    },
    {
      name: "Email",
      url: "mailto:codewithshivank@gmail.com",
      icon: "mail",
      label: "Email Directly",
      isPrimary: true
    }
  ],
  atsKeywords: [
    "FullStack MERN",
    "MERN Stack",
    "JavaScript (ES6+)",
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "Tailwind CSS",
    "State Management",
    "Production Support",
    "Root Cause Analysis",
    "Agile Development",
    "Git",
    "Docker"
  ],
  skills: [
    {
      name: "Languages",
      description: "Core programming and typed scripting languages",
      skills: [
        { name: "JavaScript (ES6+)", highlight: true },
        { name: "TypeScript", highlight: true },
        { name: "HTML5" },
        { name: "CSS3" }
      ]
    },
    {
      name: "Frontend",
      description: "Modern component-driven web interfaces and libraries",
      skills: [
        { name: "React.js", highlight: true },
        { name: "Next.js", highlight: true },
        { name: "Tailwind CSS", highlight: true },
        { name: "Motion (Framer)", highlight: true },
        { name: "React Three Fiber / Three.js" },
        { name: "React Hook Form" },
        { name: "React Query" },
        { name: "Zustand" }
      ]
    },
    {
      name: "Backend",
      description: "Server architecture, microservices, and ORMs",
      skills: [
        { name: "Node.js", highlight: true },
        { name: "Express.js", highlight: true },
        { name: "RESTful APIs", highlight: true },
        { name: "Mongoose ODM" },
        { name: "Prisma ORM" }
      ]
    },
    {
      name: "Databases",
      description: "Relational, document, and cache storage systems",
      skills: [
        { name: "MongoDB", highlight: true },
        { name: "PostgreSQL", highlight: true },
        { name: "Redis" }
      ]
    },
    {
      name: "Auth & APIs",
      description: "Identity, authorization, and protocol tooling",
      skills: [
        { name: "JWT (JSON Web Tokens)", highlight: true },
        { name: "OAuth 2.0" },
        { name: "GraphQL" },
        { name: "Postman" }
      ]
    },
    {
      name: "Tooling & Cloud",
      description: "Development environment, versioning, and deployment pipelines",
      skills: [
        { name: "Git & GitHub", highlight: true },
        { name: "Docker" },
        { name: "Vite" },
        { name: "AWS Basics" },
        { name: "VS Code" }
      ]
    },
    {
      name: "Methodologies & Ops",
      description: "Engineering practices, diagnostics, and operational support",
      skills: [
        { name: "Root Cause Analysis (RCA)", highlight: true },
        { name: "SLA Management", highlight: true },
        { name: "Data Structures & Algorithms" },
        { name: "Agile / Scrum" },
        { name: "CI/CD Workflows" }
      ]
    }
  ],
  experience: [
    {
      id: "exp-niftel",
      title: "Customer Support Associate",
      company: "Niftel Communications",
      location: "Lucknow, India",
      period: "August 2025 – Present",
      isCurrent: true,
      platformSupported: "Swiggy Food Delivery & Quick-Commerce",
      summary: "Deliver high-touch technical and customer operations support for Swiggy's high-volume food-delivery and quick-commerce ecosystems. Specialize in structured root-cause analysis, operational handoffs, and process documentation that directly eliminated recurring system tickets.",
      highlights: [
        "Manage 50+ daily customer and operational interactions across chat and voice with strict adherence to first-response and turnaround SLAs.",
        "Perform structured root-cause analysis on multi-step delivery, order-state discrepancies, and platform anomalies to diagnose underlying technical vs. operational issues.",
        "Drove an estimated ~20% reduction in repeat issue tickets by authoring clear troubleshooting workflows and sharing verified solutions across shift handoffs.",
        "Maintain high-fidelity CRM interaction records, detailed issue logs, and technical escalation briefs for cross-functional engineering and operations squads.",
        "Collaborate across 3+ operational shifts to ensure continuity in incident tracking and customer satisfaction during peak service surges."
      ],
      metrics: [
        { label: "Daily Interactions", value: "50+" },
        { label: "Repeat Ticket Reduction", value: "~20%" },
        { label: "SLA Adherence", value: "Strict" },
        { label: "Operational Shifts", value: "3+ Coordinated" }
      ],
      skillsUsed: [
        "Root Cause Analysis",
        "Technical Troubleshooting",
        "CRM Documentation",
        "SLA Management",
        "Cross-functional Coordination",
        "Process Optimization"
      ]
    }
  ],
  projects: [
    {
      id: "proj-portfolio",
      title: "Personal Developer Portfolio & ATS Résumé",
      tagline: "High-performance digital résumé and interactive developer identity",
      category: "Frontend",
      status: "Completed",
      isFeatured: true,
      role: "Lead Frontend Engineer & Designer",
      description: "A responsive, accessible personal portfolio website built with React, TypeScript, and modern component architecture. Features dark/light modes, keyboard-friendly navigation, printable ATS résumé mode, and an intuitive case-study browser.",
      problemSolved: "Recruiters and hiring managers spend an average of 6–10 seconds evaluating candidate profiles. Standard template portfolios are bloated, difficult to parse for ATS keywords, unoptimized for mobile, and lack verified project problem-solution context.",
      solution: "Engineered a lightning-fast, zero-bloat web portfolio prioritizing verified resume data, ATS keyword discoverability, printable resume formatting, and direct 1-click recruiter actions for email, LinkedIn, and project case studies.",
      architecture: [
        "Modular Component Architecture: Strict atomic division of UI sections with clean prop boundaries and zero global side-effects.",
        "Interactive 3D via React Three Fiber: Scene graph-driven WebGL visualization with automatic resource disposal on unmount, low-overhead animation loop throttled to display refresh rate.",
        "Zero-Backend Static Architecture: Pre-rendered static assets ready for edge CDN distribution (GitHub Pages / Vercel) with 0ms server latency.",
        "Theme & Accessibility Layer: Semantic HTML5, WCAG 2.1 AA compliant contrast (4.5:1+), keyboard navigation with visible focus rings, and prefers-reduced-motion queries."
      ],
      technologies: ["React.js", "TypeScript", "Tailwind CSS", "Motion", "Vite", "Three.js", "React Three Fiber", "GitHub Pages"],
      keyFeatures: [
        "100% verified resume data representation with zero fabricated statistics",
        "Interactive ATS Keyword Explorer with 1-click clipboard Boolean search copy for recruiters",
        "Dedicated printable ATS résumé view with clean printer media stylesheet",
        "Accessible modal system with keyboard navigation (Esc to close) and ARIA attributes",
        "Social sharing drawer with preformatted sharing links for LinkedIn, WhatsApp, and X",
        "React Three Fiber interactive 3D tech-sphere visualization with mouse parallax in hero section"
      ],
      challenges: [
        "Eliminating heavy third-party bundles (removing 15MB+ of unused Firebase, Express, and GenAI SDKs) while maintaining zero compile warnings and sub-second Vite production builds.",
        "Three.js memory leaks: Ensuring all BufferGeometries, Materials, and WebGL animation frame loops properly dispose upon route change or unmount.",
        "Typography & Spacing Harmony: Balancing display typography (Plus Jakarta Sans) with code-oriented typography (JetBrains Mono) without breaking responsive viewport scaling."
      ],
      result: [
        "Sub-500ms production build with manual vendor chunk splitting (Three.js, Motion, and Lucide in separate chunks).",
        "100% accessible keyboard navigation, instant dark/light theme switching with localStorage memory.",
        "Clean, zero-waste printable ATS resume accessible in 1 click."
      ],
      githubUrl: "https://github.com/shivankmaurya/Main-Portfolio",
      liveUrl: "https://shivankmaurya.github.io/Main-Portfolio/"
    },
    {
      id: "proj-inotebook",
      title: "iNoteBook — Secure Note-Taking Web Application",
      tagline: "Cloud-based encrypted personal note management platform",
      category: "Full Stack",
      status: "Completed",
      isFeatured: true,
      role: "Full Stack Developer",
      description: "A secure cloud-based note-taking web application that allows users to create, read, update, and manage personal notes through an authenticated and protected web interface.",
      problemSolved: "Users needed a lightweight, accessible personal note repository that protects sensitive notes from unauthorized viewing, cross-user data leakage, and session hijacking while providing instant synchronization and tagging across browser sessions.",
      solution: "Developed a full-stack web application featuring user registration, token-based authentication (JWT), secure CRUD RESTful endpoints, and an intuitive note organization dashboard.",
      architecture: [
        "Client: React.js single-page application with centralized state management, responsive card layouts, and live input validation.",
        "Server: Node.js & Express.js RESTful API architecture structured with layered route controllers, validation middleware, and centralized error handling.",
        "Database: MongoDB Atlas with Mongoose schema modeling, indexed user references, and strict referential integrity.",
        "Security Pipeline: User authentication with bcrypt hashing (salt rounds: 10) and JSON Web Tokens (JWT) verified via custom Express middleware (fetchuser) protecting all note endpoints."
      ],
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "REST APIs", "Tailwind CSS"],
      keyFeatures: [
        "Secure user authentication and session management using JSON Web Tokens (JWT)",
        "Full CRUD operations (Create, Read, Update, Delete) for user-owned notes",
        "Tagging and categorization system for fast note retrieval and search",
        "Stateful React interface with responsive card layouts and instant feedback",
        "Security-first API architecture preventing cross-user note leakage"
      ],
      challenges: [
        "Protecting against IDOR (Insecure Direct Object References): Ensuring the backend verifies that the note ID being updated or deleted belongs strictly to the authenticated req.user.id before executing database mutations.",
        "State Synchronization: Ensuring the client-side notes state immediately reflects server mutations (optimistic updates and rollback on error) without requiring full page reloads."
      ],
      result: [
        "Zero unauthorized note access across multi-user testing scenarios.",
        "Sub-100ms API response time on standard CRUD queries.",
        "Fully responsive user experience across mobile and desktop viewports."
      ],
      githubUrl: "https://github.com/shivankmaurya",
      liveUrl: ""
    }
  ],
  education: [
    {
      id: "edu-bca",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Babu Banarasi Das University",
      location: "Lucknow, India",
      period: "2025 – 2028",
      details: "Comprehensive coursework in Computer Science, Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, and Web Application Development."
    },
    {
      id: "edu-inter",
      degree: "12th Standard — Science",
      institution: "S.C.S.A.S.N. Inter College",
      location: "India",
      period: "2023 – 2024",
      details: "Science curriculum emphasizing Mathematics, Physics, Chemistry, and analytical logical problem solving."
    }
  ],
  certifications: [
    {
      id: "cert-mern",
      title: "Node, Express, MongoDB",
      issuer: "Knowledge Gate",
      date: "Verified Certification",
      credentialType: "Course Certification",
      skillsGained: ["Node.js", "Express.js", "MongoDB", "Backend Architecture", "REST APIs"]
    },
    {
      id: "cert-deloitte-tech",
      title: "Technology Job Simulation",
      issuer: "Deloitte Australia (via Forage)",
      date: "Verified Simulation",
      credentialType: "Job Simulation",
      skillsGained: ["Software Development Life Cycle", "Architecture Planning", "Technical Evaluation"]
    },
    {
      id: "cert-deloitte-cyber",
      title: "Cyber Job Simulation",
      issuer: "Deloitte Australia (via Forage)",
      date: "Verified Simulation",
      credentialType: "Job Simulation",
      skillsGained: ["Cybersecurity Fundamentals", "Threat Assessment", "Secure Design Principles"]
    },
    {
      id: "cert-accenture-data",
      title: "Data Analytics and Visualization Job Simulation",
      issuer: "Accenture North America (via Forage)",
      date: "Verified Simulation",
      credentialType: "Job Simulation",
      skillsGained: ["Data Modeling", "Business Analytics", "Insight Visualization"]
    },
    {
      id: "cert-tata-data",
      title: "Data Visualization: Empowering Business with Effective Insights",
      issuer: "Tata Group (via Forage)",
      date: "Verified Simulation",
      credentialType: "Job Simulation",
      skillsGained: ["Executive Data Storytelling", "Dashboard Interpretation", "Business Impact"]
    }
  ]
};
