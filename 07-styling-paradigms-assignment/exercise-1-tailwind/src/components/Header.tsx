import React from 'react';
import { Plus, SlidersHorizontal, Package, Bell } from 'lucide-react';

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
    <header className="bg-surface border-b border-border-subtle sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top row: Title and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-content-title tracking-tight">
                Product Catalog
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-light text-brand">
                <Package className="w-3.5 h-3.5" />
                {inStockCount}/{totalCount} Active
              </span>
            </div>
            <p className="text-sm text-content-muted mt-0.5">
              Manage inventory, pricing, and fulfillment across all categories.
            </p>
          </div>

          {/* Action Button: Hover, Focus, Active state styling */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-content-muted hover:text-content-title hover:bg-canvas rounded-action transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onAddNewProduct}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-action bg-brand text-white shadow-sm hover:bg-brand-hover active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Search & category filter pills */}
        <div className="mt-4 pt-3 border-t border-border-subtle/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-3.5 pr-4 py-2 text-sm bg-canvas border border-border-subtle rounded-action text-content-title placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-content-muted hidden sm:inline-block mr-1 shrink-0" />
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-xs'
                      : 'bg-canvas text-content-muted hover:text-content-title hover:bg-surface-hover border border-border-subtle'
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
