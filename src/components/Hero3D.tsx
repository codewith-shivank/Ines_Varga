/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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

    // Inner core
    const innerGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMeshRef.current = innerMesh;
    mainGroup.add(innerMesh);

    // Orbital ring 1
    const ring1Geo = new THREE.TorusGeometry(5.8, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.2 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    mainGroup.add(ring1);

    // Orbital ring 2
    const ring2Geo = new THREE.TorusGeometry(6.8, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.12 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    mainGroup.add(ring2);

    // Orbital ring 3
    const ring3Geo = new THREE.TorusGeometry(5.0, 0.012, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.14 });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 2;
    ring3.rotation.y = Math.PI / 3;
    mainGroup.add(ring3);

    // Ambient particles
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.07,
      transparent: true,
      opacity: 0.4,
    });
    const ambientParticles = new THREE.Points(particleGeo, particleMat);
    particleRef.current = ambientParticles;
    scene.add(ambientParticles);

    return () => {
      scene.remove(mainGroup);
      scene.remove(ambientParticles);
      scene.remove(ambientLight);
      scene.remove(pointLight1);
      scene.remove(pointLight2);
      outerGeo.dispose();
      outerMat.dispose();
      pointsMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
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

export const Hero3D: React.FC = () => {
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
      {/* Ambient glow */}
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-violet-500/8 dark:bg-violet-500/10 blur-3xl pointer-events-none translate-x-12 -translate-y-8" />

      {/* Canvas */}
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
