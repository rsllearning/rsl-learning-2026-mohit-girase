// React 19 Feature: Ref as a Prop
// Function components can receive 'ref' directly as a regular prop without forwardRef()
export function QuantityInput({ ref, value, onChange, min = 1, max = 10 }) {
  return (
    <div className="quantity-input-group">
      <label htmlFor="product-qty" className="quantity-label">Quantity:</label>
      <input
        id="product-qty"
        ref={ref}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        className="quantity-input"
      />
    </div>
  );
}
