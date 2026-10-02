/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SceneManager — Authoritative singleton owning the single WebGLRenderer and fixed canvas.
 * Computes camera fov so 1 world unit = 1 CSS pixel at z = 0.
 * Coordinates HeroScene, background matrix, and DOM-synced DistortionPlanes.
 */

import * as THREE from 'three';
import { globalEmitter } from '../core/EventEmitter';
import {
  getHardwareTier,
  HardwareTier,
  isMobileDevice,
  isWebGLSupported,
  prefersReducedMotion,
} from '../utils/media';

export interface SceneObject {
  id: string;
  group: THREE.Object3D;
  domElement?: HTMLElement | null;
  update?: (time: number, delta: number) => void;
  onResize?: (width: number, height: number) => void;
  dispose?: () => void;
}

export class SceneManager {
  private static instance: SceneManager | null = null;

  public canvas: HTMLCanvasElement | null = null;
  public renderer: THREE.WebGLRenderer | null = null;
  public scene: THREE.Scene = new THREE.Scene();
  public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 3000);

  private objects: Map<string, SceneObject> = new Map();
  private hardwareTier: HardwareTier = 'high';
  private isRunning: boolean = false;
  private isSuspended: boolean = false;
  private isContextLost: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = performance.now();
  private cleanups: Array<() => void> = [];

  // Zero-allocation reusable vectors
  private static readonly V_CENTER = new THREE.Vector3();
  private static readonly REUSABLE_VEC3 = new THREE.Vector3();

  // Camera distance constant to establish 1 unit = 1 CSS pixel ratio at z = 0
  private readonly cameraDistance: number = 1000;

  // Background ambient grid lattice
  private ambientLattice: THREE.Points | null = null;

  private constructor() {
    this.hardwareTier = getHardwareTier();
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  /**
   * Initializes the single WebGL renderer and camera on the fixed canvas.
   */
  public init(canvas: HTMLCanvasElement): boolean {
    if (typeof window === 'undefined') return false;
    this.canvas = canvas;

    // Check hardware tier and WebGL availability
    if (this.hardwareTier === HardwareTier.LOW || prefersReducedMotion() || !isWebGLSupported()) {
      return false;
    }

    try {
      const testGl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
      if (!testGl) return false;
      const ver = (testGl as WebGLRenderingContext).getParameter((testGl as WebGLRenderingContext).VERSION);
      if (!ver || typeof ver !== 'string') return false;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: this.hardwareTier === HardwareTier.HIGH && !isMobileDevice(),
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('SceneManager: WebGLRenderer creation bypassed:', err);
      return false;
    }

    if (!this.renderer) return false;

    // Pixel ratio cap: 2 on desktop, 1.5 on mobile
    const isMobile = isMobileDevice();
    const maxDpr = isMobile ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Configure 1 world unit = 1 CSS pixel camera
    this.updateCameraProjection();

    // Build ambient background substrate grid
    this.buildAmbientSubstrate();

    // Listeners
    const handleResize = () => {
      this.handleResize();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    this.cleanups.push(() => window.removeEventListener('resize', handleResize));

    // Visibility management
    const handleVisibility = () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.isSuspended) {
        this.start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    this.cleanups.push(() => document.removeEventListener('visibilitychange', handleVisibility));

    // Context loss / restore
    const onContextLost = (e: Event) => {
      e.preventDefault();
      this.isContextLost = true;
      this.stop();
    };
    const onContextRestored = () => {
      this.isContextLost = false;
      if (this.canvas) this.init(this.canvas);
      this.start();
    };
    this.canvas.addEventListener('webglcontextlost', onContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', onContextRestored, false);
    this.cleanups.push(() => {
      this.canvas?.removeEventListener('webglcontextlost', onContextLost);
      this.canvas?.removeEventListener('webglcontextrestored', onContextRestored);
    });

    // Lenis Scroll sync
    const unbindScroll = globalEmitter.on('scroll:tick', () => {
      this.syncObjectPositions();
    });
    this.cleanups.push(unbindScroll);

    this.start();
    return true;
  }

  /**
   * Calculates perspective camera FOV so 1 world unit = 1 CSS pixel at z = 0.
   */
  public updateCameraProjection(): void {
    if (typeof window === 'undefined' || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width === 0 || height === 0) return;

    // fov = 2 * Math.atan(height / (2 * distance)) * (180 / Math.PI)
    const vFov = 2 * Math.atan(height / (2 * this.cameraDistance)) * (180 / Math.PI);
    this.camera.fov = vFov;
    this.camera.aspect = width / height;
    this.camera.position.set(0, 0, this.cameraDistance);
    this.camera.lookAt(SceneManager.V_CENTER);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  private buildAmbientSubstrate(): void {
    if (this.hardwareTier === HardwareTier.LOW) return;

    const cols = 28;
    const rows = 18;
    const spacing = 72;
    const count = cols * rows;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    let idx = 0;
    const startX = -((cols - 1) * spacing) / 2;
    const startY = -((rows - 1) * spacing) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        positions[idx * 3] = startX + i * spacing;
        positions[idx * 3 + 1] = startY + j * spacing;
        positions[idx * 3 + 2] = -260; // Behind content planes
        idx++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 2.2,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });

    this.ambientLattice = new THREE.Points(geometry, material);
    this.scene.add(this.ambientLattice);
  }

  public registerObject(item: SceneObject): void {
    this.objects.set(item.id, item);
    this.scene.add(item.group);
    this.syncObjectPositions();
  }

  public unregisterObject(id: string): void {
    const item = this.objects.get(id);
    if (!item) return;

    this.objects.delete(id);
    this.scene.remove(item.group);
    item.dispose?.();
  }

  /**
   * Synchronizes 3D objects with their respective DOM element bounding rects.
   * Maps client bounding box to 1:1 CSS pixel coordinates in 3D space.
   */
  public syncObjectPositions(): void {
    if (typeof window === 'undefined') return;

    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    this.objects.forEach((obj) => {
      if (!obj.domElement) return;

      const rect = obj.domElement.getBoundingClientRect();

      // Convert DOM rect center to WebGL 1:1 pixel coords (center = 0,0)
      const x = rect.left + rect.width / 2 - halfW;
      const y = -(rect.top + rect.height / 2 - halfH);

      obj.group.position.x = x;
      obj.group.position.y = y;

      // Frustum culling: hide objects that are entirely outside the viewport
      const isVisible =
        rect.bottom > -100 &&
        rect.top < window.innerHeight + 100 &&
        rect.right > -100 &&
        rect.left < window.innerWidth + 100;

      obj.group.visible = isVisible;
    });
  }

  private handleResize(): void {
    this.updateCameraProjection();
    this.objects.forEach((obj) => {
      obj.onResize?.(window.innerWidth, window.innerHeight);
    });
    this.syncObjectPositions();
  }

  public start(): void {
    if (this.isRunning || this.isContextLost || !this.renderer) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!this.isRunning) return;

      const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      // Update registered components (e.g. Hero meshes, distortion uniforms)
      this.objects.forEach((obj) => {
        if (obj.group.visible && obj.update) {
          obj.update(currentTime / 1000, delta);
        }
      });

      // Subtle ambient substrate pulse
      if (this.ambientLattice) {
        this.ambientLattice.rotation.z = Math.sin(currentTime * 0.0003) * 0.02;
      }

      this.renderer?.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public getTier(): HardwareTier {
    return this.hardwareTier;
  }

  public isAvailable(): boolean {
    return isWebGLSupported() && this.hardwareTier !== HardwareTier.LOW;
  }

  public destroy(): void {
    this.stop();

    const objectsList = Array.from(this.objects.values());
    this.objects.clear();

    objectsList.forEach((obj) => {
      this.scene.remove(obj.group);
      obj.dispose?.();
    });

    if (this.ambientLattice) {
      this.ambientLattice.geometry.dispose();
      (this.ambientLattice.material as THREE.Material).dispose();
      this.scene.remove(this.ambientLattice);
      this.ambientLattice = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    this.canvas = null;
    SceneManager.instance = null;
  }
}

export const sceneManager = SceneManager.getInstance();
export default sceneManager;
