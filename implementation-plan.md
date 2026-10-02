# Portfolio Redesign Implementation Plan

## Philosophy: Design demonstrates taste, Animation demonstrates engineering, 3D demonstrates technical ability, Projects demonstrate real development skills.

## Core Principles
- **No complexity for complexity's sake** — every visual effect must have a purpose
- **Selective 3D** — React Three Fiber only where it genuinely adds value (hero immersion)
- **Meaningful motion** — Motion for transitions and micro-interactions only
- **Static-first** — no server, no auth, no Firebase, no EmailJS — deploy to GitHub Pages/Vercel

## Phase 4 — Implementation Scope

### Remove (Going Static-First)
- [x] Express server (`server.ts`) — pure Vite static build
- [x] Firebase SDK — auth, Firestore, Google Sign-In
- [x] RAG Engine (`ragEngine.ts`) + Gemini AI dependency
- [x] Admin panels — RecruiterHub, AdminKnowledgeModal
- [x] EmailJS — contact form → simple mailto or basic form
- [x] Google GenAI dependency
- [x] 7+ modals → consolidate to 3-4 essential ones
- [x] Project CMS — replace with static case studies
- [x] Auth-dependent bookmarks → localStorage only

### Preserve & Enhance
- [x] Theme toggle (dark/light with system preference)
- [x] Resume modal (printable ATS résumé)
- [x] Skills section (refactored — remove AI/Prompt Engineering)
- [x] Projects showcase (major enhancement — rich case study cards)
- [x] About section (reframed toward developer identity)
- [x] Experience section (operational + technical problem solving)
- [x] Education & Certifications (minor styling)
- [x] Contact section (simplified: email + LinkedIn)
- [x] Footer (enhanced)
- [x] Navbar (simplified)
- [x] Hero (R3F 3D refactor + positioning)
- [x] Motion animations (spring easing, micro-interactions)
- [x] Design system tokens (typography, spacing, color)

### Architecture Decision
- **Framework**: React 19 + TypeScript + Tailwind CSS 4 + Motion 12
- **3D**: React Three Fiber (not raw Three.js API)
- **Build**: Vite (no Express needed)
- **Deployment**: GitHub Pages, Vercel, or Netlify
- **State**: React state + localStorage for saved projects only

## Phase 5 — Project Showcase Structure (per project)
```
Problem → Solution → Architecture → Technologies → Key Features → Challenges → Result → Live Demo → GitHub
```

## Phase 6 — Quality Loop Verification
- [ ] Build passes
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] No console errors
- [ ] No broken routes
- [ ] No broken links
- [ ] Mobile works
- [ ] Tablet works
- [ ] Desktop works
- [ ] Animations are smooth
- [ ] 3D performance acceptable (target: < 50ms frame time on desktop)
- [ ] Accessibility acceptable (WCAG AA: 4.5:1 contrast, focus visible, aria labels)
- [ ] SEO implemented (meta tags, structured data)
- [ ] Images/assets optimized
- [ ] No unused dependencies

## Key Refactoring Decisions
1. **Hero3D**: Rewrite from raw Three.js to React Three Fiber with proper hooks, refs, and cleanup
2. **Typography**: Plus Jakarta Sans display / JetBrains Mono code — consistent 1.5x modular scale
3. **Color tokens**: Design system variables: `--color-bg`, `--color-fg`, `--color-accent`, `--color-muted`
4. **Spacing scale**: 4-token base rhythm: 0.25rem (4px), 0.5rem (8px), 1rem (16px), 1.5rem (24px), 2rem (32px), 3rem (48px), 4rem (64px)
5. **Section spacing**: Consistent 4rem (64px) vertical rhythm
6. **Max width**: 72rem (1152px) with 4rem gutters

## File Changes Summary
- Remove: `server.ts`, `.env.example` admin/password, all Firebase-related code
- Rewrite: `Hero3D.tsx` → React Three Fiber
- Rewrite: `Hero.tsx` → simplified positioning, refined CTAs
- Rewrite: `SkillsSection.tsx` → remove AI/Prompt Engineering skills
- Rewrite: `ProjectsSection.tsx` → enhanced case study cards with full structure
- Rewrite: `About.tsx` → developer identity framing
- Rewrite: `ExperienceSection.tsx` → operational + technical problem solving
- Remove: `ragEngine.ts`, `apiClient.ts`, `firebase/` directory
- Simplify: Contact form → mailto only
- Simplify: Modal system → 3-4 essential modals
- Enhance: Footer → richer footer with tech stack display
- New: Design token CSS variables in `index.css`
- New: Component library utilities