import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/**
 * CareerUniverse3D
 * An interactive, layered 3D environment for PathFinder.
 *
 * Implements the core concept:
 *   DARK CINEMATIC GRAPHITE ENVIRONMENT (#0B0B0A / #11110F)
 *            ↓
 *   WARM GOLDEN / AMBER LIGHT BEACON (Sunrise / Horizon of Opportunity)
 *            ↓
 *   CENTRAL STARTING PLATFORM & AVATAR ("Where you are today")
 *            ↓
 *   5 BRANCHING 3D CAREER PATHWAYS (With moving energy pulses)
 *            ↓
 *   FLOATING 3D OPPORTUNITY ARTIFACTS (Graduation Cap, Book, Cube, Trophy)
 *            ↓
 *   CONNECTED WAYPOINT NODES (Education, Skills, Exams, Opportunities, Careers)
 *            ↓
 *   ATMOSPHERIC GOLDEN EMBERS & PARTICLES (Subtle, reactive to mouse)
 */
const CareerUniverse3D = ({ activePathway = 'all', onSelectPathway }) => {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion
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
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 650;

    // =========================================================================
    // 1. SCENE & CAMERA SETUP
    // =========================================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b0a);
    scene.fog = new THREE.FogExp2(0x0b0b0a, 0.024);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 120);
    // Camera is positioned elevated behind the central starting platform, looking down the paths toward the horizon
    camera.position.set(0, 3.8, 12.5);
    camera.lookAt(0, 1.2, -10);

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Master groups
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // =========================================================================
    // 2. WARM ATMOSPHERIC LIGHTING (Amber, Gold, Warm Copper)
    // =========================================================================
    // Ambient light - dark warm charcoal/graphite fill
    const ambientLight = new THREE.AmbientLight(0x281f18, 1.4);
    scene.add(ambientLight);

    // Horizon Sun / Beacon Light - warm golden dawn at the horizon
    const horizonLight = new THREE.PointLight(0xffa834, 4.5, 55, 1.2);
    horizonLight.position.set(0, 1.6, -24);
    scene.add(horizonLight);

    const horizonSunCore = new THREE.PointLight(0xffeedd, 2.0, 30, 1.8);
    horizonSunCore.position.set(0, 1.6, -23);
    scene.add(horizonSunCore);

    // Foreground key light for the starting pedestal and avatar
    const originLight = new THREE.PointLight(0xf59e0b, 1.8, 12, 1.4);
    originLight.position.set(0, 2.0, 4.2);
    scene.add(originLight);

    // =========================================================================
    // 3. HORIZON GLOW & RADIANT BEAMS (Volumetric-style warm illumination)
    // =========================================================================
    // Canvas texture for the radiant horizon sun sprite
    const createSunTexture = () => {
      const cv = document.createElement('canvas');
      cv.width = 256;
      cv.height = 256;
      const ctx = cv.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 238, 204, 1)');
      grad.addColorStop(0.2, 'rgba(245, 158, 11, 0.85)');
      grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.35)');
      grad.addColorStop(0.85, 'rgba(180, 83, 9, 0.1)');
      grad.addColorStop(1, 'rgba(11, 11, 10, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(cv);
    };

    const sunSpriteMat = new THREE.SpriteMaterial({
      map: createSunTexture(),
      color: 0xffb74d,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85
    });
    const sunSprite = new THREE.Sprite(sunSpriteMat);
    sunSprite.position.set(0, 1.8, -24);
    sunSprite.scale.set(16, 16, 1);
    worldGroup.add(sunSprite);

    // Upward radiant fan rays at the horizon
    const rayCount = 14;
    const rayGroup = new THREE.Group();
    rayGroup.position.set(0, 1.6, -24);
    worldGroup.add(rayGroup);

    const rayGeom = new THREE.ConeGeometry(1.6, 26, 4, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffa834,
      transparent: true,
      opacity: 0.045,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    for (let i = 0; i < rayCount; i++) {
      const ray = new THREE.Mesh(rayGeom, rayMat);
      const angle = (i / (rayCount - 1) - 0.5) * Math.PI * 0.75;
      ray.rotation.z = angle;
      ray.rotation.x = Math.PI / 2;
      ray.position.y = 10;
      rayGroup.add(ray);
    }

    // =========================================================================
    // 4. REFLECTIVE GROUND GRID RUNWAY
    // =========================================================================
    const gridHelper = new THREE.GridHelper(70, 70, 0x523d24, 0x1f1913);
    gridHelper.position.y = -1.25;
    worldGroup.add(gridHelper);

    // Subtle dark ground floor plane with slight sheen
    const groundGeom = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f0e0c,
      roughness: 0.55,
      metalness: 0.65
    });
    const groundMesh = new THREE.Mesh(groundGeom, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.26;
    worldGroup.add(groundMesh);

    // =========================================================================
    // 5. CENTRAL STARTING PLATFORM & AVATAR ("Where you are today")
    // =========================================================================
    const originGroup = new THREE.Group();
    originGroup.position.set(0, -1.2, 4.0);
    worldGroup.add(originGroup);

    // Multi-tier tiered circular pedestal
    const tier1Geom = new THREE.CylinderGeometry(2.2, 2.5, 0.15, 32);
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x2d251d,
      roughness: 0.35,
      metalness: 0.8
    });
    const tier1 = new THREE.Mesh(tier1Geom, bronzeMat);
    originGroup.add(tier1);

    const tier2Geom = new THREE.CylinderGeometry(1.6, 1.8, 0.18, 32);
    const tier2 = new THREE.Mesh(tier2Geom, bronzeMat);
    tier2.position.y = 0.12;
    originGroup.add(tier2);

    // Glowing amber origin ring
    const ringGeom = new THREE.TorusGeometry(1.65, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.95
    });
    const originRing = new THREE.Mesh(ringGeom, ringMat);
    originRing.rotation.x = Math.PI / 2;
    originRing.position.y = 0.22;
    originGroup.add(originRing);

    // Outward pulsing concentric ripples on the platform
    const rippleCount = 3;
    const ripples = [];
    for (let r = 0; r < rippleCount; r++) {
      const ripGeom = new THREE.RingGeometry(0.2, 0.25, 32);
      const ripMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const rip = new THREE.Mesh(ripGeom, ripMat);
      rip.rotation.x = -Math.PI / 2;
      rip.position.y = 0.23;
      rip.userData = { phase: r * (Math.PI * 2 / rippleCount) };
      originGroup.add(rip);
      ripples.push(rip);
    }

    // Abstract Student Silhouette / Waypoint Beacon
    // Elegant geometric prism representing the human explorer standing at the crossroads
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0.22, 0);
    originGroup.add(avatarGroup);

    // Torso / Monolith
    const avatarBodyGeom = new THREE.CylinderGeometry(0.18, 0.28, 1.25, 6);
    const avatarMat = new THREE.MeshStandardMaterial({
      color: 0x1a1612,
      roughness: 0.2,
      metalness: 0.9
    });
    const avatarBody = new THREE.Mesh(avatarBodyGeom, avatarMat);
    avatarBody.position.y = 0.7;
    avatarGroup.add(avatarBody);

    // Head / Intellect sphere
    const avatarHeadGeom = new THREE.SphereGeometry(0.16, 16, 16);
    const avatarHeadMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.1,
      metalness: 0.8
    });
    const avatarHead = new THREE.Mesh(avatarHeadGeom, avatarHeadMat);
    avatarHead.position.y = 1.45;
    avatarGroup.add(avatarHead);

    // Floating glowing halo above the avatar
    const haloGeom = new THREE.TorusGeometry(0.24, 0.02, 16, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.85
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.72;
    avatarGroup.add(halo);

    // =========================================================================
    // 6. BRANCHING 3D CAREER PATHWAYS (Extruded Curved Tubes with Light Pulses)
    // =========================================================================
    // 5 Distinct Spline Pathways originating from the center (0, -1.0, 4.0) and fanning out
    const pathwayConfigs = [
      {
        id: 'exams',
        name: 'Competitive Exams',
        color: 0xff9900,
        curvePoints: [
          new THREE.Vector3(0, -1.0, 4.0),
          new THREE.Vector3(-2.8, -0.6, 0.5),
          new THREE.Vector3(-6.2, 0.2, -6.0),
          new THREE.Vector3(-9.0, 1.2, -14.0),
          new THREE.Vector3(-11.5, 2.2, -22.0)
        ]
      },
      {
        id: 'education',
        name: 'Higher Education',
        color: 0xf59e0b,
        curvePoints: [
          new THREE.Vector3(0, -1.0, 4.0),
          new THREE.Vector3(-1.4, -0.7, 0.5),
          new THREE.Vector3(-2.8, 0.0, -7.0),
          new THREE.Vector3(-4.0, 1.0, -15.0),
          new THREE.Vector3(-5.2, 1.8, -23.0)
        ]
      },
      {
        id: 'career',
        name: 'Central Career Highway',
        color: 0xffd166,
        curvePoints: [
          new THREE.Vector3(0, -1.0, 4.0),
          new THREE.Vector3(0, -0.75, 1.0),
          new THREE.Vector3(0, -0.2, -7.0),
          new THREE.Vector3(0, 0.8, -15.0),
          new THREE.Vector3(0, 1.6, -24.0)
        ]
      },
      {
        id: 'skills',
        name: 'In-Demand Skills',
        color: 0xf59e0b,
        curvePoints: [
          new THREE.Vector3(0, -1.0, 4.0),
          new THREE.Vector3(1.4, -0.7, 0.5),
          new THREE.Vector3(2.8, 0.0, -7.0),
          new THREE.Vector3(4.0, 1.0, -15.0),
          new THREE.Vector3(5.2, 1.8, -23.0)
        ]
      },
      {
        id: 'opportunities',
        name: 'Global Opportunities',
        color: 0xd97706,
        curvePoints: [
          new THREE.Vector3(0, -1.0, 4.0),
          new THREE.Vector3(2.8, -0.6, 0.5),
          new THREE.Vector3(6.2, 0.2, -6.0),
          new THREE.Vector3(9.0, 1.2, -14.0),
          new THREE.Vector3(11.5, 2.2, -22.0)
        ]
      }
    ];

    const pathwayCurves = [];
    const energyPulses = [];
    const waypointNodes = [];

    pathwayConfigs.forEach((cfg) => {
      const curve = new THREE.CatmullRomCurve3(cfg.curvePoints);
      pathwayCurves.push(curve);

      // Solid translucent pathway ribbon tube
      const tubeGeom = new THREE.TubeGeometry(curve, 72, 0.075, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.25,
        metalness: 0.7,
        transparent: true,
        opacity: 0.65
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      worldGroup.add(tubeMesh);

      // Glowing outer halo tube for visual depth
      const haloTubeGeom = new THREE.TubeGeometry(curve, 72, 0.16, 8, false);
      const haloTubeMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
      });
      const haloTubeMesh = new THREE.Mesh(haloTubeGeom, haloTubeMat);
      worldGroup.add(haloTubeMesh);

      // 4 Animated light pulses traveling along each path
      for (let p = 0; p < 3; p++) {
        const pulseGeom = new THREE.SphereGeometry(0.14, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending
        });
        const pulse = new THREE.Mesh(pulseGeom, pulseMat);
        pulse.userData = {
          curve,
          progress: (p / 3) + Math.random() * 0.1,
          speed: 0.065 + Math.random() * 0.03
        };
        worldGroup.add(pulse);
        energyPulses.push(pulse);
      }

      // Waypoint Nodes along the curve (at progress 0.35, 0.7, and 1.0)
      [0.35, 0.7, 1.0].forEach((t, idx) => {
        const point = curve.getPointAt(t);

        const nodeSphereGeom = new THREE.SphereGeometry(0.22, 16, 16);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.2,
          metalness: 0.85
        });
        const nodeMesh = new THREE.Mesh(nodeSphereGeom, nodeMat);
        nodeMesh.position.copy(point);

        // Surrounding orbital halo ring
        const nodeHaloGeom = new THREE.TorusGeometry(0.38, 0.02, 12, 32);
        const nodeHaloMat = new THREE.MeshBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        });
        const nodeHalo = new THREE.Mesh(nodeHaloGeom, nodeHaloMat);
        nodeHalo.rotation.x = Math.PI / 2;
        nodeMesh.add(nodeHalo);

        nodeMesh.userData = {
          halo: nodeHalo,
          pathId: cfg.id,
          name: cfg.name,
          stage: idx + 1,
          baseY: point.y
        };

        worldGroup.add(nodeMesh);
        waypointNodes.push(nodeMesh);
      });
    });

    // Inter-pathway network connection filaments
    const filamentGeom = new THREE.BufferGeometry();
    const filamentPositions = [];
    for (let i = 0; i < waypointNodes.length; i++) {
      for (let j = i + 1; j < waypointNodes.length; j++) {
        const dist = waypointNodes[i].position.distanceTo(waypointNodes[j].position);
        if (dist > 2.0 && dist < 6.8) {
          filamentPositions.push(
            waypointNodes[i].position.x, waypointNodes[i].position.y, waypointNodes[i].position.z,
            waypointNodes[j].position.x, waypointNodes[j].position.y, waypointNodes[j].position.z
          );
        }
      }
    }
    filamentGeom.setAttribute('position', new THREE.Float32BufferAttribute(filamentPositions, 3));
    const filamentMat = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending
    });
    const filamentLines = new THREE.LineSegments(filamentGeom, filamentMat);
    worldGroup.add(filamentLines);

    // =========================================================================
    // 7. FLOATING 3D OPPORTUNITY ARTIFACTS
    // =========================================================================
    const floatingObjects = [];

    // Artifact 1: Academic Mortarboard / Graduation Cap
    const capGroup = new THREE.Group();
    capGroup.position.set(-3.2, 1.4, -4.5);
    worldGroup.add(capGroup);

    // Diamond board
    const capBoardGeom = new THREE.BoxGeometry(0.85, 0.05, 0.85);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.4,
      metalness: 0.7
    });
    const capBoard = new THREE.Mesh(capBoardGeom, capMat);
    capBoard.rotation.y = Math.PI / 4;
    capGroup.add(capBoard);

    // Skull skull cap underside
    const capSkullGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.25, 16);
    const capSkull = new THREE.Mesh(capSkullGeom, capMat);
    capSkull.position.y = -0.15;
    capGroup.add(capSkull);

    // Golden tassel button and cord
    const tasselBtnGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2
    });
    const tasselBtn = new THREE.Mesh(tasselBtnGeom, goldMat);
    tasselBtn.position.y = 0.05;
    capGroup.add(tasselBtn);

    capGroup.userData = {
      baseY: 1.4,
      rotSpeed: 0.4,
      floatSpeed: 0.9,
      phase: 0.2
    };
    floatingObjects.push(capGroup);

    // Artifact 2: Open Book of Knowledge
    const bookGroup = new THREE.Group();
    bookGroup.position.set(3.5, 1.6, -5.0);
    worldGroup.add(bookGroup);

    // Left page
    const pageGeom = new THREE.BoxGeometry(0.5, 0.04, 0.65);
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.3
    });
    const leftPage = new THREE.Mesh(pageGeom, pageMat);
    leftPage.position.set(-0.24, 0, 0);
    leftPage.rotation.z = 0.25;
    bookGroup.add(leftPage);

    // Right page
    const rightPage = new THREE.Mesh(pageGeom, pageMat);
    rightPage.position.set(0.24, 0, 0);
    rightPage.rotation.z = -0.25;
    bookGroup.add(rightPage);

    // Book spine / cover
    const spineGeom = new THREE.BoxGeometry(0.12, 0.06, 0.68);
    const spine = new THREE.Mesh(spineGeom, bronzeMat);
    spine.position.y = -0.06;
    bookGroup.add(spine);

    bookGroup.userData = {
      baseY: 1.6,
      rotSpeed: 0.35,
      floatSpeed: 0.8,
      phase: 1.5
    };
    floatingObjects.push(bookGroup);

    // Artifact 3: Opportunity Data Cube (Faceted Glass / Copper)
    const cubeGroup = new THREE.Group();
    cubeGroup.position.set(-5.5, 2.2, -10.0);
    worldGroup.add(cubeGroup);

    const cubeGeom = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const cubeWireMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true
    });
    const cubeWire = new THREE.Mesh(cubeGeom, cubeWireMat);
    cubeGroup.add(cubeWire);

    const innerCubeGeom = new THREE.OctahedronGeometry(0.3, 0);
    const innerCubeMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.85
    });
    const innerCube = new THREE.Mesh(innerCubeGeom, innerCubeMat);
    cubeGroup.add(innerCube);

    cubeGroup.userData = {
      baseY: 2.2,
      rotSpeed: 0.6,
      floatSpeed: 1.1,
      phase: 2.8
    };
    floatingObjects.push(cubeGroup);

    // Artifact 4: Milestone Trophy / Compass Prism
    const compassGroup = new THREE.Group();
    compassGroup.position.set(5.2, 2.0, -10.5);
    worldGroup.add(compassGroup);

    const prismGeom = new THREE.ConeGeometry(0.4, 0.8, 4);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25
    });
    const prism = new THREE.Mesh(prismGeom, prismMat);
    prism.rotation.x = Math.PI;
    compassGroup.add(prism);

    const ringBeaconGeom = new THREE.TorusGeometry(0.5, 0.02, 8, 32);
    const ringBeacon = new THREE.Mesh(ringBeaconGeom, ringMat);
    ringBeacon.rotation.x = Math.PI / 2;
    compassGroup.add(ringBeacon);

    compassGroup.userData = {
      baseY: 2.0,
      rotSpeed: 0.5,
      floatSpeed: 0.95,
      phase: 4.1
    };
    floatingObjects.push(compassGroup);

    // =========================================================================
    // 8. ATMOSPHERIC GOLDEN EMBERS & PARTICLES
    // =========================================================================
    const particleCount = 180;
    const particleGeom = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 32;
      particleCoords[i + 1] = -1.0 + Math.random() * 8.5;
      particleCoords[i + 2] = -22 + Math.random() * 26;

      particleVelocities.push({
        vx: (Math.random() - 0.5) * 0.005,
        vy: 0.008 + Math.random() * 0.012,
        vz: (Math.random() - 0.5) * 0.005
      });
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));

    // Particle sprite texture with soft circle
    const createParticleTexture = () => {
      const cv = document.createElement('canvas');
      cv.width = 64;
      cv.height = 64;
      const ctx = cv.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 238, 204, 1)');
      grad.addColorStop(0.4, 'rgba(245, 158, 11, 0.8)');
      grad.addColorStop(0.8, 'rgba(180, 83, 9, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(cv);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      map: createParticleTexture(),
      color: 0xffcc66,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    const particleField = new THREE.Points(particleGeom, particleMat);
    worldGroup.add(particleField);

    // =========================================================================
    // 9. INTERACTIVITY & PARALLAX
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 1.6;
      targetY = y * 0.9;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 10. ANIMATION TICK LOOP
    // =========================================================================
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      camera.position.x = mouseX * 2.2;
      camera.position.y = 3.8 + mouseY * 1.2;
      camera.lookAt(mouseX * 0.4, 1.2, -10);

      // Horizon beacon gentle breathing
      const sunPulse = 1.0 + Math.sin(elapsedTime * 1.6) * 0.08;
      sunSprite.scale.set(16 * sunPulse, 16 * sunPulse, 1);
      rayGroup.rotation.z = Math.sin(elapsedTime * 0.25) * 0.04;

      // Platform ripples expanding
      ripples.forEach((rip) => {
        const progress = ((elapsedTime * 0.6 + rip.userData.phase) % (Math.PI * 2)) / (Math.PI * 2);
        const currentScale = 0.5 + progress * 5.0;
        rip.scale.set(currentScale, currentScale, 1);
        rip.material.opacity = (1 - progress) * 0.55;
      });

      // Halo above avatar rotating
      halo.rotation.z = elapsedTime * 0.8;

      // Energy pulses traveling along career paths
      energyPulses.forEach((pulse) => {
        const { curve, speed } = pulse.userData;
        pulse.userData.progress = (pulse.userData.progress + speed * 0.016) % 1.0;
        const pt = curve.getPointAt(pulse.userData.progress);
        pulse.position.copy(pt);
      });

      // Waypoint nodes halo rotation & float
      waypointNodes.forEach((node) => {
        const { halo, baseY, stage } = node.userData;
        halo.rotation.z = elapsedTime * 0.9;
        node.position.y = baseY + Math.sin(elapsedTime * 1.4 + stage) * 0.06;
      });

      // Floating 3D opportunity artifacts
      floatingObjects.forEach((obj) => {
        const { baseY, rotSpeed, floatSpeed, phase } = obj.userData;
        obj.position.y = baseY + Math.sin(elapsedTime * floatSpeed + phase) * 0.16;
        obj.rotation.y = elapsedTime * rotSpeed;
        obj.rotation.x = Math.sin(elapsedTime * 0.5 + phase) * 0.1;
      });

      // Golden embers drifting upward
      const positions = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const vel = particleVelocities[i];

        positions[idx] += vel.vx + Math.sin(elapsedTime + i) * 0.002;
        positions[idx + 1] += vel.vy;
        positions[idx + 2] += vel.vz;

        // Reset if drifted too high
        if (positions[idx + 1] > 8.0) {
          positions[idx + 1] = -1.0;
          positions[idx] = (Math.random() - 0.5) * 30;
          positions[idx + 2] = -22 + Math.random() * 26;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  if (!hasWebGL || prefersReducedMotion) {
    // Elegant warm cinematic 2D fallback
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0b0b0a] flex items-center justify-center overflow-hidden">
        {/* Horizon Warm Golden Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-amber-600/30 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0b0b0a]/70 to-[#0b0b0a] pointer-events-none" />
        {/* Subtle geometric horizon lines */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0b0b0a] to-transparent border-b border-amber-900/30" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Career Universe: Branching Pathways and Golden Horizon"
    />
  );
};

export default CareerUniverse3D;
