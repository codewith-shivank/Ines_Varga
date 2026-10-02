/**
 * Ines Varga — Photographer & Director Portfolio Data
 * LOUVER Template Data Layer
 */

export interface Project {
  id: string;
  client: string;
  title: string;
  category: string;
  year: string;
  description: string;
  deliverables: string[];
  portrait: string;
  landscape: string;
}

export interface ClientEntry {
  name: string;
  fontClass: string;
  year: string;
}

export const INES_BIO = {
  firstName: 'Ines',
  lastName: 'VARGA',
  role: 'Photographer & Director',
  base: 'Lisbon — New York',
  copyright: '©2026 INES VARGA®',
  bio: 'Fashion, still life and moving image for brands that would rather be felt than seen. Based between Lisbon and New York — shooting everywhere.',
  stats: 'Est. 2014 · 212 commissions',
  email: 'hello@inesvarga.studio',
  instagram: '@ines.varga',
  instagramUrl: 'https://instagram.com/ines.varga',
};

export const PROJECTS: Project[] = [
  {
    id: '01',
    client: 'Celine',
    title: 'QUIET LUXURY',
    category: 'EDITORIAL',
    year: '2024',
    description: 'A visual essay on understated elegance for Celine\'s Spring/Summer collection. Shot across three days in the salt flats of southern Portugal — natural light only, 35mm and medium format.',
    deliverables: ['Art Direction', 'Photography', 'Color Grading', '12 Final Selects'],
    portrait: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&h=1067',
    landscape: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200&h=750',
  },
  {
    id: '02',
    client: 'Jacquemus',
    title: 'LE JARDIN',
    category: 'CAMPAIGN',
    year: '2024',
    description: 'Summer campaign captured in lavender fields of Provence. A celebration of Mediterranean warmth, color, and movement — where fashion meets landscape.',
    deliverables: ['Creative Direction', 'Photography', 'Motion', '8 Hero Shots'],
    portrait: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800&h=1067',
    landscape: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=750',
  },
  {
    id: '03',
    client: 'Aesop',
    title: 'TEXTURE STUDIES',
    category: 'STILL LIFE',
    year: '2023',
    description: 'A tactile exploration of Aesop\'s botanical formulations. Each frame composed to reveal the material honesty of glass, liquid, and light in their Lisbon flagship.',
    deliverables: ['Still Life Direction', 'Photography', 'Post-Production', '24 Product Shots'],
    portrait: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800&h=1067',
    landscape: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1200&h=750',
  },
  {
    id: '04',
    client: 'COS',
    title: 'PAPER & CLOTH',
    category: 'LOOKBOOK',
    year: '2023',
    description: 'Minimal lookbook exploring the dialogue between architecture and garment. Shot at the MAAT museum in Lisbon — clean lines, muted tones, intentional negative space.',
    deliverables: ['Photography', 'Art Direction', 'Retouching', '36 Final Images'],
    portrait: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&h=1067',
    landscape: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=750',
  },
  {
    id: '05',
    client: 'Maison Margiela',
    title: 'REPLICA',
    category: 'FILM',
    year: '2022',
    description: 'Short film for the Replica fragrance line. Memory, texture, and scent translated into moving image — shot on 16mm film across Brooklyn interiors.',
    deliverables: ['Direction', 'Cinematography', 'Color Grade', '2min Film'],
    portrait: 'https://images.unsplash.com/photo-1581044777550-4cfa60707998?auto=format&fit=crop&q=80&w=800&h=1067',
    landscape: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1200&h=750',
  },
];

export const SELECTED_CLIENTS: ClientEntry[] = [
  { name: 'Celine', fontClass: 'font-anton uppercase text-5xl md:text-6xl', year: '2024' },
  { name: 'Jacquemus', fontClass: 'font-serif-italic text-5xl md:text-6xl', year: '2024' },
  { name: 'Aesop', fontClass: 'font-inter-tight font-extralight uppercase tracking-[0.3em] text-4xl md:text-5xl', year: '2023' },
  { name: 'COS', fontClass: 'font-space-mono uppercase text-4xl md:text-5xl tracking-widest', year: '2023' },
  { name: 'Maison Margiela', fontClass: 'font-inter-tight font-bold uppercase text-4xl md:text-5xl tracking-tight', year: '2022' },
  { name: 'Byredo', fontClass: 'font-serif-italic text-5xl md:text-6xl tracking-wide', year: '2021' },
];

/** Gallery strip items for the Frames section */
export const FRAMES_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600&h=800', caption: 'Celine SS24 — 01', aspect: 'portrait' as const, tilt: -6 },
  { src: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=900&h=600', caption: 'Celine SS24 — 02', aspect: 'landscape' as const, tilt: 4 },
  { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600&h=800', caption: 'Jacquemus — Le Jardin', aspect: 'portrait' as const, tilt: -3 },
  { src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=900&h=600', caption: 'Aesop — Texture 01', aspect: 'landscape' as const, tilt: 5 },
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&h=800', caption: 'COS — Paper & Cloth', aspect: 'portrait' as const, tilt: -4 },
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=900&h=600', caption: 'Jacquemus — Fields', aspect: 'landscape' as const, tilt: 3 },
  { src: 'https://images.unsplash.com/photo-1581044777550-4cfa60707998?auto=format&fit=crop&q=80&w=600&h=800', caption: 'Margiela — Replica', aspect: 'portrait' as const, tilt: -5 },
  { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900&h=600', caption: 'COS — Lines', aspect: 'landscape' as const, tilt: 4 },
];
