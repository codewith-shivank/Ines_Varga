/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FloatingObjects — Framework-agnostic Three.js interactive architectural polyhedra.
 * Visualizes the 3 engineering pillars: Frontend UI, Distributed Services, and Data Systems.
 * Implements high-mass physics, pointer magnetism, IntersectionObserver offscreen pausing,
 * WebGL context loss recovery, and rigorous resource disposal.
 */

import * as THREE from 'three';
import { globalEmitter } from '../core/EventEmitter';
import { getHardwareTier, HardwareTier, isMobileDevice, isWebGLSupported, prefersReducedMotion } from '../utils/media';

export interface FloatingObjectsOptions {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
}

export class FloatingObjects {
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

  // Physics & Pointer state
  private targetPointer = { x: 0, y: 0 };
  private dampedPointer = { x: 0, y: 0 };
  private scrollVelocity: number = 0;
  private activeCategory: string = 'All';

  // Floating Prisms
  private group: THREE.Group = new THREE.Group();
  private prismFrontend: THREE.Mesh | null = null;
  private prismBackend: THREE.Mesh | null = null;
  private prismData: THREE.Mesh | null = null;

  // Observers & Cleanups
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private cleanups: Array<() => void> = [];

  constructor(options: FloatingObjectsOptions) {
    this.container = options.container;
    this.canvas = options.canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    this.camera.position.set(0, 0, 14);

    this.init();
  }

  private init(): void {
    const isMobile = isMobileDevice();
    const tier = getHardwareTier();

    // Guard: Verify WebGL and shader precision before instantiating renderer
    if (!isWebGLSupported(this.canvas)) {
      throw new Error('WebGL or shader precision unavailable on target canvas');
    }

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: tier !== HardwareTier.LOW && !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('FloatingObjects WebGL init failed:', e);
      throw e;
    }

    const maxDpr = isMobile ? 1.0 : tier === HardwareTier.HIGH ? 1.5 : 1.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.setupLighting();
    this.buildPrisms();

    // Sizing
    this.handleResize();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    // Pause offscreen
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.isRunning) {
            this.start();
          } else if (!this.isVisible && this.isRunning) {
            this.stop();
          }
        });
      },
      { threshold: 0.05 }
    );
    this.intersectionObserver.observe(this.container);

    // Context Loss Handlers
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

    // Scroll reactivity
    const unbindScroll = globalEmitter.on('scroll:tick', (data: { velocity: number }) => {
      this.scrollVelocity = data.velocity;
    });
    this.cleanups.push(unbindScroll);

    // Reduced motion
    if (prefersReducedMotion()) {
      this.renderFrame(0);
    } else {
      this.start();
    }
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x6366f1, 2.8, 25, 2);
    keyLight.position.set(6, 6, 8);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xa855f7, 2.0, 20, 2);
    rimLight.position.set(-6, -4, 6);
    this.scene.add(rimLight);
  }

  private buildPrisms(): void {
    this.scene.add(this.group);

    // 1. Frontend Prism (Torus Knot / Dynamic Ring)
    const frontGeo = new THREE.TorusGeometry(1.6, 0.35, 16, 32);
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true,
    });
    this.prismFrontend = new THREE.Mesh(frontGeo, frontMat);
    this.prismFrontend.position.set(-3.2, 0.4, 0);

    const frontWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(frontGeo),
      new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.4 })
    );
    this.prismFrontend.add(frontWire);
    this.group.add(this.prismFrontend);

    // 2. Distributed Backend Prism (Octahedron Lattice)
    const backGeo = new THREE.OctahedronGeometry(1.8, 0);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.15,
      metalness: 0.9,
      flatShading: true,
    });
    this.prismBackend = new THREE.Mesh(backGeo, backMat);
    this.prismBackend.position.set(0, -0.2, 0.5);

    const backWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(backGeo),
      new THREE.LineBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.6 })
    );
    this.prismBackend.add(backWire);
    this.group.add(this.prismBackend);

    // 3. Datastore Prism (Icosahedron Crystal)
    const dataGeo = new THREE.IcosahedronGeometry(1.7, 0);
    const dataMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.25,
      metalness: 0.8,
      flatShading: true,
    });
    this.prismData = new THREE.Mesh(dataGeo, dataMat);
    this.prismData.position.set(3.2, 0.3, -0.2);

    const dataWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(dataGeo),
      new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.4 })
    );
    this.prismData.add(dataWire);
    this.group.add(this.prismData);
  }

  public setPointer(normalizedX: number, normalizedY: number): void {
    this.targetPointer.x = normalizedX;
    this.targetPointer.y = normalizedY;
  }

  public setCategory(category: string): void {
    this.activeCategory = category;
  }

  private handleResize(): void {
    if (!this.renderer || !this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 260;

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
    // High-mass pointer interpolation
    this.dampedPointer.x += (this.targetPointer.x - this.dampedPointer.x) * 0.05;
    this.dampedPointer.y += (this.targetPointer.y - this.dampedPointer.y) * 0.05;

    // Group parallax
    this.group.rotation.y = this.dampedPointer.x * 0.25;
    this.group.rotation.x = -this.dampedPointer.y * 0.15;
    this.group.rotation.z = this.scrollVelocity * 0.0002;

    // Animate Frontend Prism
    if (this.prismFrontend) {
      this.prismFrontend.rotation.x = t * 0.4;
      this.prismFrontend.rotation.y = t * 0.3;
      this.prismFrontend.position.y = 0.4 + Math.sin(t * 1.5) * 0.15;

      const isFocused = this.activeCategory === 'Frontend' || this.activeCategory === 'All';
      const targetScale = isFocused ? 1.0 : 0.82;
      this.prismFrontend.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }

    // Animate Backend Prism
    if (this.prismBackend) {
      this.prismBackend.rotation.y = -t * 0.5;
      this.prismBackend.rotation.z = t * 0.25;
      this.prismBackend.position.y = -0.2 + Math.sin(t * 1.5 + 1.2) * 0.15;

      const isFocused = this.activeCategory === 'Backend' || this.activeCategory === 'All';
      const targetScale = isFocused ? 1.05 : 0.82;
      this.prismBackend.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }

    // Animate Data Prism
    if (this.prismData) {
      this.prismData.rotation.x = -t * 0.3;
      this.prismData.rotation.y = t * 0.45;
      this.prismData.position.y = 0.3 + Math.sin(t * 1.5 + 2.4) * 0.15;

      const isFocused = this.activeCategory === 'Databases & Cloud' || this.activeCategory === 'All';
      const targetScale = isFocused ? 1.0 : 0.82;
      this.prismData.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }
  }

  private renderFrame(_time: number): void {
    if (!this.renderer || this.isContextLost) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stop();

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
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

export default FloatingObjects;
