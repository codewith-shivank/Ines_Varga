/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * BackgroundCanvas — Framework-agnostic Three.js ambient background matrix.
 * Visualizes the Noise-to-Signal substrate: subtle coordinate lattice that responds
 * to scroll velocity and global noise levels, strictly throttled to preserve 60-120fps.
 */

import * as THREE from 'three';
import { globalEmitter } from '../core/EventEmitter';
import { getHardwareTier, HardwareTier, isMobileDevice, isWebGLSupported, prefersReducedMotion } from '../utils/media';

export interface BackgroundCanvasOptions {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
}

export class BackgroundCanvas {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private isRunning: boolean = false;
  private isVisible: boolean = true;
  private isContextLost: boolean = false;
  private rafId: number | null = null;
  private startTime: number = performance.now();

  // Noise & Scroll state
  private noiseFactor: number = 0.0;
  private scrollVelocity: number = 0;
  private scrollProgress: number = 0;

  // Geometry
  private gridPoints: THREE.Points | null = null;
  private originalPositions: Float32Array | null = null;
  private gridLines: THREE.LineSegments | null = null;

  // Observers & Cleanups
  private resizeObserver: ResizeObserver | null = null;
  private cleanups: Array<() => void> = [];

  constructor(options: BackgroundCanvasOptions) {
    this.container = options.container;
    this.canvas = options.canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.set(0, 5, 24);
    this.camera.lookAt(0, 0, 0);

    this.init();
  }

  private init(): void {
    const isMobile = isMobileDevice();
    const tier = getHardwareTier();

    // If low tier, reduced motion, or WebGL shader precision unavailable, exit cleanly
    if (tier === HardwareTier.LOW || !isWebGLSupported(this.canvas)) {
      return;
    }

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch (e) {
      console.warn('BackgroundCanvas WebGL init failed:', e);
      return;
    }

    if (!this.renderer) {
      return;
    }

    const maxDpr = isMobile ? 1.0 : tier === HardwareTier.HIGH ? 1.5 : 1.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setClearColor(0x000000, 0);

    // Build ambient coordinate lattice
    this.buildLattice(tier);

    // Resize Handling
    this.handleResize();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    // Tab visibility handling (pause RAF when tab hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.stop();
      } else if (this.isVisible) {
        this.start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.cleanups.push(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });

    // WebGL Context Loss Handling
    const onContextLost = (e: Event) => {
      e.preventDefault();
      this.isContextLost = true;
      this.stop();
    };

    const onContextRestored = () => {
      this.isContextLost = false;
      this.init();
      this.start();
    };

    this.canvas.addEventListener('webglcontextlost', onContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    this.cleanups.push(() => {
      this.canvas.removeEventListener('webglcontextlost', onContextLost);
      this.canvas.removeEventListener('webglcontextrestored', onContextRestored);
    });

    // Subscribe to global emitters
    const unbindNoise = globalEmitter.on('noise:level', (data: { noiseFactor: number }) => {
      this.noiseFactor = data.noiseFactor;
    });

    const unbindScroll = globalEmitter.on('scroll:tick', (data: { velocity: number; progress: number }) => {
      this.scrollVelocity = data.velocity;
      this.scrollProgress = data.progress;
    });

    this.cleanups.push(unbindNoise, unbindScroll);

    // Reduced motion check
    if (prefersReducedMotion()) {
      this.renderFrame(0);
    } else {
      this.start();
    }
  }

  private buildLattice(tier: HardwareTier): void {
    // Generate a subtle planar coordinate grid with floating node points
    const cols = tier === HardwareTier.HIGH ? 32 : 20;
    const rows = tier === HardwareTier.HIGH ? 24 : 16;
    const spacing = 2.4;
    const totalPoints = cols * rows;

    const positions = new Float32Array(totalPoints * 3);
    const offsetX = ((cols - 1) * spacing) / 2;
    const offsetZ = ((rows - 1) * spacing) / 2;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[idx] = c * spacing - offsetX;
        positions[idx + 1] = -4; // Situated below primary content plane
        positions[idx + 2] = r * spacing - offsetZ;
        idx += 3;
      }
    }

    this.originalPositions = new Float32Array(positions);

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointMat = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.08,
      transparent: true,
      opacity: 0.35,
    });

    this.gridPoints = new THREE.Points(pointGeo, pointMat);
    this.scene.add(this.gridPoints);

    // Wireframe plane for subtle geometric horizon
    const planeGeo = new THREE.PlaneGeometry(cols * spacing, rows * spacing, cols / 2, rows / 2);
    planeGeo.rotateX(-Math.PI / 2);
    planeGeo.translate(0, -4.05, 0);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });

    this.gridLines = new THREE.LineSegments(new THREE.WireframeGeometry(planeGeo), wireMat);
    this.scene.add(this.gridLines);
  }

  private handleResize(): void {
    if (!this.renderer || !this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
    if (!this.isRunning) {
      this.renderFrame(0);
    }
  }

  private start(): void {
    if (this.isRunning || this.isContextLost) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      const time = (performance.now() - this.startTime) / 1000;
      this.update(time);
      this.renderFrame(time);
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  private stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private update(t: number): void {
    if (!this.gridPoints || !this.originalPositions) return;

    const posAttr = this.gridPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
    const len = this.originalPositions.length;
    const velOffset = this.scrollVelocity * 0.001;

    // Subtle breathing wave along coordinates
    for (let i = 0; i < len; i += 3) {
      const origX = this.originalPositions[i];
      const origZ = this.originalPositions[i + 2];

      // Traveling sine wave modulated by noise factor
      const wave = Math.sin(origX * 0.2 + origZ * 0.3 + t * 0.8) * 0.35;
      const noise = (Math.sin(origX * 2.1 + t * 3.0) * 0.15) * this.noiseFactor;

      posAttr.array[i + 1] = -4 + wave + noise + velOffset;
    }
    posAttr.needsUpdate = true;

    // Subtle drift with scroll
    if (this.gridLines) {
      this.gridLines.position.z = (this.scrollProgress * 2) % 4.8;
    }
  }

  private renderFrame(_time: number): void {
    if (!this.renderer || this.isContextLost) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stop();

    this.resizeObserver?.disconnect();
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
        obj.geometry?.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }
  }
}

export default BackgroundCanvas;
