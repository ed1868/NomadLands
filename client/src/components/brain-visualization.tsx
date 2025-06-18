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
  
  // Control parameters
  const [attractorMass, setAttractorMass] = useState(1e7);
  const [particleMass, setParticleMass] = useState(1e4);
  const [maxSpeed, setMaxSpeed] = useState(8);
  const [velocityDamping, setVelocityDamping] = useState(0.1);
  const [spinningStrength, setSpinningStrength] = useState(2.75);
  const [scale, setScale] = useState(0.008);
  const [boundHalfExtent, setBoundHalfExtent] = useState(8);
  const [colorA, setColorA] = useState('#5900ff');
  const [colorB, setColorB] = useState('#ffa575');

  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log("Starting massive hive mind brain visualization...");

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      25,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(3, 5, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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

    // Create attractor helpers
    const attractorHelpers = attractorPositions.map((pos, i) => {
      const helper = new THREE.Group();
      helper.position.copy(pos);
      
      // Ring
      const ringGeometry = new THREE.RingGeometry(1, 1.02, 32, 1, 0, Math.PI * 1.5);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x10b981, 
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
      const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b35 });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.set(0.325, 0, 0.065);
      arrow.rotation.x = Math.PI * 0.5;
      helper.add(arrow);

      scene.add(helper);
      return helper;
    });

    // Particles
    const particleCount = Math.pow(2, 18); // 262,144 particles for massive scale
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
        colorA: { value: new THREE.Color(colorA) },
        colorB: { value: new THREE.Color(colorB) }
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
        uniform vec3 colorA;
        uniform vec3 colorB;
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
        
        // Update colors based on speed
        const normalizedSpeed = Math.min(speed / maxSpeed, 1);
        const colorMix = Math.max(0, Math.min(1, normalizedSpeed * 2));
        
        const colorAObj = new THREE.Color(colorA);
        const colorBObj = new THREE.Color(colorB);
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
  }, [attractorMass, particleMass, maxSpeed, velocityDamping, spinningStrength, scale, boundHalfExtent, colorA, colorB]);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: '400px' }}>
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Control Panel */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-lg border border-emerald-500/30 rounded-lg p-4 min-w-[280px]">
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
                max="10"
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
            
            <div>
              <label className="text-gray-300 block mb-1">colorA</label>
              <input
                type="color"
                value={colorA}
                onChange={(e) => setColorA(e.target.value)}
                className="w-full h-8 rounded border border-gray-600"
              />
            </div>
            
            <div>
              <label className="text-gray-300 block mb-1">colorB</label>
              <input
                type="color"
                value={colorB}
                onChange={(e) => setColorB(e.target.value)}
                className="w-full h-8 rounded border border-gray-600"
              />
            </div>
            
            <button
              onClick={() => {
                setAttractorMass(1e7);
                setParticleMass(1e4);
                setMaxSpeed(8);
                setVelocityDamping(0.1);
                setSpinningStrength(2.75);
                setScale(0.008);
                setBoundHalfExtent(8);
                setColorA('#5900ff');
                setColorB('#ffa575');
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs"
            >
              reset
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