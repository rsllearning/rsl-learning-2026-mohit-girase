import React from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-surface rounded-card border border-border-subtle p-8">
        <p className="text-content-title font-semibold text-lg">No products found</p>
        <p className="text-content-muted text-sm mt-1">Try adjusting your filters or category selection.</p>
      </div>
    );
  }

  return (
    /* Responsive Product Grid:
       - Small screens: 1 column (grid-cols-1)
       - Medium screens: 2 columns (md:grid-cols-2)
       - Large screens: 3 columns (lg:grid-cols-3)
       All handled via pure Tailwind utilities without any JS resize listeners */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-dash-gap">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
