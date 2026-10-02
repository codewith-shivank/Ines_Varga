/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ParticleSystem — GPU particle system for subtle ambient floating telemetry particles.
 * Conforms to target structure, utilizes custom GLSL shaders, adjusts density to hardware tier,
 * and handles strict WebGL resource disposal.
 */

import * as THREE from 'three';
import { getHardwareTier, HardwareTier, isWebGLSupported } from '../utils/media';

export interface ParticleSystemOptions {
  scene: THREE.Scene;
  count?: number;
}

export class ParticleSystem {
  private scene: THREE.Scene;
  private points: THREE.Points | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private geometry: THREE.BufferGeometry | null = null;

  constructor(options: ParticleSystemOptions) {
    this.scene = options.scene;
    this.init(options.count);
  }

  private init(customCount?: number): void {
    const tier = getHardwareTier();
    if (tier === HardwareTier.LOW) return;

    const count = customCount || (tier === HardwareTier.HIGH ? 400 : 150);

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      scales[i] = Math.random() * 0.8 + 0.2;
      phases[i] = Math.random();
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const vertexShader = `
      uniform float uTime;
      uniform float uScrollVelocity;
      attribute float aScale;
      attribute float aPhase;
      varying float vPhase;
      varying float vAlpha;

      void main() {
        vPhase = aPhase;
        vec3 pos = position;

        pos.y += sin(uTime * 0.8 + aPhase * 6.28) * 0.2;
        pos.x += cos(uTime * 0.5 + aPhase * 3.14) * 0.15;
        pos.z += uScrollVelocity * 0.001 * sin(aPhase * 3.14);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = (aScale * 14.0 / -mvPosition.z);
        vAlpha = smoothstep(20.0, 5.0, -mvPosition.z) * 0.6;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor;
      varying float vPhase;
      varying float vAlpha;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float strength = pow(1.0 - (dist * 2.0), 2.0);
        vec3 col = uColor + vec3(0.1, 0.15, 0.3) * sin(vPhase * 3.14);

        gl_FragColor = vec4(col, strength * vAlpha);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uColor: { value: new THREE.Color(0x6366f1) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  public update(time: number, velocity: number = 0): void {
    if (!this.material) return;
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uScrollVelocity.value = velocity;
  }

  public dispose(): void {
    if (this.points && this.scene) {
      this.scene.remove(this.points);
    }
    this.geometry?.dispose();
    this.material?.dispose();
    this.points = null;
    this.geometry = null;
    this.material = null;
  }
}

export default ParticleSystem;
