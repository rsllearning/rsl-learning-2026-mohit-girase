import { useState, useRef } from 'react';
import { QuantityInput } from './QuantityInput';

export function ProductDetails({ product, cartCount, isCartPending, onAddToCart, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // React 19 Feature: Ref as a Prop (passed directly to QuantityInput without forwardRef)
  const quantityInputRef = useRef(null);

  const handleFocusQuantity = () => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  };

  const handleAddToCartClick = async () => {
    setFeedback(null);
    try {
      await onAddToCart(quantity, simulateFailure);
      setFeedback({ 
        type: "success", 
        text: `Successfully added ${quantity}x "${product.name}" to cart!` 
      });
    } catch (error) {
      setFeedback({ 
        type: "error", 
        text: `${error.message || "Network Error"} — Cart count automatically rolled back!` 
      });
    }
  };

  return (
    <div className="product-details-backdrop" onClick={onClose}>
      <section 
        className="product-details-card" 
        onClick={(e) => e.stopPropagation()}
        // React 19 Feature: Ref Cleanup Function
        // Callback ref returns a cleanup function called automatically when unmounted
        ref={(element) => {
          if (!element) return;
          const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
          };
          window.addEventListener("keydown", handleKeyDown);

          return () => {
            window.removeEventListener("keydown", handleKeyDown);
          };
        }}
      >
        <div className="details-header">
          <span className="details-tag">{product.category}</span>
          <button onClick={onClose} className="btn-close" title="Close (or press Esc)">✕</button>
        </div>

        <div className="details-body">
          <div className="details-image-wrapper">
            <img src={product.image} alt={product.name} className="details-image" />
          </div>

          <div className="details-content">
            <h2 className="details-title">{product.name}</h2>
            <p className="details-price">${product.price.toFixed(2)}</p>
            <p className="details-description">{product.description}</p>

            <div className="ref-demo-box">
              <div className="ref-input-row">
                {/* React 19 Ref as a Prop passed directly */}
                <QuantityInput 
                  ref={quantityInputRef} 
                  value={quantity} 
                  onChange={setQuantity} 
                />
                <button 
                  type="button" 
                  onClick={handleFocusQuantity} 
                  className="btn-outline-sm"
                  title="Demonstrates Ref as a Prop direct DOM focus"
                >
                  ⚡ Focus Input (Ref)
                </button>
              </div>
              <span className="ref-note">
                💡 <strong>Ref Cleanup Active:</strong> Press <code>Esc</code> to test callback-ref auto-cleanup.
              </span>
            </div>

            <div className="cart-controls">
              <label className="failure-toggle">
                <input 
                  type="checkbox" 
                  checked={simulateFailure} 
                  onChange={(e) => setSimulateFailure(e.target.checked)} 
                />
                <span>Simulate API Error (Test Optimistic Rollback)</span>
              </label>

              <button 
                type="button" 
                onClick={handleAddToCartClick} 
                disabled={isCartPending}
                className={`btn-add-cart ${isCartPending ? 'btn-cart-pending' : ''}`}
              >
                {isCartPending ? (
                  <span className="btn-spinner-text">
                    <span className="spinner-sm"></span> Adding... (Optimistic Count: {cartCount})
                  </span>
                ) : (
                  `Add to Cart (${quantity}) • Total $${(product.price * quantity).toFixed(2)}`
                )}
              </button>
            </div>

            {isCartPending && (
              <div className="optimistic-live-banner" role="status">
                ⏳ <strong>useOptimistic() Active:</strong> Header cart count immediately set to <strong>{cartCount}</strong> while the 2.5s network request completes!
              </div>
            )}

            {feedback && (
              <div className={`details-alert alert-${feedback.type}`}>
                {feedback.text}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
