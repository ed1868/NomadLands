import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import * as THREE from "three";
import { 
  User, 
  Wallet, 
  Bot, 
  FileText, 
  DollarSign, 
  BarChart3,
  Target,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Three.js Neural Network Visualization Component
const ThreeJSNeuralNetwork = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create 500 nodes for point cloud
    const nodeCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);

    // Colorful neural network colors
    const neuralColors = [
      new THREE.Color(0x3b82f6), // blue
      new THREE.Color(0xf59e0b), // orange
      new THREE.Color(0x06b6d4), // cyan
      new THREE.Color(0x8b5cf6), // violet
      new THREE.Color(0xf97316), // orange
      new THREE.Color(0x10b981), // emerald
      new THREE.Color(0xeab308), // yellow
      new THREE.Color(0xef4444), // red
    ];

    // Generate random 3D positions and colors
    for (let i = 0; i < nodeCount; i++) {
      // Random spherical distribution
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random color from neural palette
      const color = neuralColors[Math.floor(Math.random() * neuralColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random size
      sizes[i] = 2 + Math.random() * 4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Point material with vertex colors
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    // Create point cloud
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create connections between nearby nodes
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions: number[] = [];
    const connectionColors: number[] = [];

    // Find connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
      const pos1 = new THREE.Vector3(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );

      // Connect to 2-3 nearby nodes
      const connections = Math.floor(Math.random() * 2) + 2;
      let connected = 0;

      for (let j = 0; j < nodeCount && connected < connections; j++) {
        if (i === j) continue;

        const pos2 = new THREE.Vector3(
          positions[j * 3],
          positions[j * 3 + 1],
          positions[j * 3 + 2]
        );

        const distance = pos1.distanceTo(pos2);
        if (distance < 1.5) {
          // Add connection line
          connectionPositions.push(pos1.x, pos1.y, pos1.z);
          connectionPositions.push(pos2.x, pos2.y, pos2.z);

          // Random connection color
          const connectionColor = neuralColors[Math.floor(Math.random() * neuralColors.length)];
          connectionColors.push(connectionColor.r, connectionColor.g, connectionColor.b);
          connectionColors.push(connectionColor.r, connectionColor.g, connectionColor.b);

          connected++;
        }
      }
    }

    connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
    connectionGeometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3));

    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
    });

    const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connections);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate the entire neural network
      points.rotation.y += 0.005;
      connections.rotation.y += 0.005;

      // Pulse the nodes
      const time = Date.now() * 0.001;
      const sizeAttribute = geometry.getAttribute('size') as THREE.BufferAttribute;
      for (let i = 0; i < nodeCount; i++) {
        const originalSize = 2 + Math.random() * 4;
        const pulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 1;
        sizeAttribute.setX(i, originalSize * pulse * 0.1);
      }
      sizeAttribute.needsUpdate = true;

      // Animate connection opacity for synaptic firing effect
      const opacityBase = 0.1 + Math.sin(time * 3) * 0.2;
      connectionMaterial.opacity = Math.max(0.1, opacityBase);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
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
      className="w-full h-96 bg-black rounded-lg border border-gray-800"
      style={{ minHeight: '400px' }}
    />
  );
};

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please log in to access your dashboard</p>
          <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  // Nomad Ecosystem Tab with Three.js Neural Network
  if (activeTab === 'ecosystem') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-emerald-400">Nomad Ecosystem</h1>
            <p className="text-gray-400">Real-time 3D neural network visualization of AI agent activity</p>
          </div>

          {/* Neural Network Visualization */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
                <h2 className="text-xl font-bold text-emerald-400 mb-2">Total AI Agents Running Tasks</h2>
                <div className="space-y-1 text-sm">
                  <div className="text-blue-400">500 Active Nodes</div>
                  <div className="text-orange-400">Fast Synaptic Firing</div>
                  <div className="text-cyan-400">3D Point Cloud Network</div>
                  <div className="text-gray-400">Live Activity Visualization</div>
                </div>
              </div>
              <ThreeJSNeuralNetwork />
            </div>
          </div>

          {/* Ecosystem Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-2xl font-bold text-emerald-400">247,382</div>
              <div className="text-gray-400">Total Agents</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-2xl font-bold text-blue-400">89,574</div>
              <div className="text-gray-400">Active Tasks</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-2xl font-bold text-orange-400">95.7%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-2xl font-bold text-cyan-400">$1.2M</div>
              <div className="text-gray-400">Daily Revenue</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard layout with sidebar navigation
  return (
    <div className="min-h-screen bg-black text-white" style={{
      backgroundImage: `linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #050505 50%, #0f0f0f 75%, #000000 100%)`,
      backgroundAttachment: 'fixed'
    }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 min-h-screen bg-black/50 backdrop-blur-sm border-r border-gray-800 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-emerald-400">Command Center</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'wallet' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>Wallet</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'agents' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span>My Agents</span>
            </button>

            <button
              onClick={() => setActiveTab('contracts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'contracts' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Contracts</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'fleet' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>My Fleet (beta)</span>
            </button>

            <button
              onClick={() => setActiveTab('ecosystem')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'ecosystem' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-emerald-400'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>Nomad Ecosystem</span>
            </button>
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-emerald-400">Dashboard Overview</h1>
              <p className="text-gray-400">Welcome to your AI Nomads command center.</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-emerald-400">Profile Settings</h1>
              <p className="text-gray-400">Manage your account settings and preferences.</p>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-emerald-400">Wallet Management</h1>
              <p className="text-gray-400">Connect and manage your cryptocurrency wallets.</p>
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-emerald-400">My Agents</h1>
              <p className="text-gray-400">View and manage your deployed AI agents.</p>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-emerald-400">Smart Contracts</h1>
              <p className="text-gray-400">Manage your smart contract engagements.</p>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-emerald-400">My Fleet (beta)</h1>
              <p className="text-gray-400">Build and manage enterprise agent networks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}