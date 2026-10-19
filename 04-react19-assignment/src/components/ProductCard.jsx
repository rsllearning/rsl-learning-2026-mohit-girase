export function ProductCard({ product, onSelect }) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image" 
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            type="button" 
            onClick={() => onSelect(product)} 
            className="btn-view-details"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
