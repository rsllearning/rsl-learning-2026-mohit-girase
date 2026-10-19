import { useState, Suspense } from 'react';
import { preload, preconnect } from 'react-dom';
import { UserContext } from './context/UserContext';
import { initialProductsPromise, reloadProductsPromise } from './api/productsApi';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { ProductList } from './components/ProductList';
import { LoadingFallback } from './components/LoadingFallback';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// React 19 Asset Loading APIs:
// 1. preconnect() establishes an early connection to the image CDN domain, reducing DNS and TLS handshake latency.
preconnect("https://images.unsplash.com");

// 2. preload() initiates early downloading of the primary product hero image so it is ready when the product grid renders.
preload("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", {
  as: "image",
});

export default function App() {
  const [user, setUser] = useState(null);
  const [productsPromise, setProductsPromise] = useState(initialProductsPromise);

  const handleRegisterSuccess = (newUser) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRefreshProducts = () => {
    setProductsPromise(reloadProductsPromise());
  };

  return (
    // React 19 Context syntax: <UserContext value={...}> instead of <UserContext.Provider value={...}>
    <UserContext value={user}>
      {/* React 19 Document Metadata: natively hoisted to <head> */}
      <title>Mini E-Commerce Store – Products</title>
      <meta 
        name="description" 
        content="Browse curated premium products with modern React 19 features including Actions, use() API, and native metadata." 
      />

      <div className="app-layout">
        <Header onResetUser={user ? handleLogout : null} />

        <main className="main-content">
          <div className="layout-grid">
            <aside className="sidebar">
              <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
            </aside>

            <section className="catalog-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Featured Products</h2>
                  <p className="section-desc">
                    Asynchronously loaded using React 19 <code>use()</code> and <code>&lt;Suspense&gt;</code>.
                  </p>
                </div>
                <button 
                  onClick={handleRefreshProducts} 
                  className="btn-reload"
                  title="Reload to view Suspense fallback again"
                >
                  ↻ Refresh Catalog
                </button>
              </div>

              <ErrorBoundary onRetry={handleRefreshProducts}>
                <Suspense fallback={<LoadingFallback />}>
                  <ProductList productsPromise={productsPromise} />
                </Suspense>
              </ErrorBoundary>
            </section>
          </div>
        </main>
      </div>
    </UserContext>
  );
}
