/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LEGACY ARCHIVE: Hero3D component originally written using @react-three/fiber.
 * Replaced in Phase 5 with native Three.js HeroScene class to eliminate R3F reconciler
 * overhead and ensure strict lifecycle/memory disposal.
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TechSphereProps {
  mouseX: number;
  mouseY: number;
}

const TechSphere: React.FC<TechSphereProps> = ({ mouseX, mouseY }) => {
  const { scene } = useThree();
  const startTimeRef = useRef(performance.now());
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const innerMeshRef = useRef<THREE.Mesh | null>(null);
  const particleRef = useRef<THREE.Points | null>(null);

  const particlePositions = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 28;
      positions[i + 1] = (Math.random() - 0.5) * 28;
      positions[i + 2] = (Math.random() - 0.5) * 28;
    }
    return positions;
  }, []);

  useEffect(() => {
    const mainGroup = new THREE.Group();
    mainGroupRef.current = mainGroup;
    scene.add(mainGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 1.4, 0, 1.5);
    pointLight1.position.set(8, 8, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa78bfa, 0.8, 0, 2);
    pointLight2.position.set(-8, -4, 6);
    scene.add(pointLight2);

    // Outer wireframe shell
    const outerGeo = new THREE.IcosahedronGeometry(4.6, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    // Vertex points
    const pointsMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    const pointsMesh = new THREE.Points(outerGeo, pointsMat);
    mainGroup.add(pointsMesh);

    // Inner polyhedron
    const innerGeo = new THREE.OctahedronGeometry(2.4, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMeshRef.current = innerMesh;
    mainGroup.add(innerMesh);

    // Inner wireframe
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerWire = new THREE.Mesh(innerGeo, innerWireMat);
    innerMesh.add(innerWire);

    // Floating particles
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particleRef.current = particles;
    mainGroup.add(particles);

    return () => {
      scene.remove(mainGroup);
      outerGeo.dispose();
      outerMat.dispose();
      pointsMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      innerWireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [scene, particlePositions]);

  useFrame(() => {
    const t = (performance.now() - startTimeRef.current) / 1000;
    const mainGroup = mainGroupRef.current;

    if (mainGroup) {
      mainGroup.rotation.y = t * 0.08 + mouseX * 0.25;
      mainGroup.rotation.x = t * 0.04 - mouseY * 0.2;
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y = -t * 0.22;
      innerMeshRef.current.rotation.z = t * 0.12;
    }

    if (particleRef.current) {
      particleRef.current.rotation.y = t * 0.02;
    }
  });

  return null;
};

export const Hero3DLegacy: React.FC = () => {
  const mousePos = useRef({ x: 0, y: 0 });
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mousePos.current = { x, y };
    setPos({ x, y });
  };

  return (
    <div
      className="relative w-full h-full min-h-[320px] lg:min-h-[420px] flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-violet-500/8 dark:bg-violet-500/10 blur-3xl pointer-events-none translate-x-12 -translate-y-8" />

      <Canvas
        camera={{ position: [0, 0, 18], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', minHeight: '320px' }}
      >
        <TechSphere mouseX={pos.x} mouseY={pos.y} />
      </Canvas>
    </div>
  );
};
