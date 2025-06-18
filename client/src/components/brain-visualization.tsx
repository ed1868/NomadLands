import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface BrainVisualizationProps {
  className?: string;
}

export default function BrainVisualization({ className = "" }: BrainVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log("Starting massive hive mind brain visualization...");

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup - wider field of view for more dramatic effect
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    console.log("Generating neural hive mind visualization...");

    // Create massive neural network with particle system
    const particleCount = 1480; // Massive neural node count
    const connectionCount = 183; // Neural connection count
    
    console.log(`Generated ${particleCount} visual neural nodes`);

    // Neural node geometry and material
    const nodeGeometry = new THREE.SphereGeometry(0.015, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.8
    });

    // Create instanced mesh for performance
    const instancedNodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, particleCount);
    scene.add(instancedNodes);

    // Store positions for connections
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];
    const nodeTargets: THREE.Vector3[] = [];
    
    // Neural attractor positions (brain regions)
    const attractors = [
      new THREE.Vector3(-2, 0, 0),    // Left hemisphere
      new THREE.Vector3(2, 0, 0),     // Right hemisphere
      new THREE.Vector3(0, 1.5, 0),   // Frontal cortex
      new THREE.Vector3(0, -1.5, 0),  // Brain stem
      new THREE.Vector3(0, 0, -1.5),  // Occipital lobe
    ];

    // Initialize neural nodes with organic distribution
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < particleCount; i++) {
      // Create neural cluster patterns around attractors
      const attractorIndex = Math.floor(Math.random() * attractors.length);
      const basePos = attractors[attractorIndex].clone();
      
      // Add organic scatter around attractor
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const radius = 0.5 + Math.random() * 1.5;
      
      const position = new THREE.Vector3(
        basePos.x + radius * Math.sin(phi) * Math.cos(theta),
        basePos.y + radius * Math.cos(phi),
        basePos.z + radius * Math.sin(phi) * Math.sin(theta)
      );
      
      nodePositions.push(position);
      nodeVelocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ));
      
      // Target positions for swarm behavior
      nodeTargets.push(position.clone());
      
      matrix.setPosition(position);
      instancedNodes.setMatrixAt(i, matrix);
    }
    
    console.log("Generating neural connections...");

    // Create neural connections (synapses) as lines
    const connections: THREE.Line[] = [];
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < connectionCount; i++) {
      const startIdx = Math.floor(Math.random() * particleCount);
      const endIdx = Math.floor(Math.random() * particleCount);
      
      if (startIdx !== endIdx) {
        const points = [nodePositions[startIdx], nodePositions[endIdx]];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, connectionMaterial);
        connections.push(line);
        scene.add(line);
      }
    }
    
    console.log(`Generated ${connectionCount} neural connections`);

    // Create brain hemisphere wireframes
    const leftHemisphere = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI);
    const rightHemisphere = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI);
    
    const hemispheMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
      side: THREE.DoubleSide
    });

    const leftMesh = new THREE.Mesh(leftHemisphere, hemispheMaterial);
    leftMesh.position.x = -1;
    leftMesh.rotation.y = 0;
    scene.add(leftMesh);

    const rightMesh = new THREE.Mesh(rightHemisphere, hemispheMaterial);
    rightMesh.position.x = 1;
    rightMesh.rotation.y = Math.PI;
    scene.add(rightMesh);

    // Attractor visualization
    const attractorGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const attractorMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.7
    });

    attractors.forEach(attractor => {
      const attractorMesh = new THREE.Mesh(attractorGeometry, attractorMaterial);
      attractorMesh.position.copy(attractor);
      scene.add(attractorMesh);
    });

    // Advanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x10b981, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b35, 0.5, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Physics simulation variables
    const gravityStrength = 0.0001;
    const maxSpeed = 0.05;
    const dampening = 0.98;
    const repulsionStrength = 0.002;

    // Animation loop with advanced particle physics
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Update particle positions with attractor physics
      for (let i = 0; i < particleCount; i++) {
        const position = nodePositions[i];
        const velocity = nodeVelocities[i];
        const target = nodeTargets[i];
        
        // Apply attractor forces
        const force = new THREE.Vector3();
        
        attractors.forEach((attractor, idx) => {
          const toAttractor = attractor.clone().sub(position);
          const distance = toAttractor.length();
          
          if (distance > 0.1) {
            const strength = gravityStrength / (distance * distance);
            toAttractor.normalize().multiplyScalar(strength);
            force.add(toAttractor);
            
            // Add orbital motion
            const orbital = new THREE.Vector3(
              -toAttractor.z * 0.5,
              Math.sin(time + idx) * 0.2,
              toAttractor.x * 0.5
            );
            force.add(orbital);
          }
        });
        
        // Particle-to-particle repulsion for organic spread
        for (let j = 0; j < Math.min(i + 10, particleCount); j++) {
          if (i !== j) {
            const toOther = position.clone().sub(nodePositions[j]);
            const distance = toOther.length();
            
            if (distance < 0.3 && distance > 0) {
              toOther.normalize().multiplyScalar(repulsionStrength / distance);
              force.add(toOther);
            }
          }
        }
        
        // Apply forces
        velocity.add(force);
        velocity.multiplyScalar(dampening);
        
        // Limit max speed
        if (velocity.length() > maxSpeed) {
          velocity.normalize().multiplyScalar(maxSpeed);
        }
        
        // Update position
        position.add(velocity);
        
        // Update instance matrix
        matrix.setPosition(position);
        instancedNodes.setMatrixAt(i, matrix);
      }
      
      instancedNodes.instanceMatrix.needsUpdate = true;
      
      // Update connections dynamically
      connections.forEach((connection, idx) => {
        if (idx < nodePositions.length - 1) {
          const startIdx = Math.floor(idx * particleCount / connectionCount);
          const endIdx = Math.floor((idx + 1) * particleCount / connectionCount);
          
          if (startIdx < nodePositions.length && endIdx < nodePositions.length && 
              nodePositions[startIdx] && nodePositions[endIdx]) {
            const startPos = nodePositions[startIdx];
            const endPos = nodePositions[endIdx];
            
            const points = [startPos, endPos];
            connection.geometry.setFromPoints(points);
            connection.geometry.attributes.position.needsUpdate = true;
          }
        }
      });
      
      // Rotate brain hemispheres slowly
      leftMesh.rotation.y += 0.002;
      rightMesh.rotation.y -= 0.002;
      
      // Pulse lighting
      pointLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
      directionalLight.intensity = 0.6 + Math.sin(time * 1.5) * 0.1;
      
      // Animate camera for cinematic effect
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.position.y = Math.cos(time * 0.08) * 1;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };

    animate();
    console.log("Massive hive mind brain visualization complete");

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
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}