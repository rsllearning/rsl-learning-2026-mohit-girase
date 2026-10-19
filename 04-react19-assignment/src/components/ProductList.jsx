import { use } from 'react';
import { ProductCard } from './ProductCard';

export function ProductList({ productsPromise, onSelectProduct }) {
  // Utilizing React 19's use() API to consume Promise directly during render
  const products = use(productsPromise);

  if (!products || products.length === 0) {
    return <p className="no-products">No products currently available.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onSelect={onSelectProduct} 
        />
      ))}
    </div>
  );
}
