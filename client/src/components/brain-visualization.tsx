import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface BrainVisualizationProps {
  className?: string;
}

export default function BrainVisualization({ className = "" }: BrainVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  
  // Control parameters - set to maximum values
  const [attractorMass, setAttractorMass] = useState(1e8);
  const [particleMass, setParticleMass] = useState(1e5);
  const [maxSpeed, setMaxSpeed] = useState(20);
  const [velocityDamping, setVelocityDamping] = useState(0.1);
  const [spinningStrength, setSpinningStrength] = useState(5.0);
  const [scale, setScale] = useState(0.05);
  const [boundHalfExtent, setBoundHalfExtent] = useState(15);
  
  // Fixed fleet colors - green, blue, purple, orange
  const fleet1ColorA = '#10b981'; // green
  const fleet1ColorB = '#34d399'; // light green
  const fleet2ColorA = '#3b82f6'; // blue
  const fleet2ColorB = '#60a5fa'; // light blue
  const fleet3ColorA = '#8b5cf6'; // purple
  const fleet3ColorB = '#a78bfa'; // light purple

  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log("Starting massive hive mind brain visualization...");

    // Mobile detection
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup - adjusted for mobile
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 35 : 25, // Wider field of view for mobile
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(isMobile ? 4 : 3, isMobile ? 6 : 5, isMobile ? 10 : 8);

    // Renderer setup - optimized for mobile
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      powerPreference: isMobile ? "low-power" : "high-performance"
    });
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 50;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(4, 2, 0);
    scene.add(directionalLight);

    console.log("Generating neural hive mind visualization...");

    // Attractors (brain regions)
    const attractorPositions = [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, -0.5),
      new THREE.Vector3(0, 0.5, 1)
    ];

    const attractorRotationAxes = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(1, 0, -0.5).normalize()
    ];

    // Fleet colors for attractors
    const fleetColors = [
      0x5900ff, // Fleet 1 - Purple
      0x00ff59, // Fleet 2 - Green
      0xff5900  // Fleet 3 - Orange
    ];

    // Create attractor helpers
    const attractorHelpers = attractorPositions.map((pos, i) => {
      const helper = new THREE.Group();
      helper.position.copy(pos);
      
      // Ring
      const ringGeometry = new THREE.RingGeometry(1, 1.02, 32, 1, 0, Math.PI * 1.5);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: fleetColors[i], 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI * 0.5;
      ring.scale.setScalar(0.325);
      helper.add(ring);

      // Arrow
      const arrowGeometry = new THREE.ConeGeometry(0.1, 0.4, 12, 1, false);
      const arrowMaterial = new THREE.MeshBasicMaterial({ color: fleetColors[i] });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.set(0.325, 0, 0.065);
      arrow.rotation.x = Math.PI * 0.5;
      helper.add(arrow);

      scene.add(helper);
      return helper;
    });

    // Particles - adaptive count based on screen size
    let particleCount;
    if (isMobile) {
      particleCount = Math.pow(2, 14); // 16,384 particles for mobile
    } else if (isTablet) {
      particleCount = Math.pow(2, 16); // 65,536 particles for tablet
    } else {
      particleCount = Math.pow(2, 18); // 262,144 particles for desktop
    }
    
    console.log(`Generated ${particleCount} visual neural nodes`);

    // Particle positions and velocities
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position in space
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Random initial velocity
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      velocities[i3] = Math.sin(theta) * Math.cos(phi) * 0.05;
      velocities[i3 + 1] = Math.cos(theta) * 0.05;
      velocities[i3 + 2] = Math.sin(theta) * Math.sin(phi) * 0.05;
      
      // Random scale
      scales[i] = (0.25 + Math.random() * 0.75) * scale;
    }

    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle material
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        fleet1ColorA: { value: new THREE.Color(fleet1ColorA) },
        fleet1ColorB: { value: new THREE.Color(fleet1ColorB) },
        fleet2ColorA: { value: new THREE.Color(fleet2ColorA) },
        fleet2ColorB: { value: new THREE.Color(fleet2ColorB) },
        fleet3ColorA: { value: new THREE.Color(fleet3ColorA) },
        fleet3ColorB: { value: new THREE.Color(fleet3ColorB) }
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 fleet1ColorA;
        uniform vec3 fleet1ColorB;
        uniform vec3 fleet2ColorA;
        uniform vec3 fleet2ColorB;
        uniform vec3 fleet3ColorA;
        uniform vec3 fleet3ColorB;
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    console.log("Generating neural connections...");
    console.log("Massive hive mind brain visualization complete");

    // Animation variables
    const gravityConstant = 6.67e-11;
    
    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const delta = 1 / 60; // Fixed delta time
      const time = Date.now() * 0.001;
      
      // Update particles
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const px = positions[i3];
        const py = positions[i3 + 1];
        const pz = positions[i3 + 2];
        
        let vx = velocities[i3];
        let vy = velocities[i3 + 1];
        let vz = velocities[i3 + 2];
        
        // Apply forces from attractors
        for (let j = 0; j < attractorPositions.length; j++) {
          const attractor = attractorPositions[j];
          const rotationAxis = attractorRotationAxes[j];
          
          const dx = attractor.x - px;
          const dy = attractor.y - py;
          const dz = attractor.z - pz;
          
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance > 0.1) {
            // Gravity
            const gravityStrength = attractorMass * particleMass * gravityConstant / (distance * distance);
            const dirX = dx / distance;
            const dirY = dy / distance;
            const dirZ = dz / distance;
            
            vx += dirX * gravityStrength * delta;
            vy += dirY * gravityStrength * delta;
            vz += dirZ * gravityStrength * delta;
            
            // Spinning force
            const spinningForceX = rotationAxis.y * dz - rotationAxis.z * dy;
            const spinningForceY = rotationAxis.z * dx - rotationAxis.x * dz;
            const spinningForceZ = rotationAxis.x * dy - rotationAxis.y * dx;
            
            vx += spinningForceX * gravityStrength * spinningStrength * delta;
            vy += spinningForceY * gravityStrength * spinningStrength * delta;
            vz += spinningForceZ * gravityStrength * spinningStrength * delta;
          }
        }
        
        // Limit speed
        const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
        if (speed > maxSpeed) {
          const factor = maxSpeed / speed;
          vx *= factor;
          vy *= factor;
          vz *= factor;
        }
        
        // Apply damping
        vx *= (1 - velocityDamping);
        vy *= (1 - velocityDamping);
        vz *= (1 - velocityDamping);
        
        // Update position
        positions[i3] += vx * delta;
        positions[i3 + 1] += vy * delta;
        positions[i3 + 2] += vz * delta;
        
        velocities[i3] = vx;
        velocities[i3 + 1] = vy;
        velocities[i3 + 2] = vz;
        
        // Boundary wrapping
        const halfExtent = boundHalfExtent / 2;
        if (positions[i3] > halfExtent) positions[i3] -= boundHalfExtent;
        if (positions[i3] < -halfExtent) positions[i3] += boundHalfExtent;
        if (positions[i3 + 1] > halfExtent) positions[i3 + 1] -= boundHalfExtent;
        if (positions[i3 + 1] < -halfExtent) positions[i3 + 1] += boundHalfExtent;
        if (positions[i3 + 2] > halfExtent) positions[i3 + 2] -= boundHalfExtent;
        if (positions[i3 + 2] < -halfExtent) positions[i3 + 2] += boundHalfExtent;
        
        // Find closest attractor to determine fleet color
        let closestAttractorIndex = 0;
        let closestDistance = Infinity;
        
        for (let j = 0; j < attractorPositions.length; j++) {
          const attractor = attractorPositions[j];
          const dx = attractor.x - px;
          const dy = attractor.y - py;
          const dz = attractor.z - pz;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestAttractorIndex = j;
          }
        }
        
        // Update colors based on speed and fleet
        const normalizedSpeed = Math.min(speed / maxSpeed, 1);
        const colorMix = Math.max(0, Math.min(1, normalizedSpeed * 2));
        
        let colorAObj, colorBObj;
        if (closestAttractorIndex === 0) {
          colorAObj = new THREE.Color(fleet1ColorA);
          colorBObj = new THREE.Color(fleet1ColorB);
        } else if (closestAttractorIndex === 1) {
          colorAObj = new THREE.Color(fleet2ColorA);
          colorBObj = new THREE.Color(fleet2ColorB);
        } else {
          colorAObj = new THREE.Color(fleet3ColorA);
          colorBObj = new THREE.Color(fleet3ColorB);
        }
        
        const finalColor = colorAObj.lerp(colorBObj, colorMix);
        
        colors[i3] = finalColor.r;
        colors[i3 + 1] = finalColor.g;
        colors[i3 + 2] = finalColor.b;
      }
      
      // Update geometry
      particleGeometry.attributes.position.needsUpdate = true;
      particleGeometry.attributes.color.needsUpdate = true;
      
      // Rotate attractors
      attractorHelpers.forEach((helper, i) => {
        helper.rotation.y += 0.01 * (i + 1);
      });
      
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [attractorMass, particleMass, maxSpeed, velocityDamping, spinningStrength, scale, boundHalfExtent, fleet1ColorA, fleet1ColorB, fleet2ColorA, fleet2ColorB, fleet3ColorA, fleet3ColorB]);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: '400px' }}>
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Control Panel */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-lg border border-emerald-500/30 rounded-lg p-4 min-w-[280px] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Controls</h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-white text-xs"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-300 block mb-1">attractorMassExponent</label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={Math.log10(attractorMass)}
                onChange={(e) => setAttractorMass(Math.pow(10, parseInt(e.target.value)))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{Math.log10(attractorMass)}</span>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">particleGlobalMassExponent</label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={Math.log10(particleMass)}
                onChange={(e) => setParticleMass(Math.pow(10, parseInt(e.target.value)))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{Math.log10(particleMass)}</span>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">maxSpeed</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.01"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{maxSpeed.toFixed(2)}</span>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">velocityDamping</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={velocityDamping}
                onChange={(e) => setVelocityDamping(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{velocityDamping.toFixed(3)}</span>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">spinningStrength</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.01"
                value={spinningStrength}
                onChange={(e) => setSpinningStrength(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{spinningStrength.toFixed(2)}</span>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">scale</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{scale.toFixed(3)}</span>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">boundHalfExtent</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.01"
                value={boundHalfExtent}
                onChange={(e) => setBoundHalfExtent(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-gray-400">{boundHalfExtent.toFixed(2)}</span>
            </div>
            
            {/* Fleet Color Display */}
            <div className="border-t border-gray-600 pt-3 mt-3">
              <h4 className="text-gray-200 font-semibold text-xs mb-3">Fleet Colors</h4>
              
              {/* Massive Fleet One - Green */}
              <div className="mb-3">
                <h5 className="text-green-400 font-medium text-xs mb-1">Massive Fleet One - Green</h5>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: fleet1ColorA }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: fleet1ColorB }}></div>
                </div>
              </div>
              
              {/* Massive Fleet Two - Blue */}
              <div className="mb-3">
                <h5 className="text-blue-400 font-medium text-xs mb-1">Massive Fleet Two - Blue</h5>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: fleet2ColorA }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: fleet2ColorB }}></div>
                </div>
              </div>
              
              {/* Massive Fleet Three - Purple */}
              <div className="mb-3">
                <h5 className="text-purple-400 font-medium text-xs mb-1">Massive Fleet Three - Purple</h5>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: fleet3ColorA }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: fleet3ColorB }}></div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setAttractorMass(1e8);
                setParticleMass(1e5);
                setMaxSpeed(20);
                setVelocityDamping(0.1);
                setSpinningStrength(5.0);
                setScale(0.05);
                setBoundHalfExtent(15);
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs"
            >
              Reset to Maximum
            </button>
          </div>
        </div>
      )}
      
      {/* Show Controls Button */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-4 right-4 bg-black/90 backdrop-blur-lg border border-emerald-500/30 rounded-lg p-2 text-white text-xs hover:bg-emerald-600/20"
        >
          Show Controls
        </button>
      )}
    </div>
  );
}