import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Navigation,
  Radio,
  Cpu,
  Smartphone
} from 'lucide-react';

interface DroneAgent {
  id: string;
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  speed: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'negotiating' | 'rerouting' | 'resolved';
  intent: string;
  path: { x: number; y: number; z: number }[];
  negotiationHistory: string[];
  safetyRadius: number;
  batteryLevel: number;
}

interface NegotiationEvent {
  id: string;
  timestamp: number;
  participants: string[];
  type: 'conflict_detected' | 'path_negotiation' | 'priority_exchange' | 'resolution_complete';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const DigitalTwinSimulation: React.FC = () => {
  const [drones, setDrones] = useState<DroneAgent[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [negotiations, setNegotiations] = useState<NegotiationEvent[]>([]);
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [cameraAngle, setCameraAngle] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const simulationRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize drone agents with realistic parameters
  useEffect(() => {
    const droneCount = isMobile ? 6 : 12; // Reduce drones on mobile for performance
    const initialDrones: DroneAgent[] = Array.from({ length: droneCount }, (_, i) => {
      const startX = 10 + (i % 4) * 20 + Math.random() * 10;
      const startY = 10 + Math.floor(i / 4) * 25 + Math.random() * 10;
      const startZ = 20 + Math.random() * 30;
      
      return {
        id: `DRONE-${String(i + 1).padStart(3, '0')}`,
        x: startX,
        y: startY,
        z: startZ,
        targetX: 80 - startX + Math.random() * 20,
        targetY: 80 - startY + Math.random() * 20,
        targetZ: startZ + (Math.random() - 0.5) * 20,
        speed: 0.8 + Math.random() * 1.2,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        status: 'active',
        intent: [
          'Emergency medical delivery',
          'Surveillance patrol',
          'Package delivery',
          'Infrastructure inspection',
          'Search and rescue',
          'Commercial transport'
        ][Math.floor(Math.random() * 6)],
        path: [],
        negotiationHistory: [],
        safetyRadius: 8 + Math.random() * 4,
        batteryLevel: 60 + Math.random() * 40
      };
    });
    
    setDrones(initialDrones);
  }, [isMobile]);

  // AI Negotiation Engine
  const runNegotiationCycle = () => {
    setDrones(prevDrones => {
      const updatedDrones = [...prevDrones];
      const newNegotiations: NegotiationEvent[] = [];

      // Detect conflicts and initiate negotiations
      for (let i = 0; i < updatedDrones.length; i++) {
        for (let j = i + 1; j < updatedDrones.length; j++) {
          const drone1 = updatedDrones[i];
          const drone2 = updatedDrones[j];
          
          const distance = Math.sqrt(
            Math.pow(drone1.x - drone2.x, 2) +
            Math.pow(drone1.y - drone2.y, 2) +
            Math.pow(drone1.z - drone2.z, 2)
          );

          // Predict future collision
          const futureDistance = Math.sqrt(
            Math.pow((drone1.x + drone1.speed * 5) - (drone2.x + drone2.speed * 5), 2) +
            Math.pow((drone1.y + drone1.speed * 5) - (drone2.y + drone2.speed * 5), 2) +
            Math.pow(drone1.z - drone2.z, 2)
          );

          if (futureDistance < Math.max(drone1.safetyRadius, drone2.safetyRadius) && 
              drone1.status === 'active' && drone2.status === 'active') {
            
            // Initiate negotiation
            drone1.status = 'negotiating';
            drone2.status = 'negotiating';

            newNegotiations.push({
              id: `NEG-${Date.now()}-${i}-${j}`,
              timestamp: Date.now(),
              participants: [drone1.id, drone2.id],
              type: 'conflict_detected',
              description: `Potential collision detected between ${drone1.id} and ${drone2.id}`,
              priority: drone1.priority === 'high' || drone2.priority === 'high' ? 'high' : 'medium'
            });

            // Priority-based resolution
            if (drone1.priority === 'high' && drone2.priority !== 'high') {
              // High priority drone maintains path, other reroutes
              drone2.status = 'rerouting';
              drone2.targetY += 15;
              drone2.targetZ += 10;
              
              newNegotiations.push({
                id: `RES-${Date.now()}-${j}`,
                timestamp: Date.now(),
                participants: [drone1.id, drone2.id],
                type: 'priority_exchange',
                description: `${drone1.id} (HIGH priority) maintains path, ${drone2.id} rerouting`,
                priority: 'high'
              });
            } else if (drone2.priority === 'high' && drone1.priority !== 'high') {
              drone1.status = 'rerouting';
              drone1.targetY += 15;
              drone1.targetZ += 10;
              
              newNegotiations.push({
                id: `RES-${Date.now()}-${i}`,
                timestamp: Date.now(),
                participants: [drone1.id, drone2.id],
                type: 'priority_exchange',
                description: `${drone2.id} (HIGH priority) maintains path, ${drone1.id} rerouting`,
                priority: 'high'
              });
            } else {
              // Equal priority - negotiate based on efficiency
              const drone1Distance = Math.sqrt(
                Math.pow(drone1.targetX - drone1.x, 2) + Math.pow(drone1.targetY - drone1.y, 2)
              );
              const drone2Distance = Math.sqrt(
                Math.pow(drone2.targetX - drone2.x, 2) + Math.pow(drone2.targetY - drone2.y, 2)
              );

              if (drone1Distance < drone2Distance) {
                drone2.status = 'rerouting';
                drone2.targetX += 12;
                drone2.targetZ += 8;
              } else {
                drone1.status = 'rerouting';
                drone1.targetX += 12;
                drone1.targetZ += 8;
              }

              newNegotiations.push({
                id: `RES-${Date.now()}-EFF`,
                timestamp: Date.now(),
                participants: [drone1.id, drone2.id],
                type: 'path_negotiation',
                description: `Efficiency-based path negotiation completed`,
                priority: 'medium'
              });
            }
          }
        }
      }

      // Move drones towards targets
      updatedDrones.forEach(drone => {
        const dx = drone.targetX - drone.x;
        const dy = drone.targetY - drone.y;
        const dz = drone.targetZ - drone.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance > 2) {
          const moveX = (dx / distance) * drone.speed;
          const moveY = (dy / distance) * drone.speed;
          const moveZ = (dz / distance) * drone.speed * 0.5; // Slower Z movement

          drone.x += moveX;
          drone.y += moveY;
          drone.z += moveZ;

          // Update path history
          drone.path.push({ x: drone.x, y: drone.y, z: drone.z });
          if (drone.path.length > 20) {
            drone.path.shift();
          }
        } else {
          // Reached target - set new random target
          drone.targetX = 20 + Math.random() * 60;
          drone.targetY = 20 + Math.random() * 60;
          drone.targetZ = 15 + Math.random() * 40;
          drone.status = 'active';
          
          newNegotiations.push({
            id: `COMPLETE-${Date.now()}-${drone.id}`,
            timestamp: Date.now(),
            participants: [drone.id],
            type: 'resolution_complete',
            description: `${drone.id} reached destination, selecting new target`,
            priority: 'low'
          });
        }

        // Simulate battery drain
        drone.batteryLevel = Math.max(0, drone.batteryLevel - 0.1);
      });

      // Add new negotiations
      if (newNegotiations.length > 0) {
        setNegotiations(prev => [...newNegotiations, ...prev].slice(0, 50));
      }

      return updatedDrones;
    });
  };

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        runNegotiationCycle();
        animationRef.current = requestAnimationFrame(() => {
          setTimeout(animate, 100); // 10 FPS for smooth but not overwhelming updates
        });
      };
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  // Mouse interaction for camera control
  const handleMouseMove = (e: React.MouseEvent) => {
    if (simulationRef.current && !isMobile) {
      const rect = simulationRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setCameraAngle({ x, y });
    }
  };

  // Touch interaction for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (simulationRef.current && isMobile && e.touches.length === 1) {
      const rect = simulationRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 10; // Reduced sensitivity
      const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 10;
      setCameraAngle({ x, y });
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'negotiating': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'rerouting': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'resolved': return 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-full h-full bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700/30 overflow-hidden">
      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-700/30 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Digital Twin Airspace</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs sm:text-sm">Live AI Negotiation</span>
            {isMobile && <Smartphone className="w-4 h-4 text-cyan-400" />}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-lg border transition-all duration-300 ${
              isRunning 
                ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => {
              setDrones([]);
              setNegotiations([]);
              setTimeout(() => window.location.reload(), 100);
            }}
            className="p-2 rounded-lg border bg-gray-500/20 border-gray-500/30 text-gray-400 hover:bg-gray-500/30 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} ${isMobile ? 'h-auto' : 'h-96'}`}>
        {/* 3D Simulation Viewport */}
        <div className="flex-1 relative">
          <div
            ref={simulationRef}
            className={`w-full ${isMobile ? 'h-64' : 'h-full'} relative overflow-hidden ${isMobile ? 'cursor-default' : 'cursor-move'}`}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            style={{ perspective: '1000px' }}
          >
            {/* 3D Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: isMobile ? '15px 15px' : '20px 20px',
                transform: `rotateX(${60 + cameraAngle.y}deg) rotateY(${cameraAngle.x}deg) scale(${zoom})`
              }}
            />

            {/* Safety Corridors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="corridorGradient">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Dynamic safety corridors */}
              {drones.map((drone, i) => (
                <g key={`corridor-${drone.id}`}>
                  <circle
                    cx={`${(drone.x / 100) * 100}%`}
                    cy={`${(drone.y / 100) * 100}%`}
                    r={drone.safetyRadius}
                    fill="url(#corridorGradient)"
                    className="animate-pulse"
                  />
                  
                  {/* Flight path prediction */}
                  <line
                    x1={`${(drone.x / 100) * 100}%`}
                    y1={`${(drone.y / 100) * 100}%`}
                    x2={`${(drone.targetX / 100) * 100}%`}
                    y2={`${(drone.targetY / 100) * 100}%`}
                    stroke={
                      drone.priority === 'high' ? '#ef4444' :
                      drone.priority === 'medium' ? '#f59e0b' : '#10b981'
                    }
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                    opacity="0.6"
                  />
                </g>
              ))}
            </svg>

            {/* 3D Drone Agents */}
            {drones.map((drone) => (
              <div
                key={drone.id}
                className={`absolute transition-all duration-300 cursor-pointer group ${
                  selectedDrone === drone.id ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${(drone.x / 100) * 100}%`,
                  top: `${(drone.y / 100) * 100}%`,
                  transform: `
                    translate(-50%, -50%) 
                    translateZ(${drone.z}px) 
                    rotateX(${cameraAngle.y * 0.5}deg) 
                    rotateY(${cameraAngle.x * 0.5}deg)
                    scale(${zoom})
                  `
                }}
                onClick={() => setSelectedDrone(selectedDrone === drone.id ? null : drone.id)}
              >
                {/* Drone Body */}
                <div className={`relative w-6 h-6 rounded-full transition-all duration-300 ${
                  drone.status === 'active' ? 'bg-green-400 shadow-green-400' :
                  drone.status === 'negotiating' ? 'bg-yellow-400 shadow-yellow-400' :
                  drone.status === 'rerouting' ? 'bg-orange-400 shadow-orange-400' :
                  'bg-cyan-400 shadow-cyan-400'
                } group-hover:scale-125`}
                style={{
                  boxShadow: `0 0 20px currentColor`,
                  animation: drone.status === 'negotiating' ? 'pulse 1s infinite' : 'none'
                }}>
                  {/* Priority indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                    drone.priority === 'high' ? 'bg-red-400' :
                    drone.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  
                  {/* Status indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {drone.status === 'negotiating' && <Radio className="w-3 h-3 text-gray-900 animate-spin" />}
                    {drone.status === 'rerouting' && <Navigation className="w-3 h-3 text-gray-900" />}
                    {drone.status === 'active' && <CheckCircle className="w-3 h-3 text-gray-900" />}
                  </div>
                </div>

                {/* Drone Info Tooltip */}
                {selectedDrone === drone.id && (
                  <div className={`absolute ${isMobile ? 'bottom-6 left-0 right-0 mx-2' : 'bottom-8 left-1/2 transform -translate-x-1/2'} bg-gray-800/95 backdrop-blur-lg border border-gray-700/50 rounded-lg p-3 ${isMobile ? 'w-auto' : 'min-w-48'} z-30`}>
                    <div className="text-white text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{drone.id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(drone.status)}`}>
                          {drone.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-300 text-xs space-y-1">
                        <div>Intent: {drone.intent}</div>
                        <div>Priority: <span className={getPriorityColor(drone.priority)}>{drone.priority.toUpperCase()}</span></div>
                        <div className="flex justify-between">
                          <span>Speed: {drone.speed.toFixed(1)} m/s</span>
                          <span>Battery: {drone.batteryLevel.toFixed(0)}%</span>
                        </div>
                        {!isMobile && <div>Position: ({drone.x.toFixed(0)}, {drone.y.toFixed(0)}, {drone.z.toFixed(0)})</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Flight Trail */}
                {drone.path.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '400px', height: '400px', left: '-200px', top: '-200px' }}>
                    <path
                      d={`M ${drone.path.map((p, i) => `${(p.x - drone.x + 200)} ${(p.y - drone.y + 200)}`).join(' L ')}`}
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                  </svg>
                )}
              </div>
            ))}

            {/* Negotiation Visualization */}
            {negotiations.slice(0, 3).map((negotiation, i) => (
              <div
                key={negotiation.id}
                className={`absolute ${isMobile ? 'top-2 left-2 right-2' : 'top-4 right-4'} bg-gray-800/90 backdrop-blur-lg border border-yellow-500/30 rounded-lg p-2 animate-fade-in-up`}
                style={{ top: isMobile ? `${8 + i * 50}px` : `${16 + i * 60}px` }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-yellow-400 text-xs font-semibold">
                    {negotiation.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className={`text-gray-300 text-xs mt-1 ${isMobile ? 'max-w-full' : 'max-w-48'}`}>
                  {negotiation.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Negotiation Feed */}
        <div className={`${isMobile ? 'w-full border-t' : 'w-80 border-l'} border-gray-700/30 bg-gray-800/30`}>
          <div className="p-4 border-b border-gray-700/30">
            <h4 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>AI Negotiation Log</span>
            </h4>
          </div>
          
          <div className={`${isMobile ? 'h-48' : 'h-80'} overflow-y-auto p-4 space-y-3`}>
            {negotiations.map((negotiation) => (
              <div
                key={negotiation.id}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  negotiation.priority === 'high' ? 'bg-red-500/10 border-red-500/30' :
                  negotiation.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${
                    negotiation.priority === 'high' ? 'text-red-400' :
                    negotiation.priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {negotiation.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(negotiation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-gray-300 text-xs mb-2">
                  {negotiation.description}
                </p>
                
                {negotiation.participants.length > 1 && (
                  <div className="flex flex-wrap gap-1">
                    {negotiation.participants.map((participant) => (
                      <span
                        key={participant}
                        className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {negotiations.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for negotiations...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row items-center justify-between'} p-4 border-t border-gray-700/30 bg-gray-800/20`}>
        <div className={`flex items-center ${isMobile ? 'justify-center space-x-4' : 'space-x-6'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span className="text-green-400 text-sm">Active: {drones.filter(d => d.status === 'active').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm">Negotiating: {drones.filter(d => d.status === 'negotiating').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full" />
            <span className="text-orange-400 text-sm">Rerouting: {drones.filter(d => d.status === 'rerouting').length}</span>
          </div>
        </div>
        
        <div className={`text-gray-400 text-sm ${isMobile ? 'text-center' : ''}`}>
          Total Negotiations: {negotiations.length} | Conflicts Resolved: {negotiations.filter(n => n.type === 'resolution_complete').length}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinSimulation;