import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Flame,
  Zap,
  Eye,
  Thermometer,
  Radio,
  Layers,
  ShieldCheck,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Crosshair,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Move
} from 'lucide-react';

export default function RobotArmSimulator3D({
  isSafeToCut = true,
  oppositeSideTemp = 28,
  oppositeSideGasPPM = 8
}) {
  const mountRef = useRef(null);

  // States
  const [thermalMode, setThermalMode] = useState(false);
  const [targetStandoff, setTargetStandoff] = useState(3.5); // Target mm
  const [manualZOffset, setManualZOffset] = useState(0); // manual adjust offset
  const [currentDistanceMM, setCurrentDistanceMM] = useState(14.8); // live distance readout
  const [cuttingPhase, setCuttingPhase] = useState('CALIBRATING'); // 'MOVING' | 'CALIBRATING' | 'LOCKED' | 'CUTTING' | 'PAUSED'
  const [cutProgress, setCutProgress] = useState(32);
  const [autoTracking, setAutoTracking] = useState(true);
  const [crawlerSpeed, setCrawlerSpeed] = useState(1.0);

  // Live state refs for Three.js render loop
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const reqIdRef = useRef(null);
  const isSafeRef = useRef(isSafeToCut);
  const thermalModeRef = useRef(false);
  const cuttingPhaseRef = useRef('CALIBRATING');
  const targetStandoffRef = useRef(3.5);
  const manualZOffsetRef = useRef(0);
  const autoTrackingRef = useRef(true);

  // 3D Model object references
  const modelsRef = useRef({});

  useEffect(() => {
    isSafeRef.current = isSafeToCut;
    if (!isSafeToCut && cuttingPhaseRef.current === 'CUTTING') {
      cuttingPhaseRef.current = 'PAUSED';
      setCuttingPhase('PAUSED');
    }
  }, [isSafeToCut]);

  useEffect(() => {
    thermalModeRef.current = thermalMode;
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(thermalMode ? 0x050114 : 0x08090c);
      sceneRef.current.fog.color = new THREE.Color(thermalMode ? 0x050114 : 0x08090c);
    }
  }, [thermalMode]);

  useEffect(() => {
    targetStandoffRef.current = targetStandoff;
  }, [targetStandoff]);

  useEffect(() => {
    manualZOffsetRef.current = manualZOffset;
  }, [manualZOffset]);

  useEffect(() => {
    cuttingPhaseRef.current = cuttingPhase;
  }, [cuttingPhase]);

  useEffect(() => {
    autoTrackingRef.current = autoTracking;
  }, [autoTracking]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090c);
    scene.fog = new THREE.FogExp2(0x08090c, 0.03);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(5.2, 4.0, 5.8);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff1e0, 1.4);
    sunLight.position.set(6, 12, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    blueRimLight.position.set(-6, 4, -5);
    scene.add(blueRimLight);

    // Plasma Torch Arc Point Light
    const torchLight = new THREE.PointLight(0x00ffff, 0, 4);
    torchLight.position.set(0, 0.2, 0);
    scene.add(torchLight);

    // 3. Rusted Steel Ship Hull Plate (The Workpiece)
    const plateWidth = 9;
    const plateDepth = 7;
    const plateGeo = new THREE.BoxGeometry(plateWidth, 0.2, plateDepth);

    // Procedural rusted metal canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2b231d'; // dark rust
    ctx.fillRect(0, 0, 512, 512);
    // Add rust speckles & corrosion stains
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const colorNoise = Math.random();
      ctx.fillStyle = colorNoise > 0.6 ? '#6e3a1d' : colorNoise > 0.3 ? '#422415' : '#1e1c1b';
      ctx.fillRect(rx, ry, Math.random() * 4 + 1, Math.random() * 4 + 1);
    }
    const rustTexture = new THREE.CanvasTexture(canvas);
    rustTexture.wrapS = THREE.RepeatWrapping;
    rustTexture.wrapT = THREE.RepeatWrapping;
    rustTexture.repeat.set(4, 3);

    const plateMat = new THREE.MeshStandardMaterial({
      map: rustTexture,
      roughness: 0.85,
      metalness: 0.35,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, -0.1, 0);
    plate.receiveShadow = true;
    scene.add(plate);

    // Structural steel bulkheads beneath
    const ribGeo = new THREE.BoxGeometry(0.12, 0.6, plateDepth);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x16181d, metalness: 0.8 });
    for (let x = -3.5; x <= 3.5; x += 1.75) {
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(x, -0.5, 0);
      scene.add(rib);
    }

    // -------------------------------------------------------------
    // CUT MARKS & SEAMS SYSTEM (Active Cut Marks + Completed Cuts)
    // -------------------------------------------------------------
    // 1. Completed Transverse Cut #1 (Severed slot across plate at z = -1.6)
    const compCutGeo = new THREE.PlaneGeometry(5.4, 0.09);
    const compCutMat = new THREE.MeshBasicMaterial({ color: 0x050608 }); // deep through-cut gap
    const compCutLine = new THREE.Mesh(compCutGeo, compCutMat);
    compCutLine.rotation.x = -Math.PI / 2;
    compCutLine.position.set(0, 0.007, -1.6);
    scene.add(compCutLine);

    // Heat-affected zone border on completed cut
    const compHazGeo = new THREE.PlaneGeometry(5.4, 0.26);
    const compHazMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.8 });
    const compHaz = new THREE.Mesh(compHazGeo, compHazMat);
    compHaz.rotation.x = -Math.PI / 2;
    compHaz.position.set(0, 0.005, -1.6);
    scene.add(compHaz);

    // 2. Active Longitudinal Seam Guide Line (Target trajectory to cut)
    const seamGeo = new THREE.PlaneGeometry(0.03, 4.6);
    const seamMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const seamLine = new THREE.Mesh(seamGeo, seamMat);
    seamLine.rotation.x = -Math.PI / 2;
    seamLine.position.set(0.65, 0.004, 0);
    scene.add(seamLine);

    // Station stationing tick marks along active seam (0.5m, 1.0m, etc.)
    for (let z = -2.0; z <= 2.0; z += 0.8) {
      const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.015), new THREE.MeshBasicMaterial({ color: 0x64748b }));
      tick.rotation.x = -Math.PI / 2;
      tick.position.set(0.65, 0.005, z);
      scene.add(tick);
    }

    // 3. Active Severed Cut Groove (Permanently carved kerf extending behind the nozzle)
    const cutStartPosZ = -2.0;
    const cutMaxLenZ = 4.0;
    const activeCutSlotGeo = new THREE.PlaneGeometry(0.08, cutMaxLenZ);
    const activeCutSlotMat = new THREE.MeshBasicMaterial({ color: 0x040507 }); // jet black through-cut slit
    const activeCutSlot = new THREE.Mesh(activeCutSlotGeo, activeCutSlotMat);
    activeCutSlot.rotation.x = -Math.PI / 2;
    activeCutSlot.position.set(0.65, 0.006, cutStartPosZ);
    scene.add(activeCutSlot);

    // Heat Affected Zone (HAZ) along active cut
    const activeHazGeo = new THREE.PlaneGeometry(0.24, cutMaxLenZ);
    const activeHazMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b, transparent: true, opacity: 0.8 }); // dark blue/amber heat tint
    const activeHaz = new THREE.Mesh(activeHazGeo, activeHazMat);
    activeHaz.rotation.x = -Math.PI / 2;
    activeHaz.position.set(0.65, 0.005, cutStartPosZ);
    scene.add(activeHaz);

    // 4. Molten Glowing Kerf Tip (trailing 0.6m immediately behind the active cutting nozzle)
    const moltenKerfGeo = new THREE.PlaneGeometry(0.12, 0.75);
    const moltenKerfMat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.95,
    });
    const moltenKerf = new THREE.Mesh(moltenKerfGeo, moltenKerfMat);
    moltenKerf.rotation.x = -Math.PI / 2;
    moltenKerf.position.set(0.65, 0.009, cutStartPosZ);
    scene.add(moltenKerf);

    // -------------------------------------------------------------
    // 4. KRAN-VULCAN ROBOT CONSTRUCTION (Matching User's Image 1)
    // -------------------------------------------------------------
    const kranVulcanGroup = new THREE.Group();
    scene.add(kranVulcanGroup);

    // A. Rugged Aluminum Chassis
    const chassisWidth = 1.35;
    const chassisHeight = 0.58;
    const chassisLength = 1.95;
    const chassisGeo = new THREE.BoxGeometry(chassisWidth, chassisHeight, chassisLength);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x8a929a, // Rugged anodized aluminum
      metalness: 0.82,
      roughness: 0.28,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.position.y = 0.48;
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    kranVulcanGroup.add(chassisMesh);

    // Chamfered front slope plate
    const slopeGeo = new THREE.BoxGeometry(chassisWidth - 0.04, 0.35, 0.45);
    const slopeMesh = new THREE.Mesh(slopeGeo, chassisMat);
    slopeMesh.rotation.x = 0.52;
    slopeMesh.position.set(0, 0.55, 0.88);
    kranVulcanGroup.add(slopeMesh);

    // B. Dual Continuous Rubber Tracks with Embedded Neodymium Pot Magnets
    const trackWidth = 0.32;
    const trackHeight = 0.52;
    const trackLength = 2.15;
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1f2124, // High-grip tough rubber
      roughness: 0.92,
      metalness: 0.1,
    });
    const magnetMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // Shiny silver neodymium magnets
      metalness: 0.95,
      roughness: 0.15,
    });

    // Left Track Assembly
    const leftTrackGroup = new THREE.Group();
    leftTrackGroup.position.set(-0.84, 0.28, 0);
    const leftTrackBody = new THREE.Mesh(new THREE.BoxGeometry(trackWidth, trackHeight, trackLength), trackMat);
    leftTrackBody.castShadow = true;
    leftTrackGroup.add(leftTrackBody);

    // Right Track Assembly
    const rightTrackGroup = new THREE.Group();
    rightTrackGroup.position.set(0.84, 0.28, 0);
    const rightTrackBody = new THREE.Mesh(new THREE.BoxGeometry(trackWidth, trackHeight, trackLength), trackMat);
    rightTrackBody.castShadow = true;
    rightTrackGroup.add(rightTrackBody);

    // Add Embedded Neodymium Pot Magnet Studs on treads
    for (let z = -0.9; z <= 0.9; z += 0.28) {
      const magL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), magnetMat);
      magL.position.set(0, -trackHeight / 2 - 0.005, z);
      leftTrackGroup.add(magL);

      const magR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), magnetMat);
      magR.position.set(0, -trackHeight / 2 - 0.005, z);
      rightTrackGroup.add(magR);
    }
    kranVulcanGroup.add(leftTrackGroup, rightTrackGroup);

    // C. Heat-Shielded Electronics Bay (Transparent Acrylic Cover with Raspberry Pi 5 & ESP32)
    const bayCoverGeo = new THREE.BoxGeometry(0.92, 0.18, 0.95);
    const bayCoverMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      thickness: 0.2,
    });
    const bayCover = new THREE.Mesh(bayCoverGeo, bayCoverMat);
    bayCover.position.set(0, 0.82, -0.28);
    kranVulcanGroup.add(bayCover);

    // Raspberry Pi 5 Green PCB
    const pcbGeo = new THREE.BoxGeometry(0.55, 0.02, 0.42);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }); // Green solder mask
    const rpiPcb = new THREE.Mesh(pcbGeo, pcbMat);
    rpiPcb.position.set(-0.12, 0.75, -0.28);
    kranVulcanGroup.add(rpiPcb);

    // Silver heatsinks & processor
    const cpuGeo = new THREE.BoxGeometry(0.15, 0.05, 0.15);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0xc4b5fd, metalness: 0.9 });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(-0.12, 0.78, -0.28);
    kranVulcanGroup.add(cpuMesh);

    // ESP32 Microcontroller Module
    const espGeo = new THREE.BoxGeometry(0.24, 0.02, 0.32);
    const espMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const espMesh = new THREE.Mesh(espGeo, espMat);
    espMesh.position.set(0.25, 0.75, -0.28);
    kranVulcanGroup.add(espMesh);

    // Blinking status LEDs on circuit board
    const ledGeo = new THREE.BoxGeometry(0.02, 0.02, 0.02);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const statusLed = new THREE.Mesh(ledGeo, ledMat);
    statusLed.position.set(0.28, 0.78, -0.18);
    kranVulcanGroup.add(statusLed);

    // D. Front Bumper Gas Sensors Cluster (3 Cylindrical Sensor Pods)
    const gasSensorGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.26, 16);
    const gasSensorMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.8,
      roughness: 0.3,
    });
    const meshFilterMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      wireframe: true,
    });

    const gasSensorsGroup = new THREE.Group();
    gasSensorsGroup.position.set(0, 0.32, 1.05);

    [-0.26, 0, 0.26].forEach((xOffset) => {
      const pod = new THREE.Mesh(gasSensorGeo, gasSensorMat);
      pod.rotation.x = Math.PI / 2;
      pod.position.set(xOffset, 0, 0);

      const filterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.06, 12), meshFilterMat);
      filterCap.rotation.x = Math.PI / 2;
      filterCap.position.set(xOffset, 0, 0.14);

      gasSensorsGroup.add(pod, filterCap);
    });
    kranVulcanGroup.add(gasSensorsGroup);

    // E. OAK-D Lite Stereo / Thermal Camera Unit
    const oakGeo = new THREE.BoxGeometry(0.32, 0.12, 0.14);
    const oakMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
    const oakMesh = new THREE.Mesh(oakGeo, oakMat);
    oakMesh.position.set(0, 0.65, 0.98);

    // Stereo Dual Lenses
    const lensGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 14);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const lensL = new THREE.Mesh(lensGeo, lensMat);
    lensL.rotation.x = Math.PI / 2;
    lensL.position.set(-0.11, 0.65, 1.06);
    const lensR = new THREE.Mesh(lensGeo, lensMat);
    lensR.rotation.x = Math.PI / 2;
    lensR.position.set(0.11, 0.65, 1.06);
    kranVulcanGroup.add(oakMesh, lensL, lensR);

    // -------------------------------------------------------------
    // 5. ARTICULATED ROBOTIC ARM WITH THERMAL TORCH & ULTRASONIC SENSOR
    // (Matching User's Image 1, 2, and 3)
    // -------------------------------------------------------------
    const armGroup = new THREE.Group();
    armGroup.position.set(-0.25, 0.78, 0.42);
    kranVulcanGroup.add(armGroup);

    // Turret Rotary Base
    const armMetalMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Industrial silver / slate
      metalness: 0.85,
      roughness: 0.25,
    });
    const jointAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark joint rings
      metalness: 0.9,
    });

    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.18, 20), jointAccentMat);
    armGroup.add(turret);

    // Shoulder Joint
    const shoulder = new THREE.Group();
    shoulder.position.set(0, 0.12, 0);
    armGroup.add(shoulder);

    // Upper Arm Main Boom
    const upperBoom = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.05, 0.18), armMetalMat);
    upperBoom.position.set(0, 0.52, 0);
    upperBoom.castShadow = true;
    shoulder.add(upperBoom);

    // Hydraulic cylinder strut (along upper arm)
    const cylinderTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12), jointAccentMat);
    cylinderTube.position.set(0.12, 0.48, 0.08);
    shoulder.add(cylinderTube);

    // Elbow Joint
    const elbow = new THREE.Group();
    elbow.position.set(0, 1.02, 0);
    shoulder.add(elbow);

    // Forearm Boom
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.92, 0.15), armMetalMat);
    forearm.position.set(0, 0.46, 0);
    forearm.castShadow = true;
    elbow.add(forearm);

    // F. Mica Heat Shield (Translucent golden mica protective shield as in Image 1)
    const micaGeo = new THREE.PlaneGeometry(0.38, 0.85);
    const micaMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b, // Amber / mica gold
      transparent: true,
      opacity: 0.65,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });
    const micaShield = new THREE.Mesh(micaGeo, micaMat);
    micaShield.position.set(-0.16, 0.45, 0.02);
    micaShield.rotation.y = Math.PI / 4;
    forearm.add(micaShield);

    // Wrist Articulation
    const wrist = new THREE.Group();
    wrist.position.set(0, 0.92, 0);
    elbow.add(wrist);

    // Tool Carriage Bracket (Supports Torch and Ultrasonic Sensor)
    const carriageGeo = new THREE.BoxGeometry(0.24, 0.35, 0.22);
    const carriageMesh = new THREE.Mesh(carriageGeo, jointAccentMat);
    carriageMesh.position.set(0, -0.15, 0);
    wrist.add(carriageMesh);

    // G. Hypertherm Cutting Torch Body (Black barrel with brass/copper conical tip)
    const torchBodyGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.55, 16);
    const torchBodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Black torch body
      roughness: 0.4,
    });
    const torchBody = new THREE.Mesh(torchBodyGeo, torchBodyMat);
    torchBody.position.set(0, -0.45, 0);
    wrist.add(torchBody);

    // Copper Conical Nozzle Tip (The cutting flame orifice)
    const nozzleTipGeo = new THREE.ConeGeometry(0.068, 0.22, 18);
    const nozzleTipMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Polished copper
      metalness: 0.95,
      roughness: 0.15,
    });
    const nozzleTip = new THREE.Mesh(nozzleTipGeo, nozzleTipMat);
    nozzleTip.rotation.x = Math.PI; // point downwards towards plate
    nozzleTip.position.set(0, -0.78, 0);
    wrist.add(nozzleTip);

    // Plasma / Laser Arc Flame Beam
    const arcGeo = new THREE.CylinderGeometry(0.015, 0.038, 0.55, 14);
    const arcMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.92,
    });
    const arcBeam = new THREE.Mesh(arcGeo, arcMat);
    arcBeam.position.set(0, -1.02, 0);
    arcBeam.visible = false;
    wrist.add(arcBeam);

    // -------------------------------------------------------------
    // H. ULTRASONIC SENSOR UNIT & HEIGHT PROBE (Matching User's Image 3)
    // -------------------------------------------------------------
    const ultrasonicBracket = new THREE.Group();
    ultrasonicBracket.position.set(0.18, -0.45, 0);
    wrist.add(ultrasonicBracket);

    // Ultrasonic Transducer Dual Cylinders (Echo Transmitter & Receiver)
    const transducerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 14);
    const transducerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sky blue ultrasonic housing
      metalness: 0.85,
      roughness: 0.25,
    });
    const sonarTx = new THREE.Mesh(transducerGeo, transducerMat);
    sonarTx.position.set(0, 0, -0.06);
    const sonarRx = new THREE.Mesh(transducerGeo, transducerMat);
    sonarRx.position.set(0, 0, 0.06);
    ultrasonicBracket.add(sonarTx, sonarRx);

    // Dynamic Ultrasonic Sound Wave Echo Rings (Pulsing downward to the plate)
    const waveRingGeo = new THREE.RingGeometry(0.05, 0.18, 24);
    const waveRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const waveRing1 = new THREE.Mesh(waveRingGeo, waveRingMat);
    waveRing1.rotation.x = Math.PI / 2;
    waveRing1.position.set(0, -0.15, 0);
    ultrasonicBracket.add(waveRing1);

    const waveRing2 = new THREE.Mesh(waveRingGeo, waveRingMat.clone());
    waveRing2.rotation.x = Math.PI / 2;
    waveRing2.position.set(0, -0.32, 0);
    ultrasonicBracket.add(waveRing2);

    // Height Guide Arrows (Visual double-headed red/green calibration indicator in 3D)
    const arrowGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const heightArrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    heightArrowMesh.position.set(-0.18, -0.58, 0);
    wrist.add(heightArrowMesh);

    // -------------------------------------------------------------
    // 6. SPARK PARTICLES EMITTER (Molten steel splatter)
    // -------------------------------------------------------------
    const sparkCount = 90;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = 0.02;
      sparkPositions[i * 3 + 2] = 0;
      sparkVelocities.push({
        vx: (Math.random() - 0.5) * 0.12,
        vy: Math.random() * 0.15 + 0.05,
        vz: (Math.random() - 0.5) * 0.12,
        life: Math.random(),
      });
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

    const sparkMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.065,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // Save references to models for animate loop
    modelsRef.current = {
      kranVulcanGroup,
      armGroup,
      shoulder,
      elbow,
      wrist,
      arcBeam,
      torchLight,
      waveRing1,
      waveRing2,
      heightArrowMesh,
      activeCutSlot,
      activeHaz,
      moltenKerf,
      cutStartPosZ,
      cutMaxLenZ,
      sparkParticles,
      sparkPositions,
      sparkVelocities,
    };

    // -------------------------------------------------------------
    // 7. Interactive Orbit Controls (Mouse Drag & Zoom)
    // -------------------------------------------------------------
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngleTheta = 0.78;
    let cameraAnglePhi = 0.55;
    let cameraRadius = 8.5;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraAngleTheta -= dx * 0.007;
      cameraAnglePhi = Math.max(0.12, Math.min(Math.PI / 2.1, cameraAnglePhi - dy * 0.007));

      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraRadius = Math.max(4.0, Math.min(14.0, cameraRadius + e.deltaY * 0.008));
      updateCameraPosition();
    };

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAnglePhi) * Math.sin(cameraAngleTheta);
      camera.position.y = cameraRadius * Math.cos(cameraAnglePhi);
      camera.position.z = cameraRadius * Math.sin(cameraAnglePhi) * Math.cos(cameraAngleTheta);
      camera.lookAt(0, 0.7, 0);
    };
    updateCameraPosition();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // -------------------------------------------------------------
    // 8. Animation & Kinematics Loop
    // -------------------------------------------------------------
    let animClock = 0;
    let currentZPos = 0;
    let currentCutProgress = 32;

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      animClock += 0.025;

      const phase = cuttingPhaseRef.current;
      const isSafe = isSafeRef.current;
      const target = targetStandoffRef.current;
      const manualOffset = manualZOffsetRef.current;
      const autoTrack = autoTrackingRef.current;

      // Pulse ultrasonic wave rings
      if (waveRing1 && waveRing2) {
        waveRing1.scale.setScalar(1 + (Math.sin(animClock * 6) + 1) * 0.4);
        waveRing2.scale.setScalar(1 + (Math.sin(animClock * 6 + 1.5) + 1) * 0.5);
      }

      // Crawler chassis position along cut seam
      if (phase === 'CUTTING' && isSafe) {
        currentCutProgress = (currentCutProgress + 0.04) % 100;
        setCutProgress(Math.round(currentCutProgress));
        currentZPos = (currentCutProgress / 100) * 3.5 - 1.75;
        kranVulcanGroup.position.z = currentZPos;
      }

      // Calculate Real-Time Ultrasonic Standoff Distance
      // Baseline height is governed by arm joint angles + manual adjustment offset
      let simulatedDistance = 0;

      if (phase === 'MOVING') {
        // High clearance travel mode
        shoulder.rotation.z = -0.45;
        elbow.rotation.z = 0.65;
        wrist.rotation.z = -0.2;
        simulatedDistance = 16.5 + Math.sin(animClock * 2) * 1.5;
        arcBeam.visible = false;
        torchLight.intensity = 0;
        heightArrowMesh.material.color.setHex(0xeab308); // Yellow searching
      } else if (phase === 'CALIBRATING') {
        // Lowering towards target standoff
        const calibProgress = (Math.sin(animClock * 1.5) + 1) / 2; // oscillates or converges
        simulatedDistance = target + (1 - calibProgress) * 6.0 + manualOffset;

        // Kinematics solver for arm
        const normHeight = (simulatedDistance - target) * 0.04;
        shoulder.rotation.z = -0.15 - normHeight;
        elbow.rotation.z = 0.35 + normHeight;
        wrist.rotation.z = -0.2;

        arcBeam.visible = false;
        torchLight.intensity = 0;

        // Check if optimal standoff reached
        if (Math.abs(simulatedDistance - target) < 0.25) {
          heightArrowMesh.material.color.setHex(0x22c55e); // Green locked
        } else {
          heightArrowMesh.material.color.setHex(0x38bdf8); // Cyan adjusting
        }
      } else if (phase === 'LOCKED' || (phase === 'CUTTING' && isSafe)) {
        // Standoff locked at exact target (with tiny dynamic surface micro-variation)
        const microRoughness = Math.sin(animClock * 4) * 0.08;
        simulatedDistance = target + manualOffset + (autoTrack ? 0 : microRoughness);

        // Position nozzle precisely at standoff
        shoulder.rotation.z = -0.12 + manualOffset * 0.05;
        elbow.rotation.z = 0.32 - manualOffset * 0.05;
        wrist.rotation.z = -0.2;

        heightArrowMesh.material.color.setHex(0x22c55e); // Green locked

        // Plasma Arc & Sparks in CUTTING phase
        if (phase === 'CUTTING') {
          arcBeam.visible = true;
          // Update dynamic physical cut mark on the ship plate
          if (activeCutSlot && moltenKerf) {
            const cutFraction = Math.max(0.02, Math.min(1, currentCutProgress / 100));
            const currentLen = cutFraction * cutMaxLenZ;
            const currentCenterZ = cutStartPosZ + currentLen / 2;

            // Expand the permanent severed slot up to the current nozzle position!
            activeCutSlot.scale.set(1, cutFraction, 1);
            activeCutSlot.position.z = currentCenterZ;

            activeHaz.scale.set(1, cutFraction, 1);
            activeHaz.position.z = currentCenterZ;

            // Position molten hot incandescent tip immediately behind active torch nozzle
            moltenKerf.visible = true;
            moltenKerf.position.z = currentZPos - 0.22;
            moltenKerf.material.color.setHex(Math.sin(animClock * 20) > 0 ? 0xff4500 : 0xffa500);
          }

          // Particle Sparks update
          const pos = sparkGeo.attributes.position.array;
          const torchWorldPos = new THREE.Vector3();
          nozzleTip.getWorldPosition(torchWorldPos);

          for (let i = 0; i < sparkCount; i++) {
            const vel = sparkVelocities[i];
            vel.life -= 0.035;

            if (vel.life <= 0) {
              pos[i * 3] = torchWorldPos.x;
              pos[i * 3 + 1] = 0.05;
              pos[i * 3 + 2] = torchWorldPos.z;
              vel.vx = (Math.random() - 0.5) * 0.14;
              vel.vy = Math.random() * 0.14 + 0.06;
              vel.vz = (Math.random() - 0.5) * 0.14;
              vel.life = 1.0;
            } else {
              pos[i * 3] += vel.vx;
              pos[i * 3 + 1] += vel.vy;
              pos[i * 3 + 2] += vel.vz;
              vel.vy -= 0.009; // Gravity on molten iron sparks
            }
          }
          sparkGeo.attributes.position.needsUpdate = true;
        } else {
          arcBeam.visible = false;
          torchLight.intensity = 0;
        }
      } else {
        // PAUSED / INHIBITED
        arcBeam.visible = false;
        torchLight.intensity = 0;
        simulatedDistance = target + 4.5;
        heightArrowMesh.material.color.setHex(0xef4444); // Red warning
      }

      // Update React Distance State (throttled)
      if (Math.round(animClock * 30) % 3 === 0) {
        setCurrentDistanceMM(parseFloat(simulatedDistance.toFixed(2)));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handler Actions
  const handleStartCalibrateAndCut = () => {
    setCuttingPhase('CALIBRATING');
    setTimeout(() => {
      setCuttingPhase('LOCKED');
      setTimeout(() => {
        setCuttingPhase('CUTTING');
      }, 1000);
    }, 1500);
  };

  const isLocked = Math.abs(currentDistanceMM - targetStandoff) <= 0.3;

  return (
    <div className="card-surface border border-dark-border bg-dark-card rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="p-4 bg-neutral-900/90 border-b border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-mono text-xs">
              KRAN-VULCAN 3D
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Magnetic Track Crawler & Ultrasonic Torch Height Control (THC)
            </h3>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Real-time ultrasonic sensor measures distance between cutting nozzle and ship steel plate before ignition.
          </p>
        </div>

        {/* View & Cut Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
              thermalMode
                ? 'bg-rose-950 text-rose-300 border-rose-700 shadow-glow-sm'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{thermalMode ? 'FLIR Thermal IR Active' : 'Normal Vision'}</span>
          </button>

          {cuttingPhase === 'CUTTING' ? (
            <button
              onClick={() => setCuttingPhase('PAUSED')}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-mono text-amber-400 border-amber-800"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Cut</span>
            </button>
          ) : (
            <button
              onClick={handleStartCalibrateAndCut}
              disabled={!isSafeToCut}
              className={`btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 font-mono ${
                !isSafeToCut ? 'opacity-50 cursor-not-allowed bg-neutral-800 text-neutral-500' : ''
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Calibrate Standoff & Start Cut</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas Mount Viewport */}
      <div className="relative w-full h-[470px] bg-black cursor-grab active:cursor-grabbing select-none">
        <div ref={mountRef} className="w-full h-full" />

        {/* ULTRASONIC DISTANCE SENSOR HUD (Top Left Overlay) */}
        <div className="absolute top-4 left-4 p-4 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-700 text-xs font-mono space-y-3 pointer-events-none max-w-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-[11px] uppercase text-cyan-400 font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>ULTRASONIC STANDOFF PROBE</span>
            </span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                isLocked
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {isLocked ? 'TARGET LOCKED' : 'ADJUSTING HEIGHT'}
            </span>
          </div>

          {/* Big Digital Distance Readout */}
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-400">NOZZLE-TO-PLATE DISTANCE:</div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-black font-mono tracking-tight ${
                  isLocked ? 'text-emerald-400' : 'text-cyan-300'
                }`}
              >
                {currentDistanceMM.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-neutral-300">mm</span>
              <span className="text-[11px] text-neutral-400 ml-auto">
                (Target: {targetStandoff} mm)
              </span>
            </div>
          </div>

          {/* Distance Tolerance Status Meter */}
          <div className="space-y-1">
            <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800 flex">
              <div
                className={`h-full transition-all duration-300 ${
                  isLocked ? 'bg-emerald-400' : 'bg-cyan-400'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(10, (currentDistanceMM / 15) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>0 mm (Contact)</span>
              <span>3.5 mm (Optimal)</span>
              <span>15 mm (Clearance)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-400 space-y-1">
            <div className="flex justify-between">
              <span>Cutting Phase:</span>
              <span className="text-white font-bold">{cuttingPhase}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-Height Tracking:</span>
              <span className={autoTracking ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
                {autoTracking ? 'ACTIVE (±0.05 mm)' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Opposite-Side Safety Clearance Signal & Cut Marks Telemetry (Top Right Overlay) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 max-w-xs pointer-events-none">
          <div className="p-3 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-700 flex items-center gap-3 shadow-2xl">
            <div
              className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                isSafeToCut ? 'bg-emerald-400 animate-ping' : 'bg-red-400 animate-bounce'
              }`}
            />
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">SAFETY SIGNAL</span>
              <span
                className={`text-xs font-mono font-bold ${
                  isSafeToCut ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isSafeToCut ? 'SIGNAL GREEN: SAFE TO CUT' : 'SIGNAL RED: GAS/TEMP INHIBIT'}
              </span>
            </div>
          </div>

          {/* Dedicated Cut Marking & Indian Metallurgy HUD Card */}
          <div className="p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-700 text-xs font-mono space-y-1.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
              <span className="text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>CUT SEAM MARKING (LIVE)</span>
              </span>
              <span className="badge bg-amber-950 text-amber-300 border border-amber-800 text-[9px]">
                HMS-1 (28mm)
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-300">
              <span className="text-neutral-400">Material Grade:</span>
              <span className="text-white font-bold">IS 2062 E250 (IRS AH36)</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-300">
              <span className="text-neutral-400">Distance Marked:</span>
              <span className="text-cyan-400 font-bold">{(cutProgress * 0.045).toFixed(2)} m / 4.50 m</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-300">
              <span className="text-neutral-400">Kerf Cut Depth:</span>
              <span className="text-emerald-400 font-bold">28 mm (Through-Cut)</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-300 pt-1 border-t border-neutral-800">
              <span className="text-neutral-400">Recovered Scrap:</span>
              <span className="text-emerald-400 font-bold font-mono">
                ₹{Math.round(cutProgress * 1650).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[9px] text-neutral-500 text-right">
              @ ₹38,500/MT (Alang Yard Index)
            </div>
          </div>
        </div>

        {/* 3D Drag Tip Overlay */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm border border-neutral-800 text-[10px] font-mono text-neutral-400 pointer-events-none hidden sm:block">
          🖱️ Click &amp; Drag to Rotate KRAN-VULCAN • Scroll to Zoom
        </div>

        {/* Cutting Seam Progress Indicator (Bottom Right) */}
        <div className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800 text-xs font-mono flex items-center gap-3">
          <span className="text-[11px] text-neutral-400">SEAM CUT PROGRESS:</span>
          <span className="text-xs font-bold text-white font-mono">{cutProgress}%</span>
          <div className="w-24 bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-300 ${
                cuttingPhase === 'CUTTING' ? 'bg-cyan-400' : 'bg-neutral-600'
              }`}
              style={{ width: `${cutProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Ultrasonic Standoff Calibration Controls (Bottom Panel) */}
      <div className="p-4 bg-neutral-950 border-t border-dark-border grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Target Standoff Distance Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-300 font-bold flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Standoff (Distance Preset)</span>
            </span>
            <span className="text-cyan-400 font-bold">{targetStandoff} mm</span>
          </div>
          <div className="flex items-center gap-2">
            {[2.5, 3.0, 3.5, 4.0, 5.0].map((dist) => (
              <button
                key={dist}
                onClick={() => setTargetStandoff(dist)}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                  targetStandoff === dist
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {dist} mm
              </button>
            ))}
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">
            Plasma nozzle locks at this distance before initiating arc ignition.
          </p>
        </div>

        {/* 2. Manual Height Z-Jog (Like Image 3 UP/DOWN arrows) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-300 font-bold flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              <span>Manual Nozzle Height Adjust (Z-Jog)</span>
            </span>
            <span className="text-neutral-400 font-mono text-[11px]">
              Offset: {manualZOffset > 0 ? `+${manualZOffset.toFixed(1)}` : manualZOffset.toFixed(1)} mm
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setManualZOffset((prev) => Math.max(-2.0, prev - 0.5))}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 font-mono text-neutral-300"
              title="Lower Nozzle closer to ship plate"
            >
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>LOWER (-0.5mm)</span>
            </button>

            <button
              onClick={() => setManualZOffset(0)}
              className="btn-secondary py-1.5 px-2.5 text-xs font-mono text-neutral-400"
              title="Reset offset to zero"
            >
              RESET
            </button>

            <button
              onClick={() => setManualZOffset((prev) => Math.min(6.0, prev + 0.5))}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 font-mono text-neutral-300"
              title="Raise Nozzle away from ship plate"
            >
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              <span>RAISE (+0.5mm)</span>
            </button>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">
            Simulates Initial Height Sensing (IHS) mechanism from Image 3.
          </p>
        </div>

        {/* 3. Auto-Tracking & Modes Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-300 font-bold flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Closed-Loop Height Control</span>
            </span>
            <button
              onClick={() => setAutoTracking(!autoTracking)}
              className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                autoTracking ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {autoTracking ? 'AUTO ON' : 'MANUAL'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCuttingPhase('MOVING')}
              className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                cuttingPhase === 'MOVING'
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              Traverse (16mm)
            </button>

            <button
              onClick={() => setCuttingPhase('CALIBRATING')}
              className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                cuttingPhase === 'CALIBRATING'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              Auto-Probe
            </button>

            <button
              onClick={() => setCuttingPhase('LOCKED')}
              className={`flex-1 py-1.5 rounded text-xs font-mono transition-all ${
                cuttingPhase === 'LOCKED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              Lock Standoff
            </button>
          </div>

          <p className="text-[10px] text-neutral-500 font-mono">
            Compensates for ship hull plate warping and curvature during cutting.
          </p>
        </div>
      </div>
    </div>
  );
}
