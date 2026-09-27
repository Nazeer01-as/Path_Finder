import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ContextualCanvas3D
 * Lightweight, subtle contextual 3D backdrop for secondary pages:
 * - 'opportunities': Subtle network of golden opportunity nodes
 * - 'careers': Branching career trajectory filaments
 * - 'courses': Floating geometric knowledge blocks
 * - 'exams': Milestone progress beacons
 * - 'scholarships': Floating golden growth nodes
 * - 'default': Ambient warm golden embers & subtle horizon haze
 */
const ContextualCanvas3D = ({ type = 'default', className = '' }) => {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const container = containerRef.current;
    if (!container) return;

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
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0a, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Warm ambient lighting
    const amb = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(amb);

    const pt = new THREE.PointLight(0xf59e0b, 2.0, 20);
    pt.position.set(2, 2, 4);
    scene.add(pt);

    // Contextual Elements by Page Type
    const animObjects = [];

    if (type === 'opportunities') {
      // Network of golden opportunity nodes
      const nodeCount = 12;
      const geom = new THREE.SphereGeometry(0.18, 12, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2
      });

      const positions = [];
      for (let i = 0; i < nodeCount; i++) {
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4
        );
        mesh.userData = { speed: 0.3 + Math.random() * 0.4, phase: Math.random() * Math.PI };
        group.add(mesh);
        animObjects.push(mesh);
        positions.push(mesh.position);
      }

      // Connecting lines
      const lineGeom = new THREE.BufferGeometry();
      const linePos = [];
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          if (positions[i].distanceTo(positions[j]) < 4.2) {
            linePos.push(
              positions[i].x, positions[i].y, positions[i].z,
              positions[j].x, positions[j].y, positions[j].z
            );
          }
        }
      }
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xd97706,
        transparent: true,
        opacity: 0.2
      });
      group.add(new THREE.LineSegments(lineGeom, lineMat));

    } else if (type === 'careers') {
      // Branching career trajectory filaments
      for (let b = 0; b < 4; b++) {
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(-4, -2 + b * 0.5, 0),
          new THREE.Vector3(-1, 0, (b - 2) * 1.5),
          new THREE.Vector3(4, 1.5 + (b - 1.5) * 1.2, (b - 2) * 2)
        );
        const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.04, 6, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.55
        });
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        group.add(tube);
      }

    } else if (type === 'courses') {
      // Floating geometric knowledge cubes
      for (let k = 0; k < 6; k++) {
        const cubeGeom = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const cubeMat = new THREE.MeshStandardMaterial({
          color: 0x292524,
          metalness: 0.8,
          roughness: 0.3
        });
        const cube = new THREE.Mesh(cubeGeom, cubeMat);
        cube.position.set((k - 2.5) * 1.8, Math.sin(k) * 1.2, (k % 2) * 2 - 1);
        cube.userData = { speed: 0.4 + k * 0.1, phase: k };
        group.add(cube);
        animObjects.push(cube);
      }

    } else {
      // Subtle floating warm embers
      const emberCount = 36;
      const emberGeom = new THREE.BufferGeometry();
      const coords = new Float32Array(emberCount * 3);
      for (let i = 0; i < emberCount * 3; i += 3) {
        coords[i] = (Math.random() - 0.5) * 12;
        coords[i + 1] = (Math.random() - 0.5) * 6;
        coords[i + 2] = (Math.random() - 0.5) * 6;
      }
      emberGeom.setAttribute('position', new THREE.BufferAttribute(coords, 3));
      const emberMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.6
      });
      const embers = new THREE.Points(emberGeom, emberMat);
      group.add(embers);
      animObjects.push(embers);
    }

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      group.rotation.y = elapsed * 0.05;
      group.rotation.x = Math.sin(elapsed * 0.03) * 0.08;

      animObjects.forEach((obj) => {
        if (obj.userData?.speed) {
          obj.position.y += Math.sin(elapsed * obj.userData.speed + obj.userData.phase) * 0.003;
          obj.rotation.y = elapsed * 0.2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [type]);

  if (!hasWebGL) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden opacity-40 ${className}`}
      aria-hidden="true"
    />
  );
};

export default ContextualCanvas3D;
