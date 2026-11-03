import React from 'react';
import type { Product, ProductStatus } from '../types/product';
import { ShoppingBag, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.status === 'out_of_stock';

  const renderStatus = (status: ProductStatus) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            In Stock ({product.stockCount})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/60 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            Only {product.stockCount} Left
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60 shadow-xs">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Backorder
          </span>
        );
    }
  };

  return (
    <article className="group relative flex flex-col justify-between bg-surface/90 hover:bg-surface border border-border-subtle hover:border-brand/50 rounded-card p-card-p transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-brand/5 overflow-hidden">
      {/* Subtle top edge gradient bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Product Image Stage */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-elevated border border-border-subtle/50 mb-5">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-transparent opacity-60" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider font-semibold uppercase bg-slate-900/80 text-content-body border border-border-strong backdrop-blur-xs">
              {product.sku}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            {renderStatus(product.status)}
          </div>

          {/* Bottom photo overlay info */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-content-body">
            <span className="font-medium tracking-wide text-[11px] text-content-title/80">
              {product.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-amber-400">
              ★ {product.rating.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-content-title tracking-tight line-clamp-1 mb-1 group-hover:text-brand transition-colors">
          {product.name}
        </h3>

        {/* Technical specs pill */}
        <div className="inline-flex items-center gap-1 text-[11px] font-mono text-content-muted mb-3 bg-surface-elevated/70 px-2 py-0.5 rounded border border-border-subtle/80">
          <ShieldCheck className="w-3 h-3 text-brand" />
          <span className="line-clamp-1">{product.specs}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-content-body leading-relaxed line-clamp-2 mb-5">
          {product.description}
        </p>
      </div>

      {/* Footer: Price + State-driven Action Button */}
      <div className="pt-4 border-t border-border-subtle/70 flex items-center justify-between gap-3 mt-auto">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-content-muted block">
            Enterprise Unit
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-extrabold text-content-title tracking-tight">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-content-muted">USD</span>
          </div>
        </div>

        {/* Action Button fulfilling Requirements 3 & 5 (hover, focus ring, disabled) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-action transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-canvas active:scale-[0.97] ${
            isOutOfStock
              ? 'bg-surface-elevated text-content-muted border border-border-subtle opacity-40 cursor-not-allowed hover:bg-surface-elevated active:scale-100 shadow-none'
              : 'bg-brand text-slate-950 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/25 shadow-sm'
          }`}
        >
          {isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Acquire</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </article>
  );
};
