/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  HardDrive,
  X,
  TrendingUp,
  Check,
  Cloud,
  LineChart as LineChartIcon,
  Loader,
  ArrowRight,
  Folder,
  FolderOpen,
  File,
  FileCode2,
  FileJson,
  FileText,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

// --- Types ---
type AgentStatus = 'active' | 'idle' | 'error' | 'deploying';
type AgentPriority = 'LOW' | 'MED' | 'HIGH' | 'MAX';
type GroupBy = 'NONE' | 'ROLE' | 'STATUS' | 'PRIORITY';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  priority: AgentPriority;
  icon: any;
  fileStructure?: FileNode[];
}

interface Notification {
  id: string;
  agentId: string;
  agentName: string;
  issue: string;
  timestamp: Date;
  read: boolean;
}

const getRoleIcon = (role: string) => {
  const r = role.toUpperCase();
  if (r.includes('LOGIC') || r.includes('REASONING')) return Brain;
  if (r.includes('SECURITY') || r.includes('ENCRYPTION')) return Shield;
  if (r.includes('PREDICTION') || r.includes('VISION')) return Eye;
  if (r.includes('INFRA') || r.includes('MEMORY') || r.includes('ARCHIVIST')) return HardDrive;
  if (r.includes('COMPUTE') || r.includes('ACCELERATOR')) return Zap;
  if (r.includes('GENETIC') || r.includes('DNA') || r.includes('RESEARCH')) return Dna;
  if (r.includes('NLP') || r.includes('MESSAGE')) return MessageSquare;
  if (r.includes('DATA') || r.includes('EXTRACTION') || r.includes('INFRA')) return Database;
  if (r.includes('DISTRIBUTED') || r.includes('SWARM')) return Network;
  if (r.includes('ANALYST')) return Binary;
  return Bot;
};

// --- Components ---

const RadarChart = ({ agent }: { agent: Agent }) => {
  const data = useMemo(() => {
    // Deterministic data based on agent ID for consistency
    const seed = parseInt(agent.id) || 42;
    const roleComplexity = agent.role.length;
    
    return Array.from({ length: 7 }).map((_, i) => {
      const val = (Math.sin(seed + i * roleComplexity) + 1) / 2;
      const base = 0.3 + val * 0.5; // 30% to 80%
      
      // Boost certain stats based on priority
      if (agent.priority === 'MAX') return base + 0.15;
      if (agent.priority === 'HIGH') return base + 0.1;
      return base;
    });
  }, [agent.id, agent.role, agent.priority]);

  const pointsStr = useMemo(() => {
    const sides = 7;
    return data.map((val, i) => {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const radius = 45 * val;
      return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
    }).join(' ');
  }, [data]);

  const mainColor = agent.status === 'error' ? '#ff007a' : '#00f2ff';

  return (
    <div className="relative w-full aspect-square max-w-[450px] mx-auto group">
      <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,242,255,0.05)]">
        {/* Background Heptagon Grid */}
        {[1, 0.8, 0.6, 0.4, 0.2].map((scale, i) => {
          const sides = 7;
          const radius = 45 * scale;
          const gridStr = Array.from({ length: sides }).map((_, j) => {
            const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
            return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={gridStr}
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

        {/* Data Area Polygon */}
        <motion.polygon
          points={pointsStr}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          fill={mainColor}
          fillOpacity="0.25"
          stroke={mainColor}
          strokeWidth="0.8"
          className="drop-shadow-[0_0_10px_rgba(0,242,255,0.2)]"
        />

        {/* Data Vertices */}
        {data.map((val, i) => {
          const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + 45 * val * Math.cos(angle);
          const y = 50 + 45 * val * Math.sin(angle);
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="1.4"
              fill={mainColor}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="drop-shadow-[0_0_5px_currentColor]"
            />
          );
        })}
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
  isSelected: boolean;
  onClick: () => void;
  onSelect: (e: React.MouseEvent) => void;
}

const AgentCard = ({ agent, isActive, isSelected, onClick, onSelect }: AgentCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`hardware-card p-3 rounded-sm cursor-pointer flex flex-col justify-between h-20 relative overflow-hidden group 
      ${isActive ? 'active shadow-[0_0_20px_rgba(0,242,255,0.1)]' : ''} 
      ${isSelected ? 'border-cyan-500/50 bg-cyan-500/5' : ''}`}
  >
    {/* Left-side Priority Bar */}
    <div className={`absolute top-0 left-0 w-1 h-full z-10 ${
      agent.priority === 'MAX' ? 'bg-pink-500 shadow-[0_0_10px_#ff007a]' :
      agent.priority === 'HIGH' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' :
      agent.priority === 'MED' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' :
      'bg-zinc-700'
    }`} />

    {/* Selection Checkbox */}
    <div 
      onClick={onSelect}
      className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border rounded-sm transition-all flex items-center justify-center z-20 
        ${isSelected ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'border-white/10 group-hover:border-white/30 bg-black/50 opacity-0 group-hover:opacity-100'}`}
    >
      {isSelected && <Check size={8} className="text-black font-black" />}
    </div>

    <div className="flex flex-col">
      <div className="flex justify-between items-start pr-4">
        <h4 className={`text-[11px] font-bold truncate leading-tight ${isActive ? 'text-cyan-400' : 'text-zinc-300'}`}>{agent.name}</h4>
        <div className="flex gap-1">
          <span className={`text-[6px] font-black px-1 rounded-px tracking-widest ${
            agent.priority === 'MAX' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
            agent.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            agent.priority === 'MED' ? 'bg-cyan-500/10 text-cyan-500/60 border border-cyan-500/10' :
            'bg-zinc-800 text-zinc-500 border border-zinc-700/50'
          }`}>
            {agent.priority}
          </span>
        </div>
      </div>
      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">{agent.role}</span>
    </div>
    
    <div className="flex justify-between items-center">
      <div className="opacity-10 group-hover:opacity-30 transition-opacity">
        <agent.icon size={14} />
      </div>
      <div className={`w-1 h-1 rounded-full ${
        agent.status === 'active' ? 'bg-cyan-400 shadow-[0_0_5px_#00f2ff]' : 
        agent.status === 'error' ? 'bg-pink-500 shadow-[0_0_8px_#ff007a] animate-[pulse_0.5s_infinite]' : 
        agent.status === 'deploying' ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse' :
        'bg-zinc-800'
      }`} />
    </div>
    
    {isActive && (
      <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 -mr-4 -mt-4 rotate-45" />
    )}
  </motion.div>
);

const SwarmTopology = ({ agents, activeAgentId, setActiveAgentId, notifications }: { agents: Agent[], activeAgentId: string, setActiveAgentId: (id: string) => void, notifications: Notification[] }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Use useMemo to stabilize the topology layout and connections
  const nodes = useMemo(() => {
    return agents.map((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2;
      const radius = 35;
      
      // Ring connection
      const connections = [agents[(i + 1) % agents.length].id];
      
      // Deterministic cross-connection
      const crossIdx = (i + Math.floor(agents.length / 2)) % agents.length;
      const crossId = agents[crossIdx].id;
      
      if (crossId !== connections[0] && crossId !== agent.id) {
        connections.push(crossId);
      }
      
      // Node size based on priority
      const baseSize = 2.5;
      const priorityBonus = 
        agent.priority === 'MAX' ? 1.5 :
        agent.priority === 'HIGH' ? 0.8 :
        agent.priority === 'MED' ? 0.2 : 0;

      return {
        ...agent,
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
        size: baseSize + priorityBonus,
        connections
      };
    });
  }, [agents]);

  const activeNode = nodes.find(n => n.id === activeAgentId);

  return (
    <section className="flex-1 flex flex-col h-full bg-[var(--bg-deep)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent opacity-20 pointer-events-none" />
      
      {/* Topology Map Header */}
      <div className="p-8 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-md flex justify-between items-center z-20">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-cyan-500 tracking-[0.4em] uppercase font-mono">Topological Core</span>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Swarm Protocol v2.4</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-zinc-400 font-mono tracking-widest">{agents.length} NODES</span>
            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-tighter">Active Mesh</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-pink-500 font-mono tracking-widest">32 CHANNELS</span>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Data Thruput</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Connection/Handoff Log */}
        <div className="flex-1 border-r border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col relative transition-colors">
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
          
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] flex justify-between items-center z-10 transition-colors">
            <span className="text-[10px] font-black text-cyan-500 tracking-widest uppercase">System Events & Network Handoffs</span>
            <div className="flex gap-2">
              <span className="text-[8px] font-mono text-zinc-500 px-2 border border-zinc-800 rounded-sm">LIVE STREAM</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2 relative z-10 font-mono text-[9px]">
            {/* Generate some deterministic handoff logs representing communication between nodes */}
            {Array.from({ length: 45 }).map((_, i) => {
              const nodeA = nodes[i % nodes.length];
              const nodeB = nodes[(i * 3 + 1) % nodes.length];
              const payloads = ["AUTH_TOKEN_EXCHANGE", "WEIGHT_TENSOR_SYNC", "STATE_DELTA_MERGE", "HEARTBEAT_ACK", "ANOMALY_PAYLOAD", "DATA_FETCH_REQ", "OPTIMIZATION_PARAMS"];
              const payload = payloads[i % payloads.length];
              const status = i % 11 === 0 ? "WARN" : (i % 17 === 0 ? "FAIL" : "OK");
              
              if (!nodeA || !nodeB) return null;
              
              // Only filter by active agent if one is strictly selected
              if (activeAgentId && nodeA.id !== activeAgentId && nodeB.id !== activeAgentId) {
                return null;
              }
              
              return (
                <div key={i} className={`flex gap-4 p-2 border-l-2 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-white/5 group ${status === 'FAIL' ? 'border-l-pink-500' : status === 'WARN' ? 'border-l-amber-500' : 'border-l-cyan-500'}`}>
                  <span className="text-zinc-600 shrink-0">{(new Date(Date.now() - i * 15000)).toLocaleTimeString()}</span>
                  
                  <div className="flex-1 flex items-center gap-3">
                    <span className={`font-bold w-28 truncate ${activeAgentId === nodeA.id ? 'text-white' : 'text-zinc-400'}`}>{nodeA.name}</span>
                    <ArrowRight size={10} className="text-zinc-600" />
                    <span className={`font-bold w-28 truncate pl-1 ${activeAgentId === nodeB.id ? 'text-white' : 'text-zinc-400'}`}>{nodeB.name}</span>
                    <span className="text-zinc-500">[{payload}]</span>
                  </div>
                  
                  <span className={`w-8 text-right font-bold tracking-widest ${status === 'FAIL' ? 'text-pink-500' : status === 'WARN' ? 'text-amber-500' : 'text-cyan-500'}`}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Index */}
        <div className="w-96 bg-[var(--bg-card)] flex flex-col z-10 border-l border-[var(--border-subtle)] transition-colors">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
             <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">Node Matrix</span>
             {activeAgentId && <button onClick={() => setActiveAgentId('')} className="text-[8px] font-black text-zinc-600 hover:text-white uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-sm border border-white/5">Clear filter</button>}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {nodes.map(node => (
              <div 
                key={node.id}
                onClick={() => setActiveAgentId(node.id)}
                className={`p-3 border rounded-sm cursor-pointer transition-all ${
                  activeAgentId === node.id 
                    ? 'border-cyan-500/50 bg-cyan-500/10' 
                    : node.status === 'error'
                      ? 'border-pink-500/30 bg-pink-500/5 hover:border-pink-500/50'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-cyan-400 shadow-[0_0_5px_#00f2ff]' : node.status === 'error' ? 'bg-pink-500 animate-pulse' : node.status === 'deploying' ? 'bg-blue-400 animate-pulse' : 'bg-zinc-700'}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${activeAgentId === node.id ? 'text-cyan-400' : 'text-zinc-300'}`}>{node.name}</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600">{node.id}</span>
                </div>
                
                <div className="text-[8px] font-mono text-zinc-500 uppercase flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <node.icon size={10} className={activeAgentId === node.id ? 'text-cyan-500/50' : 'text-zinc-700'} />
                    <span>{node.role}</span>
                  </div>
                  <span>{node.connections.length} PEERS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AVAILABLE_ICONS = [
  { name: 'Brain', icon: Brain },
  { name: 'Bot', icon: Bot },
  { name: 'Cpu', icon: Cpu },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Database', icon: Database },
  { name: 'Network', icon: Network },
  { name: 'Lock', icon: Lock },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Eye', icon: Eye },
  { name: 'Dna', icon: Dna },
  { name: 'Binary', icon: Binary },
  { name: 'HardDrive', icon: HardDrive },
  { name: 'Globe', icon: Globe },
  { name: 'Waves', icon: Waves },
  { name: 'Cloud', icon: Cloud },
];

const CreateAgentModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (agent: Omit<Agent, 'status'>) => void }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [priority, setPriority] = useState<AgentPriority>('MED');
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  
  const roles = ['CORE LOGIC', 'SECURITY', 'PREDICTION', 'INFRA', 'ANALYST', 'COMPUTE', 'RESEARCH'];
  const priorities: AgentPriority[] = ['LOW', 'MED', 'HIGH', 'MAX'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="hardware-card bg-[#0a0a0c] border-white/10 w-full max-w-md overflow-hidden relative"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-cyan-500 tracking-[0.4em] uppercase">Commission sequence</span>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Add New Neural Node</h3>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Node Designation (Name)</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sentinel Gamma"
              className="w-full bg-black border border-white/5 rounded-sm p-3 text-[11px] font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Operational Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-2 text-left text-[9px] font-black border transition-all rounded-sm ${
                    role === r 
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' 
                      : 'border-white/5 text-zinc-600 hover:border-white/10 hover:text-zinc-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Priority Vector</label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-2 text-center text-[9px] font-black border transition-all rounded-sm ${
                    priority === p 
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.1)]' 
                      : 'border-white/5 text-zinc-600 hover:border-white/10 hover:text-zinc-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Icon Vector Library</label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-black border border-white/5 rounded-sm">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedIcon(item)}
                  className={`p-2 rounded-sm border transition-all flex items-center justify-center ${
                    selectedIcon.name === item.name
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-white/5 text-zinc-700 hover:text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  <item.icon size={12} />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 text-[10px] font-black text-zinc-600 hover:text-zinc-400 tracking-widest uppercase"
            >
              Abort sequence
            </button>
            <button 
              disabled={!name.trim()}
              onClick={() => {
                onAdd({
                  id: Math.floor(Math.random() * 9000 + 1000).toString(),
                  name,
                  role,
                  priority,
                  icon: selectedIcon.icon
                });
              }}
              className="flex-1 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase rounded-sm hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Confirm Deployment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const NeuralHealthMonitor = ({ agent }: { agent: Agent }) => {
  const [data, setData] = useState<{ time: number; cpu: number; mem: number; net: number }[]>([]);

  useEffect(() => {
    // Initialize with some seed data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      cpu: 20 + Math.random() * 30,
      mem: 40 + Math.random() * 20,
      net: 10 + Math.random() * 15
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(current => {
        const last = current[current.length - 1];
        const next = {
          time: last.time + 1,
          cpu: Math.max(5, Math.min(95, last.cpu + (Math.random() - 0.5) * 10)),
          mem: Math.max(5, Math.min(95, last.mem + (Math.random() - 0.5) * 5)),
          net: Math.max(5, Math.min(95, last.net + (Math.random() - 0.5) * 20))
        };
        return [...current.slice(1), next];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [agent.id]);

  const MetricCard = ({ title, value, color, dataKey }: { title: string, value: string, color: string, dataKey: string }) => {
    const mainColor = color === 'cyan' ? '#00f2ff' : color === 'pink' ? '#ff007a' : '#ccff00';
    
    return (
      <div className="bg-black/40 border border-white/5 rounded-sm p-4 space-y-3 hardware-card group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-zinc-600 tracking-widest uppercase">{title}</span>
            <div className="text-xl font-black font-mono text-zinc-100">{value}</div>
          </div>
          <TrendingUp size={12} className={`text-${color}-500/50 group-hover:text-${color}-400 transition-colors`} />
        </div>
        <div className="h-16 w-full opacity-40 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={mainColor} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={mainColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={mainColor} 
                strokeWidth={1.5} 
                fill={`url(#gradient-${dataKey}-${agent.id})`}
                isAnimationActive={false}
              />
              <YAxis hide domain={[0, 100]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">Neural Health Performance</span>
        <div className="flex items-center gap-2">
           <agent.icon size={12} className={`${agent.status === 'active' ? 'text-cyan-400' : 'text-pink-500 animate-pulse'}`} />
           <span className="text-[8px] font-mono text-zinc-700 italic uppercase">Telemetry: {agent.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <MetricCard title="Processor Stability (CPU)" value={`${data[data.length-1]?.cpu.toFixed(1)}%`} color="cyan" dataKey="cpu" />
        <MetricCard title="Memory Allocation (MEM)" value={`${data[data.length-1]?.mem.toFixed(1)}%`} color="pink" dataKey="mem" />
        <MetricCard title="Packet Velocity (NET)" value={`${(data[data.length-1]?.net * 12).toFixed(0)} MB/s`} color="lime" dataKey="net" />
      </div>
    </div>
  );
};

const AGENT_ROLE_PROFILES: Record<string, { description: string, capabilities: string[] }> = {
  'CORE LOGIC': {
    description: 'Central arbitration unit responsible for evaluating truth conditions, cross-referencing base protocols, and maintaining systemic cohesion across all operational nodes.',
    capabilities: [
      'Evaluate multi-variable truth conditions',
      'Orchestrate task handoffs between nodes',
      'Resolve conflicting operational directives',
      'Maintain global invariant state'
    ]
  },
  'SECURITY': {
    description: 'Vigilant perimeter defense and threat analysis matrix. Monitors ingress/egress network traffic and enforces encryption policies in real-time.',
    capabilities: [
      'Detect anomalous traffic patterns',
      'Enforce zero-trust authorization',
      'Isolate compromised sub-routines',
      'Perform heuristic vulnerability scanning'
    ]
  },
  'PREDICTION': {
    description: 'Stochastic modeling engine leveraging historical datasets to forecast future state changes, load requirements, and potential systemic bottlenecks.',
    capabilities: [
      'Generate time-series state forecasts',
      'Identify emerging resource bottlenecks',
      'Model probabilistic failure cascades',
      'Pre-warm compute clusters based on demand'
    ]
  },
  'INFRA': {
    description: 'Foundational resource manager handling dynamic allocation of memory, CPU cycles, and network bandwidth across the active swarm topology.',
    capabilities: [
      'Dynamically scale container resources',
      'Route around degraded physical nodes',
      'Optimize inter-node data bandwidth',
      'Manage global garbage collection'
    ]
  },
  'ANALYST': {
    description: 'Deep data interrogation node designed to parse unstructured input, extract meaning, and synthesize actionable intelligence for the swarm.',
    capabilities: [
      'Parse unstructured data streams',
      'Identify non-obvious correlations',
      'Generate human-readable intelligence reports',
      'Cleanse and normalize telemetry data'
    ]
  },
  'COMPUTE': {
    description: 'Raw processing powerhouse built to execute heavy cryptographic workloads, complex transformations, and batch mathematical derivations.',
    capabilities: [
      'Execute high-throughput batch jobs',
      'Perform cryptographic hashing at scale',
      'Accelerate matrix multiplications',
      'Manage distributed state derivations'
    ]
  },
  'RESEARCH': {
    description: 'Autonomous exploration unit that scours external data sources, synthesizes new protocols, and updates the core knowledge graph.',
    capabilities: [
      'Crawl external API endpoints',
      'Synthesize novel protocol integrations',
      'Update central knowledge graph',
      'Validate external proof-of-work'
    ]
  }
};

const DEFAULT_PROFILE = {
  description: 'General purpose autonomous unit capable of executing standard operational directives and routing generic workloads.',
  capabilities: [
    'Execute standard workloads',
    'Route basic telemetry',
    'Log operational events',
    'Acknowledge heartbeat requests'
  ]
};

const AgentHistoricalLog = ({ agent }: { agent: Agent }) => {
  const [logs, setLogs] = useState<{ time: string; type: string; msg: string; color: string }[]>([]);

  useEffect(() => {
    // Generate deterministic historical logs based on the agent's ID and Status
    const seed = parseInt(agent.id) || Math.floor(Math.random() * 1000);
    const baseDate = new Date();
    
    let simulatedLogs = [
      { time: new Date(baseDate.getTime() - 1000 * 60 * 60 * 2).toLocaleTimeString(), type: 'SYS', msg: 'Core architecture expansion initiated.', color: 'zinc' },
      { time: new Date(baseDate.getTime() - 1000 * 60 * 60 * 1.5).toLocaleTimeString(), type: 'NET', msg: 'Handshake successful with global relay.', color: 'blue' },
      { time: new Date(baseDate.getTime() - 1000 * 60 * 30).toLocaleTimeString(), type: 'LOG', msg: `Optimization pass complete for rule ${agent.role}.`, color: 'cyan' },
      { time: new Date(baseDate.getTime() - 1000 * 60 * 15).toLocaleTimeString(), type: 'SYS', msg: `Identity module ${agent.name} synchronized at priority ${agent.priority}.`, color: 'lime' },
    ];

    if (agent.status === 'error') {
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 60 * 5).toLocaleTimeString(), type: 'WRN', msg: 'Elevated latency detected in main processing thread.', color: 'yellow' });
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 60 * 2).toLocaleTimeString(), type: 'ERR', msg: 'Failed to access distributed memory block. Status reset required.', color: 'pink' });
    } else if (agent.status === 'idle') {
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 60 * 10).toLocaleTimeString(), type: 'SYS', msg: 'Compute tasks cleared. Entering standby mode to preserve resources.', color: 'zinc' });
    } else if (agent.status === 'deploying') {
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 10).toLocaleTimeString(), type: 'SYS', msg: 'Container allocation requested...', color: 'zinc' });
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 5).toLocaleTimeString(), type: 'NET', msg: 'Fetching operational context...', color: 'blue' });
    } else {
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 60 * 5).toLocaleTimeString(), type: 'PERF', msg: 'Resource utilization nominal. Compute: 42%, Mem: 1.2GB', color: 'cyan' });
      simulatedLogs.push({ time: new Date(baseDate.getTime() - 1000 * 10).toLocaleTimeString(), type: 'ACT', msg: 'Executing operational loop...', color: 'lime' });
    }

    setLogs(simulatedLogs);
  }, [agent]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">Historical Event Log</span>
        <div className="flex gap-4">
          <button className="text-[8px] font-black text-zinc-600 hover:text-white uppercase tracking-tighter">Export CSV</button>
          <button className="text-[8px] font-black text-zinc-600 hover:text-white uppercase tracking-tighter">Flush Cache</button>
        </div>
      </div>
      
      <div className="bg-black/80 rounded-sm border border-white/5 font-mono text-[9px] p-6 h-64 overflow-y-auto custom-scrollbar space-y-2 group shadow-inner">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 border-b border-white/[0.02] pb-1">
            <span className="text-zinc-800 shrink-0">{log.time}</span>
            <span className={`w-10 shrink-0 font-black text-${log.color}-500`}>[{log.type}]</span>
            <span className={`${log.color === 'pink' ? 'text-pink-500/80' : 'text-zinc-500'}`}>{log.msg}</span>
          </div>
        ))}
        {agent.status === 'deploying' && (
           <div className="flex gap-4 pb-1">
              <span className="text-zinc-800 shrink-0">{new Date().toLocaleTimeString()}</span>
              <span className="w-10 shrink-0 font-black text-cyan-500 animate-pulse">[SYS]</span>
              <span className="text-cyan-500/80 animate-pulse">Establishing neural link...</span>
           </div>
        )}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-1.5 h-3 bg-cyan-500/50 mt-2 block"
        />
      </div>
    </div>
  );
};

const FlowTree = ({ nodes, level = 0, onFileSelect, selectedFile }: { nodes: FileNode[], level?: number, onFileSelect?: (file: FileNode) => void, selectedFile?: FileNode | null }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex flex-col">
      {nodes.map(node => {
        const isDir = node.type === 'directory';
        const isExpanded = expanded[node.name];
        const isSelected = selectedFile?.name === node.name && !isDir;
        
        return (
          <div key={node.name} className="flex flex-col">
            <div 
              className={`flex items-center gap-2 py-1 px-2 hover:bg-white/5 cursor-pointer text-[10px] font-mono transition-colors ${level === 0 ? 'mt-1' : ''} ${isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-500' : 'border-l-2 border-transparent'}`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
              onClick={() => {
                if (isDir) {
                  toggle(node.name);
                } else if (onFileSelect) {
                  onFileSelect(node);
                }
              }}
            >
              {isDir ? (
                <div className="flex items-center gap-1.5 text-cyan-500">
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {isExpanded ? <FolderOpen size={12} /> : <Folder size={12} />}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 ml-4" style={{ color: isSelected ? '#00f2ff' : 'rgba(113, 113, 122, 0.6)' }}>
                   {node.name.endsWith('.json') ? <FileJson size={12} /> : 
                    node.name.endsWith('.md') ? <FileText size={12} /> : 
                    <File size={12} />}
                </div>
              )}
              <span className={isDir ? 'text-cyan-50' : isSelected ? 'text-cyan-400 font-bold' : 'text-zinc-400'}>{node.name}</span>
            </div>
            {isDir && isExpanded && node.children && (
              <FlowTree nodes={node.children} level={level + 1} onFileSelect={onFileSelect} selectedFile={selectedFile} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const AgentStructureView = ({ agents, activeAgentId, setActiveAgentId }: { agents: Agent[], activeAgentId: string, setActiveAgentId: (id: string) => void }) => {
  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  useEffect(() => {
    if (!activeAgentId && agents.length > 0) {
      setActiveAgentId(agents[0].id);
    }
  }, [activeAgentId, agents, setActiveAgentId]);

  // Reset selected file when active agent changes
  useEffect(() => {
    setSelectedFile(null);
  }, [activeAgentId]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar: Agents List */}
      <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/40">
          <span className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">Target Agent</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {agents.map(agent => (
            <div 
              key={agent.id}
              onClick={() => setActiveAgentId(agent.id)}
              className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center gap-3 ${
                activeAgent?.id === agent.id 
                  ? 'border-cyan-500/50 bg-cyan-500/10' 
                  : 'border-transparent bg-white/[0.01] hover:bg-white/[0.03]'
              }`}
            >
              <agent.icon size={14} className={activeAgent?.id === agent.id ? 'text-cyan-400' : 'text-zinc-600'} />
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold ${activeAgent?.id === agent.id ? 'text-white' : 'text-zinc-400'}`}>{agent.name}</span>
                <span className="text-[8px] font-mono text-zinc-600 uppercase">{agent.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Structure Display */}
      <div className="flex-1 bg-[#050507] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
        
        {activeAgent ? (
          <>
            <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <activeAgent.icon size={24} className="text-cyan-400" />
                <div>
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase">{activeAgent.name} / Structure</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-500 px-2 border border-zinc-800 rounded-sm uppercase">{activeAgent.role}</span>
                    <span className="text-[9px] font-mono text-cyan-500 px-2 border border-cyan-500/20 bg-cyan-500/10 rounded-sm">VFS MAPPED</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-hidden flex gap-6 z-10 w-full">
              <div className={`hardware-card border-white/10 rounded-sm bg-black/60 shadow-xl overflow-y-auto custom-scrollbar p-6 relative transition-all duration-300 ${selectedFile ? 'w-[400px] shrink-0' : 'max-w-2xl w-full'}`}>
                 <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <FileCode2 size={100} />
                 </div>
                 
                 <div className="flex items-center gap-2 mb-6 text-zinc-400">
                    <FolderOpen size={16} className="text-cyan-500" />
                    <span className="text-xs font-black tracking-widest uppercase">/ root / {activeAgent.id} /</span>
                 </div>
                 
                 {activeAgent.fileStructure && activeAgent.fileStructure.length > 0 ? (
                   <div className="border border-white/5 rounded bg-black/40 p-2">
                     <FlowTree nodes={activeAgent.fileStructure} onFileSelect={setSelectedFile} selectedFile={selectedFile} />
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 border border-white/5 border-dashed rounded bg-white/[0.01]">
                      <FileCode2 size={32} className="text-zinc-700 mb-4" />
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Structure Initialized</span>
                      <button className="mt-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-black tracking-widest uppercase rounded-sm hover:bg-cyan-500/20 transition-all">Initialize Scaffold</button>
                   </div>
                 )}
              </div>

              {selectedFile && (
                <div className="flex-1 hardware-card border-cyan-500/20 rounded-sm bg-black/80 shadow-[0_0_30px_rgba(0,242,255,0.05)] overflow-hidden flex flex-col relative animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedFile.name.endsWith('.json') ? <FileJson size={14} className="text-cyan-400" /> : 
                       selectedFile.name.endsWith('.md') ? <FileText size={14} className="text-cyan-400" /> : 
                       <File size={14} className="text-cyan-400" />}
                      <span className="text-[11px] font-mono font-bold text-white tracking-widest">{selectedFile.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase px-2 bg-white/5 rounded-sm border border-white/5">Auto-generated</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* Mock Code Block Display */}
                    <div className="font-mono text-[11px] leading-loose text-zinc-400 whitespace-pre-wrap">
{selectedFile.name.endsWith('.json') ? `{
  "apiVersion": "v1alpha",
  "kind": "${selectedFile.name.replace('.json', '')}",
  "metadata": {
    "name": "${activeAgent.id}-config",
    "managedBy": "NeuralCore"
  },
  "spec": {
    "moduleName": "${activeAgent.name}",
    "roleType": "${activeAgent.role}",
    "parameters": {
      "temperature": 0.3,
      "maxTokens": 4096,
      "contextWindow": 128000
    },
    "routingMatrix": {
      "priority": "${activeAgent.priority}",
      "failoverStrategy": "ROUND_ROBIN"
    }
  }
}` : selectedFile.name.endsWith('.md') ? `# ${selectedFile.name.replace('.md', '')}

This document details the configuration and behavior of the **${activeAgent.name}** module (\`${activeAgent.id}\`).

## Overview
- Role: \`${activeAgent.role}\`
- Priority: \`${activeAgent.priority}\`

## Capabilities
This module has been optimized for handling high-throughput asynchronous tasks pertaining to \`${activeAgent.role}\` specific operations.

> Warning: Adjusting parameters directly in the VFS bypasses safety checks. Do this only in development mode.

## System Dependencies
- Virtualized Data Layer
- Neural Interconnect v4
` : `// Binary or generic view
<binary data stream omitted for security>`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
           <div className="flex-1 flex items-center justify-center">
             <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">No target selected</span>
           </div>
        )}
      </div>
    </div>
  );
};

const DefaultView = ({ 
  groupBy, 
  setGroupBy, 
  activeAgentId, 
  setActiveAgentId, 
  agents, 
  groupedAgents, 
  selectedAgentIds, 
  setSelectedAgentIds, 
  performBulkAction,
  setShowAddModal,
  toggleAgentSelection,
  setAgents,
  resolveAgent
}: any) => (
  <>
    {/* Left Panel: Agent Grid */}
    <section className="w-[55%] border-r border-[var(--border-subtle)] flex flex-col p-8 overflow-hidden bg-[var(--bg-deep)] transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-black font-mono text-[var(--accent-primary)] tracking-tighter shadow-sm">{activeAgentId}</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setGroupBy('NONE')}
              className={`flex items-center gap-2 cursor-pointer group px-3 py-1 rounded-sm transition-all border ${groupBy === 'NONE' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Global Fleet</span>
            </button>
            <button 
              onClick={() => setGroupBy('ROLE')}
              className={`flex items-center gap-2 cursor-pointer group px-3 py-1 rounded-sm transition-all border ${groupBy === 'ROLE' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest">By Role</span>
              <ChevronDown size={10} className={groupBy === 'ROLE' ? 'text-cyan-500' : 'text-zinc-700'} />
            </button>
            <button 
              onClick={() => setGroupBy('STATUS')}
              className={`flex items-center gap-2 cursor-pointer group px-3 py-1 rounded-sm transition-all border ${groupBy === 'STATUS' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest">By Status</span>
              <ChevronDown size={10} className={groupBy === 'STATUS' ? 'text-cyan-500' : 'text-zinc-700'} />
            </button>
            <button 
              onClick={() => setGroupBy('PRIORITY')}
              className={`flex items-center gap-2 cursor-pointer group px-3 py-1 rounded-sm transition-all border ${groupBy === 'PRIORITY' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest">By Priority</span>
              <ChevronDown size={10} className={groupBy === 'PRIORITY' ? 'text-cyan-500' : 'text-zinc-700'} />
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {selectedAgentIds.size > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0c] border border-cyan-500/30 rounded-sm px-6 py-3 flex items-center gap-8 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-cyan-500 tracking-[0.3em] uppercase">Selection active</span>
                <div className="text-[10px] font-black font-mono text-zinc-100">{selectedAgentIds.size} NODES TARGETED</div>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex gap-4">
                <button onClick={() => performBulkAction('active')} className="text-[9px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors">Start Fleet</button>
                <button onClick={() => performBulkAction('idle')} className="text-[9px] font-black text-zinc-400 hover:text-zinc-200 uppercase tracking-widest transition-colors">Idle Nodes</button>
                <button onClick={() => performBulkAction('reset')} className="text-[9px] font-black text-pink-500 hover:text-pink-400 uppercase tracking-widest transition-colors">Full Reset</button>
                <button onClick={() => setSelectedAgentIds(new Set())} className="text-[9px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors ml-4">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-12">
        {(Object.entries(groupedAgents) as [string, Agent[]][]).map(([groupName, groupAgents]) => (
          <div key={groupName} className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase whitespace-nowrap">{groupName}</span>
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[8px] font-mono text-zinc-700">{groupAgents.length} NODES</span>
            </div>
            <div className="grid grid-cols-4 gap-4 content-start">
              {groupAgents.map(agent => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  isActive={activeAgentId === agent.id}
                  isSelected={selectedAgentIds.has(agent.id)}
                  onClick={() => setActiveAgentId(agent.id)}
                  onSelect={(e) => toggleAgentSelection(agent.id, e)}
                />
              ))}
              {groupBy === 'NONE' && (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowAddModal(true)}
                  className="hardware-card border-dashed border-white/5 rounded-sm flex items-center justify-center h-20 text-zinc-700 hover:text-zinc-500 hover:border-white/10 cursor-pointer transition-all"
                >
                  <Plus size={20} />
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Right Panel: Dedicated Agent Inspector */}
    <section className="flex-1 flex flex-col h-full bg-[var(--bg-deep)] border-l border-[var(--border-subtle)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent opacity-20 pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 relative z-10">
        {/* Header Module */}
        <div className="p-8 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black tracking-widest rounded-sm uppercase italic">Live Inspector</span>
                <span className="text-[9px] font-mono text-zinc-600">v4.2.0-stable</span>
              </div>
              <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-none">
                {agents.find((a: any) => a.id === activeAgentId)?.name || 'Nexus Prime'}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${agents.find((a: any) => a.id === activeAgentId)?.status === 'active' ? 'bg-cyan-500 shadow-[0_0_8px_#00f2ff]' : agents.find((a: any) => a.id === activeAgentId)?.status === 'error' ? 'bg-pink-500 shadow-[0_0_8px_#ff007a] animate-pulse' : agents.find((a: any) => a.id === activeAgentId)?.status === 'deploying' ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse' : 'bg-zinc-700'}`} />
                  <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${agents.find((a: any) => a.id === activeAgentId)?.status === 'active' ? 'text-cyan-400' : agents.find((a: any) => a.id === activeAgentId)?.status === 'error' ? 'text-pink-500' : agents.find((a: any) => a.id === activeAgentId)?.status === 'deploying' ? 'text-blue-400 animate-pulse' : 'text-zinc-500'}`}>
                    {agents.find((a: any) => a.id === activeAgentId)?.status}
                  </span>
                </div>
                <span className="text-zinc-700 font-mono text-[10px]">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Priority:</span>
                  <button 
                    onClick={() => {
                      const priorities: AgentPriority[] = ['LOW', 'MED', 'HIGH', 'MAX'];
                      const current = agents.find((a: any) => a.id === activeAgentId)?.priority || 'MED';
                      const next = priorities[(priorities.indexOf(current) + 1) % priorities.length];
                      setAgents(agents.map((a: Agent) => a.id === activeAgentId ? { ...a, priority: next } : a));
                    }}
                    className={`text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border transition-all ${
                      agents.find((a: any) => a.id === activeAgentId)?.priority === 'MAX' ? 'border-pink-500/50 text-pink-500 bg-pink-500/5' :
                      agents.find((a: any) => a.id === activeAgentId)?.priority === 'HIGH' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' :
                      agents.find((a: any) => a.id === activeAgentId)?.priority === 'MED' ? 'border-cyan-500/50 text-cyan-500 bg-cyan-500/5' :
                      'border-white/10 text-zinc-500 bg-white/5'
                    }`}
                  >
                    {agents.find((a: any) => a.id === activeAgentId)?.priority}
                  </button>
                </div>
                <span className="text-zinc-700 font-mono text-[10px]">|</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Runtime: 14h 22m 04s
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  const agent = agents.find((a: any) => a.id === activeAgentId);
                  if (!agent) return;
                  if (agent.status === 'active') {
                    setAgents(agents.map((a: Agent) => a.id === activeAgentId ? { ...a, status: 'idle' } : a));
                  } else {
                    setAgents(agents.map((a: Agent) => a.id === activeAgentId ? { ...a, status: 'deploying' } : a));
                    setTimeout(() => {
                      setAgents((prev: Agent[]) => prev.map((a: Agent) => a.id === activeAgentId ? { ...a, status: 'active' } : a));
                    }, 3000); // Deploying takes 3 seconds
                  }
                }}
                disabled={agents.find((a: any) => a.id === activeAgentId)?.status === 'deploying'}
                className={`w-40 py-2.5 rounded-sm text-[10px] font-black tracking-[0.3em] border transition-all flex items-center justify-center gap-2 ${
                agents.find((a: any) => a.id === activeAgentId)?.status === 'active'
                  ? 'border-pink-500/50 text-pink-500 bg-pink-500/5 hover:bg-pink-500/10'
                  : agents.find((a: any) => a.id === activeAgentId)?.status === 'deploying'
                  ? 'border-blue-500/50 text-blue-400 bg-blue-500/5 cursor-wait'
                  : 'border-cyan-500/50 text-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 shadow-[0_0_20px_rgba(0,242,255,0.05)]'
              }`}>
                {agents.find((a: any) => a.id === activeAgentId)?.status === 'active' ? (
                  <><Square size={12} fill="currentColor" /> KILL PROCESS</>
                ) : agents.find((a: any) => a.id === activeAgentId)?.status === 'deploying' ? (
                  <><Loader size={12} className="animate-spin" /> DEPLOYING</>
                ) : (
                  <><Play size={12} fill="currentColor" /> DEPLOY</>
                )}
              </button>
              <button 
                onClick={() => resolveAgent(activeAgentId)}
                className="w-40 py-2 rounded-sm text-[9px] font-black tracking-[0.2em] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={12} /> RE-INITIALIZE
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-8 py-6 px-6 bg-black/20 rounded border border-white/5 border-dashed">
            {agents.find((a: any) => a.id === activeAgentId) && (
              <>
                {/* Left: Smaller Radar Chart */}
                <div className="w-[180px] shrink-0">
                  <RadarChart agent={agents.find((a: any) => a.id === activeAgentId)!} />
                </div>
                
                {/* Right: Agent Bio & Capabilities */}
                <div className="flex-1 space-y-6">
                  {(() => {
                    const agent = agents.find((a: any) => a.id === activeAgentId);
                    const profile = AGENT_ROLE_PROFILES[agent?.role] || DEFAULT_PROFILE;
                    return (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Binary size={12} /> Operational Mandate
                          </h3>
                          <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                            {profile.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Check size={12} /> Confirmed Capabilities
                          </h3>
                          <ul className="grid grid-cols-1 gap-2">
                            {profile.capabilities.map((cap: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 border border-white/5 bg-black/40 p-2 rounded-sm text-xs font-mono text-zinc-300">
                                <div className="mt-0.5 text-cyan-500">
                                  <Check size={10} strokeWidth={3} />
                                </div>
                                {cap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-8 space-y-12 pb-24">
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Context Usage', value: '42.8 GB', sub: '92% capacity', color: 'pink' },
              { label: 'Latency', value: '142ms', sub: 'Norm: 120ms', color: 'cyan' },
              { label: 'Success Rate', value: '99.4%', sub: 'Last 1k ops', color: 'lime' }
            ].map(stat => (
              <div key={stat.label} className="hardware-card p-4 rounded-sm border-white/10 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500/50`} />
                <span className="text-[8px] font-black text-zinc-600 tracking-widest uppercase mb-1 block">{stat.label}</span>
                <div className="text-xl font-black font-mono text-zinc-200">{stat.value}</div>
                <span className="text-[8px] font-mono text-zinc-600 mt-1 block">{stat.sub}</span>
              </div>
            ))}
          </div>

          {agents.find((a: any) => a.id === activeAgentId) && (
            <NeuralHealthMonitor agent={agents.find((a: any) => a.id === activeAgentId)!} />
          )}

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">Neural Configuration</span>
              <span className="text-[8px] font-mono text-zinc-700 italic">AUTO-SYNC ENABLED</span>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Reasoning Depth', value: 84, color: '#00f2ff' },
                { label: 'Input Sensitivity', value: 65, color: '#ff007a' },
                { label: 'Decision Velocity', value: 92, color: '#ccff00' }
              ].map((ctrl) => (
                <div key={ctrl.label} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">{ctrl.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-500">[{ctrl.value}/100]</span>
                      <div className="w-2 h-2 rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]" style={{ backgroundColor: ctrl.color }} />
                    </div>
                  </div>
                  <div className="h-2 bg-black rounded-sm relative border border-white/5 overflow-hidden">
                    <div 
                      className="absolute h-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${ctrl.value}%`, 
                        backgroundColor: ctrl.color,
                        boxShadow: `0 0 15px ${ctrl.color}33`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {agents.find((a: any) => a.id === activeAgentId) && (
            <AgentHistoricalLog agent={agents.find((a: any) => a.id === activeAgentId)!} />
          )}
        </div>
      </div>
    </section>
  </>
);

const SecurityView = () => (
  <div className="flex-1 p-12 bg-[var(--bg-deep)] overflow-y-auto">
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-pink-500/10 text-pink-500 border border-pink-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm">Secure-Zone</span>
            <span className="text-[10px] font-mono text-zinc-700">AES-256 PARITY</span>
          </div>
          <h2 className="text-4xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">Security Perimeter</h2>
        </div>
        <div className="flex gap-12">
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-[var(--text-main)] opacity-90">0.0%</div>
            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Breach Attempts</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-cyan-400 font-bold">OPTIMAL</div>
            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Shield Health</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { icon: Lock, label: 'Access Control', status: 'Locked' },
          { icon: Shield, label: 'Neural Firewall', status: 'Active' },
          { icon: Eye, label: 'Traffic Monitor', status: 'Vigilant' }
        ].map(item => (
          <div key={item.label} className="hardware-card p-6 bg-[var(--bg-card)] border-[var(--border-subtle)] flex flex-col gap-4">
            <item.icon className="text-cyan-500" size={24} />
            <div className="space-y-1">
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{item.label}</div>
              <div className="text-lg font-black font-mono text-[var(--text-main)] italic">{item.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="hardware-card p-8 border-[var(--border-subtle)] bg-[var(--bg-surface)]">
         <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">Vulnerability Scanner</span>
            <div className="h-px bg-white/5 flex-1" />
         </div>
         <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                  <span>SUBSYS_{i+100}</span>
                  <span className="text-cyan-500">CLEAN</span>
                </div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['20%', '80%', '20%'] }}
                    transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                    className="h-full bg-cyan-500/40" 
                  />
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  </div>
);

const ConfigView = () => (
  <div className="flex-1 p-12 bg-[var(--bg-deep)] overflow-y-auto">
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">System Configuration</h2>
        <p className="text-[var(--text-dim)] font-mono text-sm max-w-2xl">Modify core operational parameters for the agentic swarm. Changes require neural synchronization.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="hardware-card p-6 border-white/10 bg-black/40 space-y-6">
          <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-4">Core Settings</h3>
          {[
            { label: 'Neural Resolution', val: 'Low-Latency' },
            { label: 'Swarm Density', val: 'Optimized' },
            { label: 'Encryption Protocol', val: 'Quantum-Safe' },
            { label: 'Auto-Recovery', val: 'Enabled' }
          ].map(s => (
            <div key={s.label} className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{s.label}</span>
              <span className="text-[10px] text-white font-mono">{s.val}</span>
            </div>
          ))}
          <button className="w-full py-4 mt-4 bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">Synchronize All</button>
        </div>
        
        <div className="hardware-card p-6 border-white/10 bg-black/40 space-y-6">
          <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-4">Allocation Profiles</h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <span>Memory Buffer</span>
                <span>72%</span>
              </div>
              <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-500 w-[72%]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <span>Compute Throttle</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-pink-500 w-[45%]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <span>IO Bandwidth</span>
                <span>90%</span>
              </div>
              <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-lime-500 w-[90%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StandbyView = ({ tab }: { tab: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-[#050507] p-12">
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ duration: 4, repeat: Infinity }}
      className="text-8xl font-black text-zinc-900 absolute pointer-events-none select-none tracking-tighter"
    >
      {tab}
    </motion.div>
    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center animate-[spin_10s_linear_infinite]">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Module {tab} Initializing</h3>
        <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">Establishing secure link to distributed core...</p>
      </div>
      <button className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">Refresh Module</button>
    </div>
  </div>
);

export default function App() {
  const [activeAgentId, setActiveAgentId] = useState('1138');
  const [activeTab, setActiveTab] = useState('NEURAL');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>('NONE');
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateAgentStructure = (role: string): FileNode[] => {
    const roleId = role.toLowerCase().replace(/\s+/g, '-');
    
    // Let's generate generic elements based on role
    const models = [
      { name: `${roleId}-model-v1.json`, type: 'file' },
      { name: `${roleId}-weights.bin`, type: 'file' }
    ];
    
    const references = [
      { name: 'protocol.md', type: 'file' },
      { name: 'architecture.md', type: 'file' },
      { name: 'api-spec.md', type: 'file' }
    ];
    
    const templates = [
      { name: 'base-template.json', type: 'file' },
      { name: 'override-template.json', type: 'file' }
    ];

    if (role === 'CORE LOGIC') {
      references.push({ name: 'decision-trees.md', type: 'file' });
      models.push({ name: 'quantum-logic-engine.bin', type: 'file' });
    } else if (role === 'SECURITY' || role === 'ENCRYPTION') {
      references.push({ name: 'threat-models.md', type: 'file' });
      references.push({ name: 'crypto-standards.md', type: 'file' });
      templates.push({ name: 'firewall-rules.json', type: 'file' });
      models.push({ name: 'anomaly-detection-v4.bin', type: 'file' });
    } else if (role === 'NLP ENGINE') {
      references.push({ name: 'syntax-trees.md', type: 'file' });
      models.push({ name: 'transformer-base.bin', type: 'file' });
    } else if (role === 'GENETIC AI') {
      references.push({ name: 'mutation-rates.md', type: 'file' });
      models.push({ name: 'evolutionary-algos.bin', type: 'file' });
    } else if (role === 'EXTRACTION' || role === 'MEMORY') {
      references.push({ name: 'schema-definitions.md', type: 'file' });
      templates.push({ name: 'query-templates.json', type: 'file' });
    } else if (role === 'IMAGE GEN') {
      references.push({ name: 'diffusion-models.md', type: 'file' });
      models.push({ name: 'stable-diffusion-v3.bin', type: 'file' });
    }

    return [
      {
        name: 'skills',
        type: 'directory',
        children: [
          {
            name: `${roleId}-tool`,
            type: 'directory',
            children: [
              { name: 'SKILL.md', type: 'file' as const },
              {
                name: 'references',
                type: 'directory',
                children: references as FileNode[]
              },
              {
                name: 'assets',
                type: 'directory',
                children: [
                  {
                    name: 'templates',
                    type: 'directory',
                    children: templates as FileNode[]
                  },
                  {
                    name: 'models',
                    type: 'directory',
                    children: models as FileNode[]
                  }
                ]
              },
              {
                name: 'examples',
                type: 'directory',
                children: [
                  { name: `sample-${roleId}.json`, type: 'file' as const },
                  { name: 'integration-test.ts', type: 'file' as const }
                ]
              }
            ]
          }
        ]
      }
    ];
  };

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const initialAgents: Agent[] = [
    { id: '1138', name: 'Nexus Prime', role: 'CORE LOGIC', status: 'active', priority: 'MAX', icon: Brain, fileStructure: generateAgentStructure('CORE LOGIC') },
    { id: '0042', name: 'Sentinel Alpha', role: 'SECURITY', status: 'active', priority: 'HIGH', icon: Shield, fileStructure: generateAgentStructure('SECURITY') },
    { id: '0901', name: 'Oracle V2', role: 'PREDICTION', status: 'idle', priority: 'MED', icon: Eye, fileStructure: generateAgentStructure('PREDICTION') },
    { id: '2231', name: 'Cipher X', role: 'ENCRYPTION', status: 'active', priority: 'HIGH', icon: Lock, fileStructure: generateAgentStructure('ENCRYPTION') },
    { id: '4412', name: 'Linguist 7', role: 'NLP ENGINE', status: 'idle', priority: 'LOW', icon: MessageSquare, fileStructure: generateAgentStructure('NLP ENGINE') },
    { id: '5561', name: 'Swarm Node', role: 'DISTRIBUTED', status: 'active', priority: 'MED', icon: Network, fileStructure: generateAgentStructure('DISTRIBUTED') },
    { id: '6672', name: 'Bio-Link', role: 'GENETIC AI', status: 'active', priority: 'MAX', icon: Dna, fileStructure: generateAgentStructure('GENETIC AI') },
    { id: '7783', name: 'Data Miner', role: 'EXTRACTION', status: 'idle', priority: 'LOW', icon: Database, fileStructure: generateAgentStructure('EXTRACTION') },
    { id: '8894', name: 'Logic Gate', role: 'REASONING', status: 'active', priority: 'MED', icon: Binary, fileStructure: generateAgentStructure('REASONING') },
    { id: '9905', name: 'Visionary', role: 'IMAGE GEN', status: 'active', priority: 'HIGH', icon: Eye, fileStructure: generateAgentStructure('IMAGE GEN') },
    { id: '1016', name: 'Archivist', role: 'MEMORY', status: 'idle', priority: 'LOW', icon: HardDrive, fileStructure: generateAgentStructure('MEMORY') },
    { id: '1127', name: 'Accelerator', role: 'COMPUTE', status: 'active', priority: 'HIGH', icon: Zap, fileStructure: generateAgentStructure('COMPUTE') },
  ];

  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAgents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(query) || 
      agent.role.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  const groupedAgents = useMemo(() => {
    if (groupBy === 'NONE') return { 'ALL AGENTS': filteredAgents };
    
    return filteredAgents.reduce((acc, agent) => {
      let key = agent.role;
      if (groupBy === 'ROLE') key = agent.role;
      else if (groupBy === 'STATUS') key = agent.status.toUpperCase();
      else if (groupBy === 'PRIORITY') key = agent.priority;
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(agent);
      return acc;
    }, {} as Record<string, Agent[]>);
  }, [filteredAgents, groupBy]);

  const toggleAgentSelection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAgentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const performBulkAction = (action: 'active' | 'idle' | 'reset') => {
    setAgents(prev => prev.map(agent => {
      if (selectedAgentIds.has(agent.id)) {
        if (action === 'reset') return { ...agent, status: 'active' };
        return { ...agent, status: action };
      }
      return agent;
    }));
    
    setNotifications(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: `BULK ${action.toUpperCase()}`,
        message: `Command executed on ${selectedAgentIds.size} nodes`,
        time: 'JUST NOW',
        type: action === 'reset' ? 'info' : action === 'active' ? 'success' : 'warning',
        read: false
      },
      ...prev
    ]);

    setSelectedAgentIds(new Set());
  };

  const addNewAgent = (newAgent: Omit<Agent, 'status'>) => {
    const agent: Agent = {
      ...newAgent,
      status: 'idle',
      priority: (newAgent as any).priority || 'MED'
    };
    setAgents(prev => [...prev, agent]);
    setShowAddModal(false);
  };

  // Monitor for agent status changes to 'error'
  useEffect(() => {
    const errorAgents = agents.filter(a => a.status === 'error');
    errorAgents.forEach(agent => {
      // Check if we already have a notification for this error (prevent duplicates for same session/state)
      const existing = notifications.find(n => n.agentId === agent.id && !n.read);
      if (!existing) {
        const newNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          agentId: agent.id,
          agentName: agent.name,
          issue: `Critical subsystem failure detected in ${agent.role} pipeline.`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    });
  }, [agents]);

  // Simulate random errors for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.9) {
        const randomIndex = Math.floor(Math.random() * agents.length);
        const randomAgent = agents[randomIndex];
        if (randomAgent.status !== 'error') {
          setAgents(prev => prev.map(a => 
            a.id === randomAgent.id ? { ...a, status: 'error' } : a
          ));
        }
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [agents]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const [isBotHandling, setIsBotHandling] = useState(false);

  const deployBotHandler = () => {
    setIsBotHandling(true);
    
    // Simulate bot handler picking up the issue and delegating to right agents
    setTimeout(() => {
      setNotifications(prev => prev.map(n => ({ 
        ...n, 
        read: true, 
        issue: `[BOT HANDLED] Re-routed to correct node. ${n.issue}` 
      })));
      
      // Auto-resolve all agents after a bit more time
      setTimeout(() => {
        setAgents(prev => prev.map(a => a.status === 'error' ? { ...a, status: 'active' } : a));
        setIsBotHandling(false);
      }, 2000);
    }, 1500);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resolveAgent = (id: string) => {
    setAgents(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'active' } : a
    ));
    setNotifications(prev => prev.map(n => 
      n.agentId === id ? { ...n, read: true } : n
    ));
  };

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
    { name: 'AGENT STRUCTURE', icon: Globe }
  ];

  return (
    <div className="h-screen flex flex-col hardware-surface select-none overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-[var(--border-subtle)] flex items-center px-6 justify-between bg-[var(--header-bg)] backdrop-blur-md relative z-50 transition-colors">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter italic leading-none text-[var(--text-main)]">NEURAL<span className="text-cyan-400">CORE</span></h1>
            <span className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-0.5">AGENTIC OPERATING SYSTEM</span>
          </div>
          
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-white/5">
            <button className="px-5 py-1.5 text-[9px] font-black bg-zinc-800 rounded-sm text-white flex items-center gap-2 shadow-inner">
              <Terminal size={10} />
              CONSOLE
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-xl mx-auto">
          <div className="w-full relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH NEURAL NODES BY NAME OR ROLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-sm pl-10 pr-4 py-2 text-[10px] font-black font-mono text-[var(--text-main)] placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:bg-[var(--bg-card)] transition-all tracking-widest`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
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
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 transition-colors relative ${unreadCount > 0 ? 'text-pink-500' : 'text-zinc-600 hover:text-white'}`}
            >
              <Bell size={18} className={unreadCount > 0 ? 'animate-pulse' : ''} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-black shadow-[0_0_5px_#ff007a]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-80 hardware-card bg-black/90 backdrop-blur-xl border border-white/10 p-0 overflow-hidden z-[100] shadow-2xl"
                >
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <span className="text-[10px] font-black tracking-widest text-zinc-400">NOTIFICATIONS</span>
                    <div className="flex items-center gap-4">
                      <button onClick={markAllRead} className="text-[8px] font-black text-cyan-400 hover:text-cyan-300 tracking-tighter uppercase whitespace-nowrap">Mark all read</button>
                      <button onClick={clearNotifications} className="text-[8px] font-black text-zinc-600 hover:text-zinc-400 tracking-tighter uppercase whitespace-nowrap">Clear</button>
                      <button onClick={() => setShowNotifications(false)} className="ml-2 text-zinc-500 hover:text-white transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">No active alerts</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {unreadCount > 0 && (
                          <div className="p-3 border-b border-white/5 bg-cyan-500/5 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-cyan-400">
                              <Brain size={12} className={isBotHandling ? "animate-pulse" : ""} />
                              <span>{isBotHandling ? 'BOT HANDLER DEPLOYED...' : 'UNRESOLVED ISSUES DETECTED'}</span>
                            </div>
                            <button 
                              onClick={deployBotHandler}
                              disabled={isBotHandling}
                              className={`text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-sm border transition-all ${
                                isBotHandling 
                                  ? 'border-cyan-500/20 text-cyan-500/50 cursor-not-allowed' 
                                  : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
                              }`}
                            >
                              Dispatch Bot Handler
                            </button>
                          </div>
                        )}
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            className={`p-4 border-b border-white/5 flex gap-4 transition-colors hover:bg-white/5 cursor-default ${!n.read ? 'bg-pink-500/5 border-l-2 border-l-pink-500' : ''}`}
                          >
                            <div className="mt-1">
                              <Shield size={14} className={!n.read ? 'text-pink-500' : 'text-zinc-600'} />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-bold ${!n.read ? 'text-white' : 'text-zinc-400'}`}>{n.agentName} ERROR</span>
                                <span className="text-[8px] font-mono text-zinc-600">{n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">{n.issue}</p>
                              {!n.read && (
                                <button 
                                  onClick={() => resolveAgent(n.agentId)}
                                  className="mt-2 text-[8px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-sm w-fit border border-cyan-400/20 hover:bg-cyan-400/20 transition-all uppercase tracking-widest"
                                >
                                  Resolve Issue
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-sm border border-cyan-500/20 text-[9px] font-black text-cyan-400 hover:bg-cyan-500/20 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,255,0.05)]"
          >
            <Plus size={12} /> New Module
          </button>

          <div className="flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded border border-white/5">
            <span className="text-[9px] font-mono text-zinc-600">LOAD</span>
            <span className="text-[9px] font-mono text-cyan-400 font-bold">42.8%</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 text-zinc-600 hover:text-white transition-colors flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 text-zinc-600 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'SWARM' ? (
          <SwarmTopology 
            agents={agents} 
            notifications={notifications} 
            activeAgentId={activeAgentId} 
            setActiveAgentId={setActiveAgentId} 
          />
        ) : activeTab === 'NEURAL' ? (
          <DefaultView 
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            activeAgentId={activeAgentId}
            setActiveAgentId={setActiveAgentId}
            agents={agents}
            groupedAgents={groupedAgents}
            selectedAgentIds={selectedAgentIds}
            setSelectedAgentIds={setSelectedAgentIds}
            performBulkAction={performBulkAction}
            setShowAddModal={setShowAddModal}
            toggleAgentSelection={toggleAgentSelection}
            setAgents={setAgents}
            resolveAgent={resolveAgent}
          />
        ) : activeTab === 'SECURITY' ? (
          <SecurityView />
        ) : activeTab === 'CONFIG' ? (
          <ConfigView />
        ) : activeTab === 'AGENT STRUCTURE' ? (
          <AgentStructureView agents={agents} activeAgentId={activeAgentId} setActiveAgentId={setActiveAgentId} />
        ) : (
          <StandbyView tab={activeTab} />
        )}
      </main>



      <CreateAgentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={addNewAgent}
      />
    </div>
  );
}
