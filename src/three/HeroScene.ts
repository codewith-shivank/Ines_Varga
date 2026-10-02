/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HeroScene — Framework-agnostic Three.js WebGL sub-scene for the Hero Section.
 * Registers with SceneManager in 1:1 CSS pixel coordinates.
 * Implements Noise-to-Signal crystal coherence, mouse inertia, and resource disposal.
 */

import * as THREE from 'three';
import { globalEmitter } from '../core/EventEmitter';
import { getHardwareTier, HardwareTier, isWebGLSupported, prefersReducedMotion } from '../utils/media';
import { sceneManager, SceneObject } from './SceneManager';

export interface HeroSceneOptions {
  container: HTMLElement;
}

export class HeroScene {
  private container: HTMLElement;
  public rootGroup: THREE.Group = new THREE.Group();

  // Motion & Noise-to-Signal state
  private noiseFactor: number = 1.0;
  private coherenceProgress: number = 0.0;
  private targetMouse = { x: 0, y: 0 };
  private dampedMouse = { x: 0, y: 0 };
  private scrollVelocity: number = 0;

  // Scene Meshes & Materials (Scaled for 1:1 CSS pixel projection)
  private outerMesh: THREE.Mesh | null = null;
  private outerWireframe: THREE.LineSegments | null = null;
  private outerNodes: THREE.Points | null = null;
  private innerCrystal: THREE.Mesh | null = null;
  private particleCloud: THREE.Points | null = null;

  // Particle positions for noise interpolation
  private originalParticlePositions: Float32Array | null = null;
  private noisyParticleOffsets: Float32Array | null = null;

  // Cleanups
  private cleanups: Array<() => void> = [];

  constructor(options: HeroSceneOptions) {
    this.container = options.container;
    this.init();
  }

  private init(): void {
    if (!isWebGLSupported()) return;

    const tier = getHardwareTier();
    if (tier === HardwareTier.LOW) return;

    // 1. Setup local lights inside rootGroup
    this.setupLighting();

    // 2. Build Noise-to-Signal Meshes scaled to pixel coordinate space (~130px radius)
    this.buildSceneObjects(tier);

    // 3. Register as a managed SceneObject with SceneManager
    const sceneObject: SceneObject = {
      id: 'hero-visual-crystal',
      group: this.rootGroup,
      domElement: this.container,
      update: (time, delta) => this.update(time, delta),
      dispose: () => this.dispose(),
    };

    sceneManager.registerObject(sceneObject);

    // 4. Subscriptions
    const unbindNoise = globalEmitter.on('noise:level', (data: { noiseFactor: number }) => {
      this.noiseFactor = data.noiseFactor;
    });

    const unbindScroll = globalEmitter.on('scroll:tick', (data: { velocity: number }) => {
      this.scrollVelocity = data.velocity;
    });

    const unbindAppReady = globalEmitter.on('app:ready', () => {
      this.cohere();
    });

    this.cleanups.push(unbindNoise, unbindScroll, unbindAppReady);

    if (prefersReducedMotion()) {
      this.coherenceProgress = 1.0;
      this.noiseFactor = 0.0;
    }
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.rootGroup.add(ambientLight);

    const keyLight = new THREE.PointLight(0x6366f1, 3.0, 800, 1.8);
    keyLight.position.set(240, 240, 260);
    this.rootGroup.add(keyLight);

    const fillLight = new THREE.PointLight(0x8b5cf6, 2.2, 700, 1.8);
    fillLight.position.set(-240, -180, 200);
    this.rootGroup.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(0, -250, -150);
    this.rootGroup.add(rimLight);
  }

  private buildSceneObjects(tier: HardwareTier): void {
    // --- A. Outer Faceted Polyhedron (Signal Architecture) ---
    // In 1:1 CSS pixel space, radius of 130px matches hero visual card
    const outerGeo = new THREE.IcosahedronGeometry(130, 1);

    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.35,
      flatShading: true,
    });
    this.outerMesh = new THREE.Mesh(outerGeo, outerMat);
    this.rootGroup.add(this.outerMesh);

    // Architectural Wireframe Lattice
    const wireGeo = new THREE.WireframeGeometry(outerGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.45,
    });
    this.outerWireframe = new THREE.LineSegments(wireGeo, wireMat);
    this.outerMesh.add(this.outerWireframe);

    // Vertex Nodes
    const nodeMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 5,
      transparent: true,
      opacity: 0.85,
    });
    this.outerNodes = new THREE.Points(outerGeo, nodeMat);
    this.outerMesh.add(this.outerNodes);

    // --- B. Inner Radiant Core (Coherent Signal) ---
    const innerGeo = new THREE.OctahedronGeometry(62, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8,
      wireframe: false,
    });
    this.innerCrystal = new THREE.Mesh(innerGeo, innerMat);
    this.rootGroup.add(this.innerCrystal);

    // --- C. Telemetry Particle Cloud (Resolved Noise) ---
    const particleCount = tier === HardwareTier.HIGH ? 120 : 60;
    const cloudGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    this.originalParticlePositions = new Float32Array(particleCount * 3);
    this.noisyParticleOffsets = new Float32Array(particleCount * 3);

    const radius = 175;
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * radius;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.originalParticlePositions[i * 3] = x;
      this.originalParticlePositions[i * 3 + 1] = y;
      this.originalParticlePositions[i * 3 + 2] = z;

      this.noisyParticleOffsets[i * 3] = (Math.random() - 0.5) * 85;
      this.noisyParticleOffsets[i * 3 + 1] = (Math.random() - 0.5) * 85;
      this.noisyParticleOffsets[i * 3 + 2] = (Math.random() - 0.5) * 85;
    }

    cloudGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const cloudMat = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 3.5,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    this.particleCloud = new THREE.Points(cloudGeo, cloudMat);
    this.rootGroup.add(this.particleCloud);
  }

  public setPointer(x: number, y: number): void {
    this.targetMouse.x = x * 0.45;
    this.targetMouse.y = y * 0.45;
  }

  public cohere(): void {
    const startTime = performance.now();
    const duration = 1200;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(1.0, elapsed / duration);
      this.coherenceProgress = t * (2 - t); // Ease out
      if (t < 1.0) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  public update(time: number, delta: number): void {
    // 1. Mouse Inertia Interpolation
    this.dampedMouse.x += (this.targetMouse.x - this.dampedMouse.x) * 0.08;
    this.dampedMouse.y += (this.targetMouse.y - this.dampedMouse.y) * 0.08;

    // 2. Base Rotations
    const baseSpeed = 0.35 + Math.abs(this.scrollVelocity) * 0.002;
    this.rootGroup.rotation.y = time * baseSpeed * 0.5 + this.dampedMouse.x;
    this.rootGroup.rotation.x = Math.sin(time * 0.3) * 0.15 + this.dampedMouse.y;

    if (this.innerCrystal) {
      this.innerCrystal.rotation.x = -time * 0.7;
      this.innerCrystal.rotation.y = time * 0.9;
    }

    // 3. Noise-to-Signal Particle Coherence
    if (this.particleCloud && this.originalParticlePositions && this.noisyParticleOffsets) {
      const posAttr = this.particleCloud.geometry.getAttribute('position') as THREE.BufferAttribute;
      const count = posAttr.count;
      const currentNoise = this.noiseFactor * (1.0 - this.coherenceProgress);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = this.originalParticlePositions[i3];
        const oy = this.originalParticlePositions[i3 + 1];
        const oz = this.originalParticlePositions[i3 + 2];

        const nx = this.noisyParticleOffsets[i3] * currentNoise;
        const ny = this.noisyParticleOffsets[i3 + 1] * currentNoise;
        const nz = this.noisyParticleOffsets[i3 + 2] * currentNoise;

        posAttr.setXYZ(i, ox + nx, oy + ny, oz + nz);
      }
      posAttr.needsUpdate = true;
    }
  }

  public dispose(): void {
    sceneManager.unregisterObject('hero-visual-crystal');

    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];

    // Dispose Meshes
    if (this.outerMesh) {
      this.outerMesh.geometry.dispose();
      (this.outerMesh.material as THREE.Material).dispose();
    }
    if (this.outerWireframe) {
      this.outerWireframe.geometry.dispose();
      (this.outerWireframe.material as THREE.Material).dispose();
    }
    if (this.outerNodes) {
      (this.outerNodes.material as THREE.Material).dispose();
    }
    if (this.innerCrystal) {
      this.innerCrystal.geometry.dispose();
      (this.innerCrystal.material as THREE.Material).dispose();
    }
    if (this.particleCloud) {
      this.particleCloud.geometry.dispose();
      (this.particleCloud.material as THREE.Material).dispose();
    }

    this.rootGroup.clear();
  }
}
