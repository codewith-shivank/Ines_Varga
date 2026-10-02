/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PostProcessing — Framework-agnostic Three.js fullscreen optical shader pass.
 * Renders the Noise-to-Signal telemetry grain, chromatic micro-dispersion, and subtle
 * optical vignette that dynamically reacts to scroll velocity and system noise levels.
 */

import * as THREE from 'three';
import { globalEmitter } from '../core/EventEmitter';
import { getHardwareTier, HardwareTier, isMobileDevice, isWebGLSupported, prefersReducedMotion } from '../utils/media';

export interface PostProcessingOptions {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
}

export class PostProcessing {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  private isRunning: boolean = false;
  private isContextLost: boolean = false;
  private rafId: number | null = null;
  private startTime: number = performance.now();

  // State
  private noiseFactor: number = 0.0;
  private scrollVelocity: number = 0;
  private currentDispersion: number = 0;

  // Shader Quad
  private quadMesh: THREE.Mesh | null = null;
  private customMaterial: THREE.ShaderMaterial | null = null;

  // Observers & Cleanups
  private resizeObserver: ResizeObserver | null = null;
  private cleanups: Array<() => void> = [];

  constructor(options: PostProcessingOptions) {
    this.container = options.container;
    this.canvas = options.canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.init();
  }

  private init(): void {
    const isMobile = isMobileDevice();
    const tier = getHardwareTier();

    // Low hardware tiers or reduced motion bypass the shader pass for maximum performance
    if (tier === HardwareTier.LOW || prefersReducedMotion() || !isWebGLSupported(this.canvas)) {
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
      console.warn('PostProcessing WebGL init failed:', e);
      return;
    }

    if (!this.renderer) return;

    // Fixed 1.0 DPR for postprocessing pass prevents resolution overhead
    this.renderer.setPixelRatio(1.0);

    // Build Post-Processing Shader Quad
    this.buildShaderPass();

    // Resize
    this.handleResize();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    // Visibility Handling
    const handleVisibility = () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    this.cleanups.push(() => document.removeEventListener('visibilitychange', handleVisibility));

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

    // Subscriptions
    const unbindNoise = globalEmitter.on('noise:level', (data: { noiseFactor: number }) => {
      this.noiseFactor = data.noiseFactor;
    });

    const unbindScroll = globalEmitter.on('scroll:tick', (data: { velocity: number }) => {
      this.scrollVelocity = Math.abs(data.velocity);
    });

    this.cleanups.push(unbindNoise, unbindScroll);

    this.start();
  }

  private buildShaderPass(): void {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uNoise;
      uniform float uDispersion;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Pseudo-random noise function
      float hash(vec2 p) {
        vec3 p3  = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      void main() {
        vec2 uv = vUv;

        // Subtle Optical Vignette
        vec2 coord = (uv - 0.5) * 2.0;
        float dist = dot(coord, coord);
        float vignette = smoothstep(1.8, 0.4, dist);

        // Procedural Grain scaled by noise and velocity
        float grain = (hash(uv * uResolution + fract(uTime * 43.12)) - 0.5) * 0.08 * (uNoise * 0.8 + 0.2);

        // Subtle chromatic edge shift during high velocity
        float chroma = uDispersion * 0.003 * dist;

        vec3 col = vec3(0.0);
        col.r += chroma * 0.4 + grain;
        col.g += grain * 0.8;
        col.b += chroma * 0.8 + grain * 1.2;

        // Indigo/Cyan electric tinting on the noise grain
        col += vec3(0.04, 0.06, 0.12) * (1.0 - vignette) * 0.2;

        // Transparent alpha: only luminous particles and edges show
        float alpha = clamp(length(col) * 0.35 * vignette, 0.0, 0.14);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    this.customMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uNoise: { value: 0 },
        uDispersion: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const quadGeo = new THREE.PlaneGeometry(2, 2);
    this.quadMesh = new THREE.Mesh(quadGeo, this.customMaterial);
    this.scene.add(this.quadMesh);
  }

  private handleResize(): void {
    if (!this.renderer || !this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    if (width === 0 || height === 0) return;

    this.renderer.setSize(width, height, false);
    if (this.customMaterial) {
      this.customMaterial.uniforms.uResolution.value.set(width, height);
    }
  }

  private start(): void {
    if (this.isRunning || this.isContextLost) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      const time = (performance.now() - this.startTime) / 1000;
      this.update(time);
      this.renderFrame();
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
    if (!this.customMaterial) return;

    // Smooth dispersion interpolation
    const targetDispersion = Math.min(1.0, this.scrollVelocity * 0.005 + this.noiseFactor * 0.4);
    this.currentDispersion += (targetDispersion - this.currentDispersion) * 0.1;

    this.customMaterial.uniforms.uTime.value = t;
    this.customMaterial.uniforms.uNoise.value = this.noiseFactor;
    this.customMaterial.uniforms.uDispersion.value = this.currentDispersion;
  }

  private renderFrame(): void {
    if (!this.renderer || this.isContextLost) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stop();

    this.resizeObserver?.disconnect();
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];

    if (this.quadMesh) {
      this.quadMesh.geometry.dispose();
      if (this.quadMesh.material instanceof THREE.Material) {
        this.quadMesh.material.dispose();
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }
  }
}

export default PostProcessing;
