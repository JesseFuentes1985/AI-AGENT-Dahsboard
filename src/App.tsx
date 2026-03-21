/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard,
  Cpu, 
  Activity, 
  Shield, 
  Zap, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  Terminal,
  Database,
  Globe,
  MoreVertical,
  Play,
  Square,
  RefreshCw,
  Waves,
  Mic2,
  Volume2,
  Layers,
  Share2,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Power,
  Brain,
  Bot,
  Network,
  Dna,
  Binary,
  Eye,
  Lock,
  MessageSquare,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type AgentStatus = 'active' | 'idle' | 'error';
interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  icon: any;
}

// --- Components ---

const RadarChart = () => {
  const points = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      color: ['#00f2ff', '#ff007a', '#ccff00', '#ff9900', '#00ff7f', '#ffffff', '#7a00ff'][Math.floor(Math.random() * 7)]
    }));
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[450px] mx-auto">
      <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-[100px] opacity-20" />
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,242,255,0.05)]">
        {/* Background Heptagon Grid */}
        {[1, 0.8, 0.6, 0.4, 0.2].map((scale, i) => {
          const sides = 7;
          const radius = 45 * scale;
          const pointsStr = Array.from({ length: sides }).map((_, j) => {
            const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
            return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={pointsStr}
              className="radar-grid"
              style={{ opacity: 1 - i * 0.15 }}
            />
          );
        })}
        
        {/* Axis Lines */}
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
          return (
            <line 
              key={i}
              x1="50" y1="50" 
              x2={50 + 45 * Math.cos(angle)} 
              y2={50 + 45 * Math.sin(angle)} 
              className="radar-grid" 
              opacity="0.3"
            />
          );
        })}

        {/* Data Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.2"
            fill={p.color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.6, 1, 0.6], scale: 1 }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            className="drop-shadow-[0_0_4px_currentColor]"
          />
        ))}
      </svg>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Reasoning</div>
      <div className="absolute top-1/4 right-2 text-[7px] font-black text-zinc-700 uppercase tracking-widest">Speed</div>
      <div className="absolute bottom-1/4 right-2 text-[7px] font-black text-zinc-700 uppercase tracking-widest">Accuracy</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-black text-zinc-700 uppercase tracking-widest">Memory</div>
      <div className="absolute bottom-1/4 left-2 text-[7px] font-black text-zinc-700 uppercase tracking-widest">Creativity</div>
      <div className="absolute top-1/4 left-2 text-[7px] font-black text-zinc-700 uppercase tracking-widest">Reliability</div>
    </div>
  );
};

interface AgentCardProps {
  key?: string;
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
}

const AgentCard = ({ agent, isActive, onClick }: AgentCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`hardware-card p-3 rounded-sm cursor-pointer flex flex-col justify-between h-20 relative overflow-hidden group ${isActive ? 'active' : ''}`}
  >
    <div className="flex flex-col">
      <h4 className={`text-[11px] font-bold truncate leading-tight ${isActive ? 'text-cyan-400' : 'text-zinc-300'}`}>{agent.name}</h4>
      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">{agent.role}</span>
    </div>
    
    <div className="flex justify-between items-center">
      <div className="opacity-10 group-hover:opacity-30 transition-opacity">
        <agent.icon size={14} />
      </div>
      <div className={`w-1 h-1 rounded-full ${agent.status === 'active' ? 'bg-cyan-400 shadow-[0_0_5px_#00f2ff]' : 'bg-zinc-800'}`} />
    </div>
    
    {isActive && (
      <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 -mr-4 -mt-4 rotate-45" />
    )}
  </motion.div>
);

export default function App() {
  const [activeAgentId, setActiveAgentId] = useState('1138');
  const [activeTab, setActiveTab] = useState('NEURAL');

  const agents: Agent[] = [
    { id: '1138', name: 'Nexus Prime', role: 'CORE LOGIC', status: 'active', icon: Brain },
    { id: '0042', name: 'Sentinel Alpha', role: 'SECURITY', status: 'active', icon: Shield },
    { id: '0901', name: 'Oracle V2', role: 'PREDICTION', status: 'idle', icon: Eye },
    { id: '2231', name: 'Cipher X', role: 'ENCRYPTION', status: 'active', icon: Lock },
    { id: '4412', name: 'Linguist 7', role: 'NLP ENGINE', status: 'idle', icon: MessageSquare },
    { id: '5561', name: 'Swarm Node', role: 'DISTRIBUTED', status: 'active', icon: Network },
    { id: '6672', name: 'Bio-Link', role: 'GENETIC AI', status: 'active', icon: Dna },
    { id: '7783', name: 'Data Miner', role: 'EXTRACTION', status: 'idle', icon: Database },
    { id: '8894', name: 'Logic Gate', role: 'REASONING', status: 'active', icon: Binary },
    { id: '9905', name: 'Visionary', role: 'IMAGE GEN', status: 'active', icon: Eye },
    { id: '1016', name: 'Archivist', role: 'MEMORY', status: 'idle', icon: HardDrive },
    { id: '1127', name: 'Accelerator', role: 'COMPUTE', status: 'active', icon: Zap },
  ];

  const tabs = [
    { name: 'NEURAL', icon: Brain },
    { name: 'LOGIC', icon: Binary },
    { name: 'MEMORY', icon: HardDrive },
    { name: 'IO', icon: RefreshCw },
    { name: 'SECURITY', icon: Shield },
    { name: 'SWARM', icon: Network },
    { name: 'TRAINING', icon: Activity },
    { name: 'MODELS', icon: Layers },
    { name: 'CONFIG', icon: Settings },
    { name: 'NODES', icon: Globe }
  ];

  return (
    <div className="h-screen flex flex-col hardware-surface select-none">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-black/40 relative z-50">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter italic leading-none">NEURAL<span className="text-cyan-400">CORE</span></h1>
            <span className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-0.5">AGENTIC OPERATING SYSTEM</span>
          </div>
          
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-white/5">
            <button className="px-5 py-1.5 text-[9px] font-black bg-zinc-800 rounded-sm text-white flex items-center gap-2 shadow-inner">
              <Terminal size={10} />
              CONSOLE
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          {tabs.map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`nav-tab flex flex-col items-center gap-1 text-[8px] font-black tracking-widest px-2 py-2 transition-all ${activeTab === tab.name ? 'text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <tab.icon size={12} className={activeTab === tab.name ? 'text-cyan-400' : 'text-zinc-700'} />
              {tab.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded border border-white/5">
            <span className="text-[9px] font-mono text-zinc-600">LOAD</span>
            <span className="text-[9px] font-mono text-cyan-400 font-bold">42.8%</span>
          </div>
          <button className="p-2 text-zinc-600 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Agent Grid */}
        <section className="w-[55%] border-r border-white/5 flex flex-col p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-black font-mono text-zinc-300 tracking-tighter">{activeAgentId}</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Fleet</span>
                  <ChevronDown size={10} className="text-zinc-700" />
                </div>
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Role</span>
                  <ChevronDown size={10} className="text-zinc-700" />
                </div>
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Status</span>
                  <ChevronDown size={10} className="text-zinc-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-4 gap-4 content-start custom-scrollbar">
            {agents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                isActive={activeAgentId === agent.id}
                onClick={() => setActiveAgentId(agent.id)}
              />
            ))}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="hardware-card border-dashed border-white/5 rounded-sm flex items-center justify-center h-20 text-zinc-700 hover:text-zinc-500 hover:border-white/10 cursor-pointer transition-all"
            >
              <Plus size={20} />
            </motion.div>
          </div>
        </section>

        {/* Right Panel: Visualization & Controls */}
        <section className="flex-1 flex flex-col p-10 bg-black/10 relative">
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent opacity-30 pointer-events-none" />
          <div className="flex-1 flex flex-col items-center justify-center gap-16 relative z-10">
            <RadarChart />
            
            <div className="w-full max-w-[320px] space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-sm border border-white/5 group hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500">REASONING</span>
                  <Power size={12} className="text-cyan-500 shadow-[0_0_5px_#00f2ff]" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-600">Depth: 84%</span>
                  <ChevronRight size={10} className="text-zinc-700" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-sm border border-white/5 group hover:border-pink-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500">CONTEXT</span>
                  <Power size={12} className="text-pink-500 shadow-[0_0_5px_#ff007a]" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-600">128k Tokens</span>
                  <ChevronRight size={10} className="text-zinc-700" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-sm border border-white/5 group hover:border-lime-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500">CREATIVITY</span>
                  <Power size={12} className="text-lime-500 shadow-[0_0_5px_#ccff00]" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-600">Temp: 0.7</span>
                  <ChevronRight size={10} className="text-zinc-700" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Control Deck */}
      <footer className="h-36 border-t border-white/10 bg-black/80 flex p-4 gap-6 relative z-50">
        <div className="w-48 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            <Activity size={14} />
            COMPUTE LOAD
          </div>
          <div className="flex-1 flex gap-4">
            <div className="w-2 h-full bg-black rounded-sm relative overflow-hidden border border-white/5">
              <div className="absolute bottom-0 left-0 w-full bg-cyan-500 h-[65%] shadow-inner" />
              <div className="absolute bottom-[65%] left-0 w-full h-1 bg-white shadow-[0_0_10px_#fff]" />
            </div>
            <div className="w-2 h-full bg-black rounded-sm relative overflow-hidden border border-white/5">
              <div className="absolute bottom-0 left-0 w-full bg-cyan-500 h-[45%] shadow-inner" />
              <div className="absolute bottom-[45%] left-0 w-full h-1 bg-white shadow-[0_0_10px_#fff]" />
            </div>
            <div className="flex-1 flex flex-col justify-between text-[8px] font-mono text-zinc-700">
              <span>MAX</span>
              <span>MIN</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-black/40 p-1 rounded border border-white/5">
              {['ACTIVITY', 'TRAFFIC', 'LATENCY', 'MEMORY', 'SECURITY'].map(m => (
                <button key={m} className={`text-[8px] font-black tracking-widest px-3 py-1 rounded-sm transition-all ${m === 'ACTIVITY' ? 'bg-zinc-800 text-cyan-400 shadow-inner' : 'text-zinc-600 hover:text-zinc-400'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-zinc-600 tracking-widest">0.85</span>
                <span className="text-[8px] font-black text-zinc-400 tracking-widest">TEMP</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-black border border-white/5 relative flex items-center justify-center">
                <div className="absolute inset-1 rounded-full border border-white/5" />
                <div className="w-0.5 h-3 bg-cyan-500 rounded-full -mt-3 shadow-[0_0_10px_#00f2ff]" style={{ transform: 'rotate(45deg)', transformOrigin: 'bottom center' }} />
              </div>
            </div>
          </div>

          {/* Neural Activity Stream */}
          <div className="flex-1 bg-black/60 rounded-sm border border-white/5 p-3 flex items-center gap-1 relative overflow-hidden">
             <div className="absolute top-1 left-3 flex gap-4 text-[7px] font-mono text-zinc-700">
                <span>NEURAL ACTIVITY STREAM</span>
             </div>
             <div className="flex-1 h-full flex items-end gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => {
                  const height = Math.random() * 80 + 10;
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.02 }}
                      className={`flex-1 rounded-t-sm bg-cyan-500/20 border-t border-cyan-500/50 shadow-[0_0_10px_rgba(0,242,255,0.1)]`} 
                    />
                  );
                })}
             </div>
          </div>
        </div>

        <div className="w-64 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            <span>Swarm Topology</span>
            <Maximize2 size={10} className="text-zinc-700 cursor-pointer hover:text-zinc-400" />
          </div>
          <div className="flex-1 bg-black/60 rounded-sm border border-white/5 p-2 flex items-center justify-center relative group cursor-pointer">
             <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-24 h-24 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
                  <polygon points="50,5 93.3,30 93.3,70 50,95 6.7,70 6.7,30" className="radar-grid" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="2.5" fill="#00f2ff" className="drop-shadow-[0_0_5px_#00f2ff]" />
                  <circle cx="35" cy="45" r="2" fill="#ff007a" className="drop-shadow-[0_0_5px_#ff007a]" />
                  <circle cx="65" cy="55" r="2" fill="#ccff00" className="drop-shadow-[0_0_5px_#ccff00]" />
                  <circle cx="55" cy="30" r="1.5" fill="#ffffff" className="drop-shadow-[0_0_5px_#fff]" />
                  <circle cx="45" cy="70" r="1.5" fill="#ff9900" className="drop-shadow-[0_0_5px_#ff9900]" />
                  {/* Connection lines */}
                  <line x1="50" y1="50" x2="35" y2="45" stroke="white" strokeWidth="0.2" opacity="0.3" />
                  <line x1="50" y1="50" x2="65" y2="55" stroke="white" strokeWidth="0.2" opacity="0.3" />
                  <line x1="35" y1="45" x2="55" y2="30" stroke="white" strokeWidth="0.2" opacity="0.3" />
                </svg>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[6px] font-black text-zinc-700 uppercase tracking-widest">Master</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[6px] font-black text-zinc-700 uppercase tracking-widest">Nodes</div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
