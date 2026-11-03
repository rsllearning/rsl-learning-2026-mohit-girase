import React from 'react';
import { Plus, Search, Terminal, SlidersHorizontal, Activity } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  inStockCount: number;
  onAddNewProduct?: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  inStockCount,
  onAddNewProduct,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-surface/85 backdrop-blur-xl border-b border-border-subtle shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar: Brand identity & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-action bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center text-brand shadow-inner">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-brand">
                  APEX CONSOLE
                </span>
                <span className="text-content-muted">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <Activity className="w-3 h-3" />
                  ONLINE
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-content-title tracking-tight flex items-center gap-2">
                Precision Hardware Inventory
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-surface-elevated text-content-muted border border-border-subtle">
                  {inStockCount}/{totalCount} Available
                </span>
              </h1>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onAddNewProduct}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-action bg-brand text-slate-950 hover:bg-brand-hover active:scale-[0.98] transition-all duration-150 shadow-md shadow-brand/20 hover:shadow-brand/40 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register Asset</span>
            </button>
          </div>
        </div>

        {/* Bottom controls: Search bar & category filter chips */}
        <div className="mt-3.5 pt-3 border-t border-border-subtle/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar with shortcut hint */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by SKU, asset name, or acoustic grade..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-canvas/90 border border-border-subtle hover:border-border-strong rounded-action text-content-title placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition-all font-mono"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-elevated text-[10px] font-mono text-content-muted border border-border-subtle pointer-events-none">
              ESC
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-3.5 h-3.5 text-content-muted hidden sm:inline-block mr-1 shrink-0" />
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-action whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-slate-950 font-bold shadow-xs'
                      : 'bg-surface-elevated/70 text-content-muted hover:text-content-title hover:bg-surface-elevated border border-border-subtle'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
