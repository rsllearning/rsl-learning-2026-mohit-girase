import React from 'react';
import {
  Layers,
  Cpu,
  PackageCheck,
  Radio,
  Sliders,
  Shield,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const primaryNav = [
    { id: 'inventory', label: 'Hardware Units', icon: Cpu, badge: '6' },
    { id: 'nodes', label: 'Cluster Nodes', icon: Layers, badge: '12' },
    { id: 'telemetry', label: 'Telemetry & Logs', icon: Radio },
    { id: 'dispatch', label: 'Asset Dispatch', icon: PackageCheck },
    { id: 'calibration', label: 'Calibration', icon: Sliders },
    { id: 'security', label: 'WAF & Keys', icon: Shield },
  ];

  return (
    <>
      {/* 
        DESKTOP SIDEBAR:
        - Visible on medium screens and up: 'hidden md:flex'
        - Dark obsidian industrial aesthetic
        - Pure Tailwind responsive utilities without JS resize listeners (Requirement 9)
      */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-surface/60 backdrop-blur-md border-r border-border-subtle min-h-[calc(100vh-4rem)] p-4 justify-between">
        <div className="space-y-6">
          {/* Subheading */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted px-3 block mb-2 font-bold">
              SYSTEM SECTORS
            </span>
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-action text-xs font-mono font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-brand/15 text-brand border border-brand/30 shadow-xs font-bold'
                        : 'text-content-body hover:text-content-title hover:bg-surface-elevated/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-content-muted'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? 'bg-brand text-slate-950 font-bold' : 'bg-surface-elevated text-content-muted'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Metrics Panel */}
          <div className="p-3.5 bg-canvas/80 border border-border-subtle rounded-action space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Bus Load
              </span>
              <span className="font-bold text-content-title">28.4%</span>
            </div>
            <div className="w-full bg-surface-elevated h-1 rounded-full overflow-hidden">
              <div className="bg-brand h-full w-[28%]" />
            </div>
            <p className="text-[10px] font-mono text-content-muted pt-1">
              Cluster: <span className="text-content-body">APEX-EAST-01</span>
            </p>
          </div>
        </div>

        {/* System Footer info */}
        <div className="pt-4 border-t border-border-subtle/70">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-[11px] font-mono">
              <p className="text-content-title font-bold leading-none">Console Online</p>
              <p className="text-content-muted text-[10px] mt-0.5">v2.4.0 Production</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 
        MOBILE NAVIGATION:
        - Visible ONLY on small screens: 'flex md:hidden'
        - Bottom navigation with frosted glass
        - Pure Tailwind responsive visibility (Requirement 9)
      */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-border-subtle px-3 py-2 justify-around shadow-2xl">
        {primaryNav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-action text-[11px] font-mono transition-colors cursor-pointer ${
                isActive
                  ? 'text-brand font-bold'
                  : 'text-content-muted hover:text-content-title'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
