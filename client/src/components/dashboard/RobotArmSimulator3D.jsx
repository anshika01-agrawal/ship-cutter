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
  ShieldAlert
} from 'lucide-react';

export default function RobotArmSimulator3D({ isSafeToCut = true, oppositeSideTemp = 28, oppositeSideGasPPM = 8 }) {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [thermalMode, setThermalMode] = useState(false);
  const [showSparks, setShowSparks] = useState(true);
  const [cutProgress, setCutProgress] = useState(35);
  const [laserPower, setLaserPower] = useState(85); // %
  const [laserTemp, setLaserTemp] = useState(1850); // °C

  // Refs for animation loop
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const reqIdRef = useRef(null);
  const armPartsRef = useRef({});
  const sparksRef = useRef(null);
  const laserBeamRef = useRef(null);
  const gasPlumeRef = useRef(null);
  const cutLineRef = useRef(null);
  const progressRef = useRef(35);
  const isPlayingRef = useRef(true);
  const thermalModeRef = useRef(false);
  const isSafeRef = useRef(isSafeToCut);

  useEffect(() => {
    isSafeRef.current = isSafeToCut;
  }, [isSafeToCut]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    thermalModeRef.current = thermalMode;
  }, [thermalMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(thermalMode ? 0x070114 : 0x050508);
    scene.fog = new THREE.FogExp2(thermalMode ? 0x070114 : 0x050508, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(5.5, 4.2, 6.5);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xddeeff, 1.2);
    mainLight.position.set(6, 10, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Laser glow point light (bright orange-cyan)
    const laserLight = new THREE.PointLight(0x00ffff, 3.5, 4);
    laserLight.position.set(0, 0.1, 0);
    scene.add(laserLight);

    // 3. Ship Steel Plate (The cutting workpiece)
    const plateGeo = new THREE.BoxGeometry(7, 0.2, 5);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.45,
      metalness: 0.85,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, -0.1, 0);
    plate.receiveShadow = true;
    scene.add(plate);

    // Ship Ribs / Stiffener Beams under plate
    const ribGeo = new THREE.BoxGeometry(0.15, 0.6, 5);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, metalness: 0.9, roughness: 0.6 });
    for (let x = -2.5; x <= 2.5; x += 1.25) {
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(x, -0.5, 0);
      scene.add(rib);
    }

    // Grid markings on ship plate
    const gridHelper = new THREE.GridHelper(7, 14, 0x00ffff, 0x223344);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 4. Robotic Can (Crawler Chassis / Canister Base)
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Canister Body
    const canGeo = new THREE.CylinderGeometry(0.65, 0.7, 0.9, 24);
    const canMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.7,
      roughness: 0.3,
    });
    const canMesh = new THREE.Mesh(canGeo, canMat);
    canMesh.position.y = 0.45;
    canMesh.castShadow = true;
    robotGroup.add(canMesh);

    // Cyan status LED band on canister
    const ledBandGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.1, 24);
    const ledBandMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const ledBand = new THREE.Mesh(ledBandGeo, ledBandMat);
    ledBand.position.y = 0.5;
    robotGroup.add(ledBand);

    // Magnetic crawler tracks (Left & Right)
    const trackGeo = new THREE.BoxGeometry(0.28, 0.32, 1.5);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.9 });
    const leftTrack = new THREE.Mesh(trackGeo, trackMat);
    leftTrack.position.set(-0.8, 0.16, 0);
    const rightTrack = new THREE.Mesh(trackGeo, trackMat);
    rightTrack.position.set(0.8, 0.16, 0);
    robotGroup.add(leftTrack, rightTrack);

    // Ultrasonic sensor pod on canister front
    const sonicGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 12);
    const sonicMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 });
    const sonic1 = new THREE.Mesh(sonicGeo, sonicMat);
    sonic1.rotation.x = Math.PI / 2;
    sonic1.position.set(-0.25, 0.75, 0.65);
    const sonic2 = new THREE.Mesh(sonicGeo, sonicMat);
    sonic2.rotation.x = Math.PI / 2;
    sonic2.position.set(0.25, 0.75, 0.65);
    robotGroup.add(sonic1, sonic2);

    // Thermal sensing camera module mounted on canister top
    const camHousingGeo = new THREE.BoxGeometry(0.3, 0.22, 0.35);
    const camHousingMat = new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.8 });
    const camHousing = new THREE.Mesh(camHousingGeo, camHousingMat);
    camHousing.position.set(0, 1.05, 0.4);
    const lensGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 }); // IR lens red/germanium
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1.05, 0.58);
    robotGroup.add(camHousing, lens);

    // 5. Articulated Robotic Arm with Laser Nozzle
    // Turret / Base Joint
    const turretGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.25, 18);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x2a2d34, metalness: 0.8, roughness: 0.35 });
    const turret = new THREE.Mesh(turretGeo, armMat);
    turret.position.y = 1.0;
    robotGroup.add(turret);

    // Shoulder Joint
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.set(0, 1.15, 0);
    robotGroup.add(shoulderGroup);

    // Upper Arm Link
    const upperArmGeo = new THREE.BoxGeometry(0.18, 1.3, 0.22);
    const upperArm = new THREE.Mesh(upperArmGeo, armMat);
    upperArm.position.set(0, 0.6, 0);
    upperArm.castShadow = true;
    shoulderGroup.add(upperArm);

    // Elbow Joint
    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, 1.25, 0);
    shoulderGroup.add(elbowGroup);

    // Forearm Link
    const forearmGeo = new THREE.BoxGeometry(0.16, 1.1, 0.18);
    const forearm = new THREE.Mesh(forearmGeo, armMat);
    forearm.position.set(0, 0.5, 0);
    forearm.castShadow = true;
    elbowGroup.add(forearm);

    // Wrist Joint & Laser / Plasma Nozzle Head
    const wristGroup = new THREE.Group();
    wristGroup.position.set(0, 1.0, 0);
    elbowGroup.add(wristGroup);

    // Laser Torch Nozzle Cone
    const nozzleGeo = new THREE.ConeGeometry(0.12, 0.45, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Brass/copper nozzle
      metalness: 0.9,
      roughness: 0.2,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.rotation.x = Math.PI; // point downwards
    nozzle.position.set(0, -0.22, 0);
    wristGroup.add(nozzle);

    // Laser Beam Cylinder (intense high-def energy arc)
    const beamGeo = new THREE.CylinderGeometry(0.025, 0.045, 0.75, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.9,
    });
    const laserBeam = new THREE.Mesh(beamGeo, beamMat);
    laserBeam.position.set(0, -0.65, 0);
    wristGroup.add(laserBeam);
    laserBeamRef.current = laserBeam;

    armPartsRef.current = {
      robotGroup,
      shoulderGroup,
      elbowGroup,
      wristGroup,
      laserLight,
    };

    // 6. Spark Particles Emitter (when laser is cutting)
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = 0;
      sparkPositions[i * 3 + 2] = 0;
      sparkVelocities.push({
        vx: (Math.random() - 0.5) * 2.2,
        vy: Math.random() * 2.8 + 0.8,
        vz: (Math.random() - 0.5) * 2.2,
        life: Math.random(),
      });
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.08,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);
    sparksRef.current = { sparks, sparkGeo, sparkPositions, sparkVelocities };

    // 7. Thermal Sensing Gas Plume (Visualized infrared gas leakage detection)
    const plumeGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const gasPlume = new THREE.Mesh(plumeGeo, plumeMat);
    gasPlume.position.set(0, 0.4, 0);
    gasPlume.visible = false;
    scene.add(gasPlume);
    gasPlumeRef.current = gasPlume;

    // 8. Cut Kerf Line (molten cut track left behind on ship plate)
    const cutTrackGeo = new THREE.PlaneGeometry(0.12, 3.8);
    const cutTrackMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      side: THREE.DoubleSide,
    });
    const cutTrack = new THREE.Mesh(cutTrackGeo, cutTrackMat);
    cutTrack.rotation.x = -Math.PI / 2;
    cutTrack.rotation.z = Math.PI / 2;
    cutTrack.position.set(0, 0.02, 0.8);
    scene.add(cutTrack);
    cutLineRef.current = cutTrack;

    // Interactive Orbit / Mouse drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let azimuth = 0.75;
    let elevation = 0.55;
    let distance = 8.5;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - prevMouseX) * 0.006;
      const dy = (e.clientY - prevMouseY) * 0.006;
      azimuth -= dx;
      elevation = Math.max(0.15, Math.min(Math.PI / 2 - 0.08, elevation + dy));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      distance = Math.max(3.5, Math.min(14, distance + e.deltaY * 0.006));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 9. Main Animation Loop
    let clock = new THREE.Clock();
    let cutT = 0.35;

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Update camera based on orbit spherical coords
      camera.position.x = distance * Math.sin(azimuth) * Math.cos(elevation);
      camera.position.z = distance * Math.cos(azimuth) * Math.cos(elevation);
      camera.position.y = distance * Math.sin(elevation);
      camera.lookAt(0, 0.7, 0);

      // Cutting path motion
      if (isPlayingRef.current && isSafeRef.current) {
        cutT = (cutT + delta * 0.08) % 1.0;
        progressRef.current = Math.round(cutT * 100);
        setCutProgress(progressRef.current);
      }

      // X position along ship hull cut path (-1.8 to +1.8)
      const targetCutX = (cutT - 0.5) * 3.6;
      const targetCutZ = 0.8 + Math.sin(cutT * Math.PI * 2) * 0.25;

      // Animate Can Base position
      robotGroup.position.set(targetCutX * 0.75, 0, -0.6);

      // Animate Arm Inverse Kinematics to track laser focal point on plate
      const shoulder = shoulderGroup;
      const elbow = elbowGroup;
      const wrist = wristGroup;

      if (shoulder && elbow && wrist) {
        shoulder.rotation.z = Math.sin(cutT * 4) * 0.2 - 0.35;
        shoulder.rotation.y = Math.cos(cutT * 3) * 0.25;
        elbow.rotation.z = 0.75 + Math.cos(cutT * 4) * 0.15;
        wrist.rotation.z = -0.55 - Math.sin(cutT * 4) * 0.15;
      }

      // Laser Contact Point on Ship Plate
      const nozzleContactPoint = new THREE.Vector3(targetCutX, 0.02, targetCutZ);
      laserLight.position.copy(nozzleContactPoint);
      laserLight.position.y = 0.2;

      // Laser Beam Visualizer
      if (laserBeamRef.current) {
        const canCut = isSafeRef.current && isPlayingRef.current;
        laserBeamRef.current.visible = canCut;
        laserLight.intensity = canCut ? 3.5 + Math.sin(elapsed * 40) * 0.8 : 0;

        // Change beam color in thermal mode
        if (thermalModeRef.current) {
          laserBeamRef.current.material.color.setHex(0xff0055);
          laserLight.color.setHex(0xff0055);
        } else {
          laserBeamRef.current.material.color.setHex(0x00ffff);
          laserLight.color.setHex(0x00ffff);
        }
      }

      // Spark Particles Physics
      const sp = sparksRef.current;
      if (sp && sp.sparkPositions) {
        const canCut = isSafeRef.current && isPlayingRef.current && showSparks;
        sp.sparks.visible = canCut;

        if (canCut) {
          for (let i = 0; i < sparkCount; i++) {
            const vel = sp.sparkVelocities[i];
            vel.life -= delta * 3.2;

            if (vel.life <= 0) {
              // Reset spark at laser nozzle kerf point
              sp.sparkPositions[i * 3] = nozzleContactPoint.x;
              sp.sparkPositions[i * 3 + 1] = 0.05;
              sp.sparkPositions[i * 3 + 2] = nozzleContactPoint.z;
              vel.vx = (Math.random() - 0.5) * 2.8;
              vel.vy = Math.random() * 2.5 + 0.6;
              vel.vz = (Math.random() - 0.5) * 2.8;
              vel.life = 1.0;
            } else {
              // Move spark with gravity
              sp.sparkPositions[i * 3] += vel.vx * delta;
              sp.sparkPositions[i * 3 + 1] += vel.vy * delta;
              sp.sparkPositions[i * 3 + 2] += vel.vz * delta;
              vel.vy -= 9.8 * delta * 0.6; // gravity
            }
          }
          sp.sparkGeo.attributes.position.needsUpdate = true;
        }
      }

      // Thermal Sensing Camera: Predict & Visualize Gas Plume
      const gp = gasPlumeRef.current;
      if (gp) {
        // Show gas plume if hazard is injected or thermal mode is on
        const hasGasHazard = !isSafeRef.current || thermalModeRef.current;
        gp.visible = hasGasHazard;
        if (hasGasHazard) {
          gp.position.set(nozzleContactPoint.x + 0.5, 0.45 + Math.sin(elapsed * 2) * 0.1, nozzleContactPoint.z);
          gp.scale.setScalar(1.0 + Math.sin(elapsed * 3) * 0.25);
          gp.material.color.setHex(isSafeRef.current ? 0x38bdf8 : 0xf43f5e);
        }
      }

      // Cut Kerf track visual scaling
      if (cutLineRef.current) {
        cutLineRef.current.scale.x = Math.max(0.01, cutT);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
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

  return (
    <div className="card-surface border border-dark-border bg-black rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
      {/* Simulation Top Bar */}
      <div className="p-4 border-b border-dark-border bg-neutral-950/90 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <span>3D Robotic Can & Laser Arm Simulator</span>
              <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px]">
                THREE.JS WEBGL
              </span>
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">
              6-Axis Kinematic Arm • 400A Plasma Arc • Ultrasonic Tracking
            </span>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              thermalMode
                ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-glow-sm'
                : 'bg-neutral-900 text-neutral-300 border border-dark-border hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{thermalMode ? 'FLIR Thermal IR Active' : 'Normal Vision'}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-mono"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Cut' : 'Resume Cut'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount Container */}
      <div className="relative w-full h-[440px] bg-black cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Real-time Thermal Camera & Gas Prediction HUD Overlay */}
        <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-mono space-y-2 pointer-events-none max-w-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
            <span className="text-[10px] uppercase text-cyan-400 font-bold flex items-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>FLIR IR GAS & HEAT SENSOR</span>
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${isSafeToCut ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
              {isSafeToCut ? 'GAS CLEAR' : 'GAS LEAK PLUME'}
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-500">Laser Kerf Temp:</span>
              <span className="text-orange-400 font-bold">1,850 °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Ultrasonic Standoff:</span>
              <span className="text-cyan-300">3.21 mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Opposite Void Temp:</span>
              <span className={oppositeSideTemp > 50 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {oppositeSideTemp} °C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Opposite Gas Level:</span>
              <span className={oppositeSideGasPPM > 35 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {oppositeSideGasPPM} PPM
              </span>
            </div>
          </div>

          <div className="pt-1 border-t border-neutral-800 text-[10px] text-neutral-400">
            Click & drag to rotate 3D angle • Scroll to zoom
          </div>
        </div>

        {/* Safety Interlock Signal Badge */}
        <div className="absolute top-4 right-4 px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-700 flex items-center gap-2.5 shadow-xl">
          <span className={`w-3 h-3 rounded-full ${isSafeToCut ? 'bg-emerald-400 animate-ping' : 'bg-red-400 animate-bounce'}`} />
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">INTERLOCK STATUS</span>
            <span className={`text-xs font-mono font-bold ${isSafeToCut ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSafeToCut ? 'CUT AUTHORIZED (GREEN)' : 'CUT INHIBITED (RED)'}
            </span>
          </div>
        </div>

        {/* Live Cutting Progress Bar */}
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">SEAM PROGRESS</span>
            <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
              <div
                className={`h-full transition-all duration-300 ${isSafeToCut ? 'bg-cyan-400' : 'bg-red-400'}`}
                style={{ width: `${cutProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-white">{cutProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
