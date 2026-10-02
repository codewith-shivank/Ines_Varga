/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * DistortionPlane — Interactive WebGL plane synchronized with DOM image rects.
 * Real <img> stays in DOM for accessibility, SEO, and fallback.
 * Uses 1:1 pixel coordinate matching with SceneManager camera.
 */

import * as THREE from 'three';
import { SceneObject, sceneManager } from './SceneManager';

export interface DistortionPlaneOptions {
  id: string;
  domElement: HTMLElement;
  textureUrl?: string;
}

export class DistortionPlane {
  public id: string;
  public domElement: HTMLElement;
  public mesh: THREE.Mesh | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private texture: THREE.Texture | null = null;

  // Reusable static vectors to avoid frame loop allocations
  private mouse = new THREE.Vector2(0, 0);
  private targetMouse = new THREE.Vector2(0, 0);

  constructor(options: DistortionPlaneOptions) {
    this.id = options.id;
    this.domElement = options.domElement;
    this.init(options.textureUrl);
  }

  private init(textureUrl?: string): void {
    const rect = this.domElement.getBoundingClientRect();
    const width = rect.width || 320;
    const height = rect.height || 220;

    this.geometry = new THREE.PlaneGeometry(width, height, 16, 16);

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Subtle ripple toward pointer
        float dist = distance(uv, uMouse);
        float wave = sin(dist * 8.0 - uTime * 2.0) * exp(-dist * 3.0) * 8.0;
        pos.z += wave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uHasTexture;
      uniform vec3 uColor;
      uniform vec2 uMouse;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        // Subtle chromatic displacement around pointer
        float dist = distance(uv, uMouse);
        float distortion = sin(dist * 10.0 - uTime * 2.5) * 0.02 * exp(-dist * 4.0);

        vec4 col = vec4(uColor, 0.15);
        if (uHasTexture > 0.5) {
          vec2 displacedUv = uv + vec2(distortion);
          col = texture2D(uTexture, displacedUv);
        }

        gl_FragColor = col;
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: this.mouse },
        uHasTexture: { value: 0 },
        uTexture: { value: null },
        uColor: { value: new THREE.Color(0x6366f1) },
      },
    });

    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(textureUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        this.texture = tex;
        if (this.material) {
          this.material.uniforms.uTexture.value = tex;
          this.material.uniforms.uHasTexture.value = 1.0;
        }
      });
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    const sceneObject: SceneObject = {
      id: this.id,
      group: this.mesh,
      domElement: this.domElement,
      update: (time, delta) => this.update(time, delta),
      dispose: () => this.dispose(),
    };

    sceneManager.registerObject(sceneObject);

    // Pointer move listener on DOM element
    this.domElement.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    this.domElement.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });
  }

  private handlePointerMove = (e: PointerEvent) => {
    const rect = this.domElement.getBoundingClientRect();
    this.targetMouse.x = (e.clientX - rect.left) / rect.width;
    this.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  };

  private handlePointerLeave = () => {
    this.targetMouse.set(0.5, 0.5);
  };

  public update(time: number, _delta: number): void {
    if (!this.material) return;

    this.mouse.lerp(this.targetMouse, 0.08);
    this.material.uniforms.uTime.value = time;
  }

  public dispose(): void {
    this.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.domElement.removeEventListener('pointerleave', this.handlePointerLeave);

    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }
    if (this.material) {
      this.material.dispose();
      this.material = null;
    }
    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }
  }
}
