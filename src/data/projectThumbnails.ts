/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Procedural architectural topology SVG thumbnails for flagship projects.
 * Real <img> stays in DOM for accessibility, SEO, and fallback.
 */

export const PROJECT_THUMBNAILS: Record<string, string> = {
  omnisync: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#09090b"/>
          <stop offset="100%" stop-color="#18181b"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="50%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#bg)"/>
      <g stroke="#27272a" stroke-width="1" opacity="0.4">
        <path d="M0 50h800M0 100h800M0 150h800M0 200h800M0 250h800M0 300h800M0 350h800"/>
        <path d="M50 0v400M100 0v400M150 0v400M200 0v400M250 0v400M300 0v400M350 0v400M400 0v400M450 0v400M500 0v400M550 0v400M600 0v400M650 0v400M700 0v400M750 0v400"/>
      </g>
      <!-- Pipeline Nodes -->
      <path d="M120 200 H280 H440 H600 H720" stroke="url(#accent)" stroke-width="3" fill="none"/>
      
      <!-- Node 1: Ingest -->
      <rect x="60" y="160" width="120" height="80" rx="8" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
      <text x="120" y="195" fill="#a5b4fc" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">GATEWAY</text>
      <text x="120" y="215" fill="#71717a" font-family="monospace" font-size="10" text-anchor="middle">HTTP/CMF</text>

      <!-- Node 2: Outbox -->
      <rect x="220" y="160" width="120" height="80" rx="8" fill="#18181b" stroke="#8b5cf6" stroke-width="2"/>
      <text x="280" y="195" fill="#c4b5fd" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">OUTBOX</text>
      <text x="280" y="215" fill="#71717a" font-family="monospace" font-size="10" text-anchor="middle">Mongo Tx</text>

      <!-- Node 3: Stream Queue -->
      <rect x="380" y="160" width="120" height="80" rx="8" fill="#18181b" stroke="#38bdf8" stroke-width="2"/>
      <text x="440" y="195" fill="#7dd3fc" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">REDIS/BULLMQ</text>
      <text x="440" y="215" fill="#71717a" font-family="monospace" font-size="10" text-anchor="middle">Streams</text>

      <!-- Node 4: Dispatcher -->
      <rect x="540" y="160" width="120" height="80" rx="8" fill="#18181b" stroke="#10b981" stroke-width="2"/>
      <text x="600" y="195" fill="#6ee7b7" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">ADAPTERS</text>
      <text x="600" y="215" fill="#71717a" font-family="monospace" font-size="10" text-anchor="middle">Multi-Tenant</text>

      <circle cx="120" cy="200" r="4" fill="#6366f1"/>
      <circle cx="280" cy="200" r="4" fill="#8b5cf6"/>
      <circle cx="440" cy="200" r="4" fill="#38bdf8"/>
      <circle cx="600" cy="200" r="4" fill="#10b981"/>
    </svg>
  `)}`,

  cloudpulse: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#09090b"/>
          <stop offset="100%" stop-color="#18181b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#bg2)"/>
      <path d="M50 320 Q200 120 350 260 T650 140 T750 220" fill="none" stroke="#6366f1" stroke-width="3"/>
      <path d="M50 320 Q200 120 350 260 T650 140 T750 220 L750 400 L50 400 Z" fill="#6366f1" opacity="0.08"/>
      <path d="M50 280 Q220 220 400 160 T750 100" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4"/>
      <text x="70" y="70" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">TELEMETRY_INGESTION_P99</text>
      <text x="70" y="95" fill="#71717a" font-family="monospace" font-size="12">50,000 EVENTS/SEC @ 18MS WINDOW</text>
    </svg>
  `)}`,

  flowboard: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
      <rect width="800" height="400" fill="#09090b"/>
      <circle cx="250" cy="200" r="90" fill="none" stroke="#6366f1" stroke-width="2"/>
      <circle cx="400" cy="200" r="110" fill="none" stroke="#8b5cf6" stroke-width="2"/>
      <circle cx="550" cy="200" r="90" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="400" y="205" fill="#f43f5e" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">CRDT_STATE_SYNC</text>
    </svg>
  `)}`,

  synthetix: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
      <rect width="800" height="400" fill="#09090b"/>
      <path d="M400 60 L240 180 L320 320 M400 60 L560 180 L480 320" stroke="#10b981" stroke-width="2" fill="none"/>
      <circle cx="400" cy="60" r="12" fill="#10b981"/>
      <circle cx="240" cy="180" r="10" fill="#6366f1"/>
      <circle cx="560" cy="180" r="10" fill="#38bdf8"/>
      <circle cx="320" cy="320" r="8" fill="#8b5cf6"/>
      <circle cx="480" cy="320" r="8" fill="#f59e0b"/>
      <text x="400" y="370" fill="#a1a1aa" font-family="monospace" font-size="12" text-anchor="middle">AST_BYTECODE_PIPELINE</text>
    </svg>
  `)}`,
};
