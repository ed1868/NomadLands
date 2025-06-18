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

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Brain geometry - creating a complex brain-like structure
    const brainGroup = new THREE.Group();

    // Create brain hemispheres
    const createHemisphere = (side: 'left' | 'right') => {
      const hemisphereGroup = new THREE.Group();
      
      // Main hemisphere shape
      const hemisphereGeometry = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI);
      const hemisphereMaterial = new THREE.MeshPhongMaterial({
        color: side === 'left' ? 0x10b981 : 0x06b6d4,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      
      const hemisphere = new THREE.Mesh(hemisphereGeometry, hemisphereMaterial);
      hemisphere.position.x = side === 'left' ? -0.6 : 0.6;
      hemisphere.rotation.y = side === 'left' ? 0 : Math.PI;
      hemisphereGroup.add(hemisphere);

      // Add neural nodes (synapses)
      for (let i = 0; i < 150; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: side === 'left' ? 0x34d399 : 0x38bdf8,
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        // Position nodes within hemisphere
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const radius = 0.8 + Math.random() * 0.4;
        
        node.position.x = radius * Math.sin(phi) * Math.cos(theta) * (side === 'left' ? -1 : 1);
        node.position.y = radius * Math.cos(phi);
        node.position.z = radius * Math.sin(phi) * Math.sin(theta);
        
        hemisphereGroup.add(node);
      }

      return hemisphereGroup;
    };

    // Add both hemispheres
    brainGroup.add(createHemisphere('left'));
    brainGroup.add(createHemisphere('right'));

    // Create neural connections (synapses)
    const connectionsMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < 100; i++) {
      const points = [];
      
      // Random start point
      const startPhi = Math.acos(2 * Math.random() - 1);
      const startTheta = 2 * Math.PI * Math.random();
      const startRadius = 0.8 + Math.random() * 0.4;
      points.push(new THREE.Vector3(
        startRadius * Math.sin(startPhi) * Math.cos(startTheta),
        startRadius * Math.cos(startPhi),
        startRadius * Math.sin(startPhi) * Math.sin(startTheta)
      ));

      // Random end point
      const endPhi = Math.acos(2 * Math.random() - 1);
      const endTheta = 2 * Math.PI * Math.random();
      const endRadius = 0.8 + Math.random() * 0.4;
      points.push(new THREE.Vector3(
        endRadius * Math.sin(endPhi) * Math.cos(endTheta),
        endRadius * Math.cos(endPhi),
        endRadius * Math.sin(endPhi) * Math.sin(endTheta)
      ));

      const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const connection = new THREE.Line(connectionGeometry, connectionsMaterial);
      brainGroup.add(connection);
    }

    // Add pulsing effect nodes for agent tasks
    const agentNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const agentGeometry = new THREE.SphereGeometry(0.05, 12, 12);
      const agentMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b35,
        transparent: true,
        opacity: 0.8
      });
      const agentNode = new THREE.Mesh(agentGeometry, agentMaterial);
      
      // Position randomly around brain
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const radius = 1.5 + Math.random() * 0.5;
      
      agentNode.position.x = radius * Math.sin(phi) * Math.cos(theta);
      agentNode.position.y = radius * Math.cos(phi);
      agentNode.position.z = radius * Math.sin(phi) * Math.sin(theta);
      
      agentNodes.push(agentNode);
      brainGroup.add(agentNode);
    }

    scene.add(brainGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate brain slowly
      brainGroup.rotation.y += 0.005;
      brainGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Animate agent nodes (pulsing)
      agentNodes.forEach((node, index) => {
        const time = Date.now() * 0.002 + index * 0.5;
        node.scale.setScalar(1 + Math.sin(time) * 0.3);
        
        // Add some orbital movement
        const originalPos = node.position.clone();
        node.position.x += Math.sin(time) * 0.1;
        node.position.z += Math.cos(time) * 0.1;
      });
      
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
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}