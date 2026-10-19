export function LoadingFallback() {
  return (
    <div className="loading-container" aria-live="polite" aria-busy="true">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading catalog with React 19 Suspense &amp; use()...</p>
      
      <div className="skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
