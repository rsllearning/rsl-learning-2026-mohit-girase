import { use } from 'react';
import { UserContext } from '../context/UserContext';

export function Header({ onResetUser, cartCount = 0, isCartPending = false }) {
  // Utilizing React 19's use() API to read Context
  const user = use(UserContext);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-block">
          <span className="brand-icon">🛍️</span>
          <div>
            <h1 className="brand-title">NovaStore</h1>
            <p className="brand-tagline">React 19 Mini E-Commerce</p>
          </div>
        </div>

        <div className="header-actions">
          <div className={`cart-badge-container ${isCartPending ? 'cart-pending' : ''}`}>
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart:</span>
            <span className="cart-counter">{cartCount}</span>
            {isCartPending && (
              <span className="optimistic-tag">Optimistic Update...</span>
            )}
          </div>

          <div className="user-status-card">
            {user ? (
              <div className="user-info">
                <span className="user-avatar" title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="user-details">
                  <span className="user-name">Welcome, {user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                {onResetUser && (
                  <button 
                    onClick={onResetUser} 
                    className="btn-outline-sm"
                    title="Switch or register another user"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="user-info-guest">
                <span className="guest-badge">Guest Mode</span>
                <span className="guest-text">Register below for member checkout</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
