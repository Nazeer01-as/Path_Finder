import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const HeroScene3D = () => {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let animationFrameId;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all celestial network elements
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // 1. Core Milestone Nodes (Career pathway nodes)
    const nodeCount = 38;
    const nodeGeom = new THREE.SphereGeometry(0.22, 16, 16);
    const colorPalette = [0x6366f1, 0x06b6d4, 0x8b5cf6, 0x10b981, 0xf59e0b];

    const nodes = [];
    const nodePositions = [];

    for (let i = 0; i < nodeCount; i++) {
      const color = colorPalette[i % colorPalette.length];
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(nodeGeom, mat);

      // Distribute in a spherical orbit
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 6.5 + (Math.random() - 0.5) * 2.5;

      mesh.position.x = radius * Math.cos(theta) * Math.sin(phi);
      mesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
      mesh.position.z = radius * Math.cos(phi);

      mesh.userData = {
        origX: mesh.position.x,
        origY: mesh.position.y,
        origZ: mesh.position.z,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      };

      networkGroup.add(mesh);
      nodes.push(mesh);
      nodePositions.push(mesh.position);
    }

    // 2. Connecting Lines (Constellation Pathway)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.22
    });

    const linePositions = [];
    const maxDistance = 4.2;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    networkGroup.add(lineMesh);

    // 3. Ambient Stardust Particles
    const starCount = 120;
    const starGeom = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 26;
      starCoords[i + 1] = (Math.random() - 0.5) * 26;
      starCoords[i + 2] = (Math.random() - 0.5) * 26;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 2.5;
      targetY = -y * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      networkGroup.rotation.y = elapsedTime * 0.08 + mouseX * 0.5;
      networkGroup.rotation.x = elapsedTime * 0.04 + mouseY * 0.4;
      starField.rotation.y = elapsedTime * 0.02;

      // Subtle node pulsation
      nodes.forEach((node) => {
        const { origX, origY, origZ, speed, phase } = node.userData;
        const offset = Math.sin(elapsedTime * speed + phase) * 0.15;
        node.position.x = origX + offset;
        node.position.y = origY + offset;
        node.position.z = origZ + offset;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      nodeGeom.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      starGeom.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  if (!hasWebGL || prefersReducedMotion) {
    // Elegant 2D Fallback
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border border-indigo-400/30 rounded-full animate-spin-slow" />
          <div className="absolute w-36 h-36 border border-cyan-400/40 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[380px] sm:min-h-[460px] relative pointer-events-auto cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Career Opportunity Constellation"
    />
  );
};

export default HeroScene3D;
