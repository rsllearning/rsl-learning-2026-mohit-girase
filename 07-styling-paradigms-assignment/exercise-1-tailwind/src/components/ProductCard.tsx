import React from 'react';
import type { Product, ProductStatus } from '../types/product';
import { ShoppingCart, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.status === 'out_of_stock';

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            In Stock ({product.stockCount})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Low Stock ({product.stockCount} left)
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Out of Stock
          </span>
        );
    }
  };

  return (
    <article className="group flex flex-col justify-between bg-surface rounded-card border border-border-subtle p-card-p shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Product Image container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2.5 right-2.5">
            {getStatusBadge(product.status)}
          </div>
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs font-semibold text-content-muted uppercase tracking-wider mb-1.5">
          <span>{product.category}</span>
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-content-title line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-content-body line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer: Price and Action Button */}
      <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-4 mt-auto">
        <div>
          <span className="text-xs text-content-muted block font-medium">Price</span>
          <span className="text-xl font-extrabold text-content-title">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Action Button: fulfills Requirements 3, 5 (hover, disabled, focus) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-action bg-brand text-white shadow-sm transition-all duration-150 hover:bg-brand-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand disabled:active:scale-100 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
        </button>
      </div>
    </article>
  );
};
