import React, { useEffect, useState } from 'react';
import DigitalTwinSimulation from './components/DigitalTwinSimulation';
import AnimatedCursor from './components/AnimatedCursor';
import { Zap, Shield, Globe, Brain, Lock, Eye, ChevronDown, Play, Users, MapPin, Cpu, PenTool, Satellite, Radar, Github, Linkedin, Mail, Menu, X, Calendar, Clock, User, MessageSquare, HelpCircle, ChevronRight, Send, Phone, MapPin as MapPinIcon, Plus, Minus, Network } from 'lucide-react';

interface Drone {
  id: string;
  x: number;
  y: number;
  direction: number;
  speed: number;
  status: 'active' | 'negotiating' | 'resolved';
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize drones
    const initialDrones: Drone[] = Array.from({ length: 8 }, (_, i) => ({
      id: `drone-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      direction: Math.random() * 360,
      speed: 0.5 + Math.random() * 1.5,
      status: ['active', 'negotiating', 'resolved'][Math.floor(Math.random() * 3)] as any
    }));
    setDrones(initialDrones);

    // Animate drones
    const animateDrones = () => {
      setDrones(prev => prev.map(drone => ({
        ...drone,
        x: (drone.x + Math.cos(drone.direction * Math.PI / 180) * drone.speed) % 100,
        y: (drone.y + Math.sin(drone.direction * Math.PI / 180) * drone.speed) % 100,
        direction: drone.direction + (Math.random() - 0.5) * 2
      })));
    };

    const droneInterval = setInterval(animateDrones, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(droneInterval);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      {/* 3D Animated Cursor */}
      <AnimatedCursor />
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: isMobile ? 20 : 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Flying Drones */}
        <div className="absolute inset-0">
          {drones.map((drone) => (
            <div
              key={drone.id}
              className={`absolute w-3 h-3 transition-all duration-100 ${
                drone.status === 'active' ? 'bg-green-400' : 
                drone.status === 'negotiating' ? 'bg-yellow-400' : 
                'bg-cyan-400'
              } rounded-full shadow-lg`}
              style={{
                left: `${drone.x}%`,
                top: `${drone.y}%`,
                boxShadow: `0 0 10px ${
                  drone.status === 'active' ? '#10b981' : 
                  drone.status === 'negotiating' ? '#f59e0b' : 
                  '#06b6d4'
                }`,
                transform: `rotate(${drone.direction}deg) translate(-50%, -50%)`
              }}
            >
              <div className="absolute inset-0 animate-ping opacity-75 rounded-full bg-current" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SwarmSync
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Problem', 'Solution', 'Simulation', 'Impact', 'Blog', 'FAQ', 'Team', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group"
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-cyan-500/20">
              <div className="flex flex-col space-y-4 p-6">
                {['Home', 'Problem', 'Solution', 'Simulation', 'Impact', 'Blog', 'FAQ', 'Team', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase());
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                SwarmSync
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl md:text-3xl mb-4 text-gray-300 animate-fade-in-up animation-delay-200">
              The Future of Drone Airspace Management
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up animation-delay-400">
              <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400">
                Decentralized
              </span>
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400">
                Secure
              </span>
              <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
                Scalable
              </span>
            </div>
            
            <button 
              onClick={() => scrollToSection('simulation')}
              className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-600"
            >
              <span className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>See Live Simulation</span>
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                The Airspace Crisis
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-red-400">Collision Risks</h3>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Uncoordinated drone flights create dangerous mid-air collision scenarios in shared airspace.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-orange-400">Restricted Zones</h3>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Complex no-fly zones and regulatory boundaries make navigation increasingly difficult.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/40 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Network className="w-6 h-6 text-yellow-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-yellow-400">Scalability Issues</h3>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Current centralized systems can't handle the exponential growth of drone operations.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8">
                  <div className="relative h-60 sm:h-80 overflow-hidden rounded-2xl">
                    {/* Chaotic drone simulation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20">
                      {Array.from({ length: isMobile ? 8 : 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-red-400 rounded-full animate-ping"
                          style={{
                            left: `${20 + (i % 4) * 20}%`,
                            top: `${20 + Math.floor(i / 4) * 20}%`,
                            animationDelay: `${i * 200}ms`
                          }}
                        />
                      ))}
                      
                      {/* Collision warning lines */}
                      <svg className="absolute inset-0 w-full h-full">
                        <defs>
                          <linearGradient id="warningGradient">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <line
                            key={i}
                            x1={`${Math.random() * 100}%`}
                            y1={`${Math.random() * 100}%`}
                            x2={`${Math.random() * 100}%`}
                            y2={`${Math.random() * 100}%`}
                            stroke="url(#warningGradient)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        ))}
                      </svg>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-lg px-4 py-2">
                        <span className="text-red-400 font-semibold">COLLISION ALERT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                How SwarmSync Works
              </span>
            </h2>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: Radar, title: 'Broadcast', desc: 'Drones announce their position and intended path', color: 'cyan' },
                { icon: Brain, title: 'Negotiate', desc: 'AI algorithms resolve conflicts and optimize routes', color: 'purple' },
                { icon: Lock, title: 'Validate', desc: 'Blockchain ensures secure, tamper-proof agreements', color: 'green' },
                { icon: Eye, title: 'Navigate', desc: 'Drones follow safe, optimized flight paths', color: 'blue' }
              ].map((step, i) => (
                <div key={i} className={`bg-gray-800/50 backdrop-blur-lg border border-${step.color}-500/20 rounded-2xl p-6 hover:border-${step.color}-500/40 transition-all duration-300 transform hover:scale-105`}>
                  <div className={`w-16 h-16 bg-${step.color}-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-400`} />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-semibold text-${step.color}-400 text-center mb-2`}>{step.title}</h3>
                  <p className="text-gray-300 text-center text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Solution Visualization */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8">
              <div className="relative h-60 sm:h-96 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-green-900/20">
                  {/* Organized drone paths */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="pathGradient">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    
                    {/* Flight paths */}
                    {Array.from({ length: 4 }).map((_, i) => (
                      <path
                        key={i}
                        d={`M ${20 + i * 15} 20 Q ${50 + i * 10} ${50 + i * 20} ${80 + i * 5} 80`}
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 500}ms` }}
                      />
                    ))}
                  </svg>
                  
                  {/* Organized drones */}
                  {Array.from({ length: isMobile ? 6 : 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"
                      style={{
                        left: `${15 + i * 10}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        boxShadow: '0 0 15px #10b981',
                        animationDelay: `${i * 300}ms`
                      }}
                    />
                  ))}
                </div>
                
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-lg px-4 py-2">
                    <span className="text-green-400 font-semibold">SAFE NAVIGATION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Simulation Section */}
      <section id="simulation" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🌍 Digital Twin Airspace Simulation
              </span>
            </h2>
            
            <div className="mb-8 text-center">
              <p className="text-lg sm:text-xl text-gray-300 mb-4">
                Watch AI-powered drones negotiate flight paths in real-time
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400">
                  Live Multi-Agent Negotiation
                </span>
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400">
                  Dynamic Path Rerouting
                </span>
                <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
                  Priority-Based Resolution
                </span>
              </div>
            </div>
            
            <div className={`${isMobile ? 'h-auto' : 'h-[600px]'}`}>
              <DigitalTwinSimulation />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-xs sm:text-sm">
                🎮 {isMobile ? 'Tap' : 'Click'} on drones to see detailed information • {isMobile ? '👆 Touch to adjust camera' : '🖱️ Move mouse to adjust camera angle'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Impact & Future
              </span>
            </h2>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: 'Defence & Security',
                  desc: 'Coordinated surveillance and tactical operations with zero conflicts',
                  icon: Shield,
                  gradient: 'from-red-400 to-orange-400'
                },
                {
                  title: 'Urban Mobility',
                  desc: 'Safe passenger drone corridors above smart cities',
                  icon: Globe,
                  gradient: 'from-cyan-400 to-blue-400'
                },
                {
                  title: 'Commercial Delivery',
                  desc: 'Optimized delivery routes with maximum throughput',
                  icon: Zap,
                  gradient: 'from-green-400 to-emerald-400'
                }
              ].map((impact, i) => (
                <div key={i} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 transform hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${impact.gradient} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <impact.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-4">{impact.title}</h3>
                  <p className="text-gray-300 text-center text-sm sm:text-base">{impact.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Future vision animation */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8">
              <div className="relative h-60 sm:h-80 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20">
                  {/* Future cityscape silhouette */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent" />
                  
                  {/* Hundreds of organized drones */}
                  {Array.from({ length: isMobile ? 25 : 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 70}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1 + Math.random()}s`
                      }}
                    />
                  ))}
                  
                  {/* Flight corridors */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="corridorGradient">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    
                    {Array.from({ length: 8 }).map((_, i) => (
                      <path
                        key={i}
                        d={`M 0 ${20 + i * 10} Q ${50 + i * 5} ${30 + i * 8} 100 ${25 + i * 12}`}
                        stroke="url(#corridorGradient)"
                        strokeWidth="2"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </svg>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                      Safe Skies for Everyone
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                        10,000+ Drones
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm">
                        Zero Collisions
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                        Global Scale
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Latest Insights
              </span>
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'The Future of Autonomous Airspace',
                  excerpt: 'Exploring how AI-driven drone coordination will reshape urban mobility and defense operations.',
                  author: 'Dr. Alex Chen',
                  date: '2025-09-15',
                  readTime: '5 min read',
                  category: 'Technology',
                  image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=400'
                },
                {
                  title: 'Blockchain in Drone Traffic Management',
                  excerpt: 'How distributed ledger technology ensures secure and transparent flight path negotiations.',
                  author: 'Sarah Martinez',
                  date: '2025-08-12',
                  readTime: '7 min read',
                  category: 'Blockchain',
                  image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
                },
                {
                  title: 'Multi-Agent AI Negotiation Protocols',
                  excerpt: 'Deep dive into the algorithms that enable real-time conflict resolution between autonomous drones.',
                  author: 'Michael Kim',
                  date: '2025-07-23',
                  readTime: '6 min read',
                  category: 'AI Research',
                  image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400'
                }
              ].map((post, i) => (
                <article
                  key={i}
                  className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all duration-500 transform hover:scale-105"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center space-x-2">
                  <PenTool className="w-5 h-5" />
                  <span>View All Posts</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      

      {/* FAQ Section */}
      <section id="faq" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  question: 'How does SwarmSync prevent drone collisions in real-time?',
                  answer: 'SwarmSync uses advanced AI algorithms to predict potential conflicts up to 30 seconds in advance. Each drone broadcasts its intended path, and our negotiation engine automatically reroutes conflicting drones based on priority levels, mission criticality, and efficiency metrics. The entire process happens in milliseconds through our decentralized blockchain network.'
                },
                {
                  question: 'What makes SwarmSync different from traditional air traffic control?',
                  answer: 'Unlike centralized air traffic control systems, SwarmSync operates on a decentralized peer-to-peer network. Drones negotiate directly with each other using AI agents, eliminating single points of failure. This approach scales infinitely and works even in areas without traditional infrastructure, making it perfect for military operations, disaster response, and remote deliveries.'
                },
                {
                  question: 'Can SwarmSync handle thousands of drones simultaneously?',
                  answer: 'Yes! Our system is designed for massive scalability. In testing, we\'ve successfully coordinated over 10,000 virtual drones simultaneously. The decentralized architecture means performance actually improves as more drones join the network, as each drone contributes to the collective intelligence of the swarm.'
                },
                {
                  question: 'How secure is the blockchain-based negotiation system?',
                  answer: 'SwarmSync uses enterprise-grade Hyperledger Fabric blockchain with military-grade encryption. Every negotiation is cryptographically signed and immutable, creating a complete audit trail. The system is resistant to spoofing, jamming, and cyber attacks, making it suitable for defense and critical infrastructure applications.'
                },
                {
                  question: 'What types of drones and missions does SwarmSync support?',
                  answer: 'SwarmSync is mission-agnostic and supports all drone types - from small delivery drones to large military UAVs. The system handles various mission priorities including emergency medical deliveries (highest priority), defense operations, commercial deliveries, surveillance, and recreational flights. Priority levels ensure critical missions always have right-of-way.'
                },
                {
                  question: 'How do I integrate SwarmSync with existing drone systems?',
                  answer: 'SwarmSync provides RESTful APIs and SDKs for major drone platforms including DJI, Parrot, and custom military systems. Integration typically takes 2-4 weeks and includes our AI negotiation module, blockchain client, and real-time visualization dashboard. Our team provides full technical support during deployment.'
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/20 transition-colors duration-300"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center transition-transform duration-300 ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}>
                      {expandedFaq === i ? (
                        <Minus className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Plus className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFaq === i && (
                    <div className="px-6 pb-6 animate-fade-in-up">
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">Still have questions?</p>
              <button 
                onClick={() => scrollToSection('contact')}
                className="group bg-gradient-to-r from-purple-500 to-green-600 hover:from-purple-600 hover:to-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Contact Our Team</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
<section id="team" className="relative py-20 z-10">
  <div className="container mx-auto px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Team & Credits
        </span>
      </h2>

      {/* Flex layout for centering */}
      <div className="flex flex-wrap justify-center gap-8">
        {[
          {
            name: 'Disha Katkade',
            role: 'Full Stack Developer',
            specialty: '& AI Engineer',
            github: 'https://github.com/yourgithub-disha',
            linkedin: 'https://linkedin.com/in/yourlinkedin-disha',
            email: 'dishakatkade22@gmail.com',
          },
          {
            name: 'Jayesh Muley',
            role: 'Full Stack Developer',
            specialty: '& Blockchain Architect',
            github: 'https://github.com/jayesh3103',
            linkedin: 'https://www.linkedin.com/in/mr-jayeshmuley',
            email: 'jayeshmuley31@gmail.com',
          },
        ].map((member, i) => (
          <div
            key={i}
            className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl p-6 sm:p-8 hover:border-purple-500/40 transition-all duration-500 transform hover:scale-105 hover:rotate-y-12 w-full sm:w-[300px] md:w-[320px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:animate-spin">
                <Users className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
                {member.name}
              </h3>
              <p className="text-purple-400 text-center mb-2">{member.role}</p>
              <p className="text-gray-300 text-center text-sm">
                {member.specialty}
              </p>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>

                <a href={`mailto:${member.email}`}>
                  <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Send className="w-6 h-6 text-cyan-400" />
                  <span>Send us a message</span>
                </h3>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="email@company.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      placeholder="Company Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                      placeholder="Tell us ...."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Send Message</span>
                    </span>
                  </button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Email</h4>
                        <p className="text-gray-300">contact@swarmsync.ai</p>
                        <p className="text-gray-300">partnerships@swarmsync.ai</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Phone</h4>
                        <p className="text-gray-300">+91 9876543210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Location</h4>
                        <p className="text-gray-300">
                          VIT Bhopal University<br />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Quick Links</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Documentation', icon: HelpCircle },
                      { name: 'API Reference', icon: Cpu },
                      { name: 'Support Portal', icon: MessageSquare },
                      { name: 'Developer Tools', icon: PenTool }
                    ].map((link, i) => (
                      <button
                        key={i}
                        className="flex items-center space-x-2 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all duration-300 text-gray-300 hover:text-white group"
                      >
                        <link.icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                        <span className="text-sm">{link.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Business Hours */}
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 z-10 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Animated flight path line across footer */}
            <div className="relative mb-8">
              <svg className="w-full h-2">
                <defs>
                  <linearGradient id="footerGradient">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 1 Q 25 1 50 1 Q 75 1 100 1"
                  stroke="url(#footerGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  SwarmSync
                </span>
              </div>
              
              <p className="text-gray-400 mb-6">
                Revolutionizing drone airspace management through decentralized coordination
              </p>
              
              {/* Social media as glowing orbs */}
              <div className="flex justify-center space-x-6 mb-8">
                {[Github, Linkedin, Mail].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500/60 cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-6 h-6 text-cyan-400 hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
              
              <p className="text-gray-500 text-sm">
                © 2025 SwarmSync. Built for the future of autonomous flight.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;