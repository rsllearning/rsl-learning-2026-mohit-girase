import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* 
        DESKTOP SIDEBAR:
        - Visible on medium screens and up: 'hidden md:flex'
        - Fixed width 'w-64', border, sticky layout
        - Pure Tailwind responsive visibility (no JS resize calculation)
      */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-surface border-r border-border-subtle min-h-[calc(100vh-4rem)] p-4 justify-between">
        <div className="space-y-6">
          {/* Brand identifier */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-action bg-brand flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-content-title tracking-tight block">
                NovaStore
              </span>
              <span className="text-xs text-content-muted block">
                Tailwind v4 System
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-action text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-content-muted hover:text-content-title hover:bg-canvas'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info box */}
        <div className="p-3 bg-canvas border border-border-subtle rounded-action text-xs text-content-muted">
          <p className="font-semibold text-content-title">Theme Tokens Active</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand inline-block" title="Brand primary" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" title="Success" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" title="Warning" />
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" title="Danger" />
          </div>
          <p className="mt-1.5 text-[11px] leading-tight">
            Responsive: 1-col (sm), 2-col (md), 3-col (lg).
          </p>
        </div>
      </aside>

      {/* 
        MOBILE NAVIGATION:
        - Visible ONLY on small screens: 'flex md:hidden'
        - Fixed at bottom of screen for easy thumb access
        - Pure Tailwind responsive visibility (no JS resize calculation)
      */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border-subtle px-2 py-2 justify-around shadow-lg">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-action text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'text-brand'
                  : 'text-content-muted hover:text-content-title'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
