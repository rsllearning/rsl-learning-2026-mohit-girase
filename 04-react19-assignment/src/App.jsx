import { useState, Suspense, useTransition, useOptimistic } from 'react';
import { preload, preconnect } from 'react-dom';
import { UserContext } from './context/UserContext';
import { initialProductsPromise, reloadProductsPromise } from './api/productsApi';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { ProductList } from './components/ProductList';
import { ProductDetails } from './components/ProductDetails';
import { LoadingFallback } from './components/LoadingFallback';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// React 19 Asset Loading APIs:
// 1. preconnect() establishes early connection to external CDN domain
preconnect("https://images.unsplash.com");

// 2. preload() initiates early download of key product image
preload("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", {
  as: "image",
});

export default function App() {
  const [user, setUser] = useState(null);
  const [productsPromise, setProductsPromise] = useState(initialProductsPromise);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Real cart state
  const [cartCount, setCartCount] = useState(0);
  const [isCartPending, startCartTransition] = useTransition();

  // React 19 Feature: useOptimistic Hook
  // Updates cart count immediately during transitions across the whole application
  const [optimisticCartCount, setOptimisticCartCount] = useOptimistic(
    cartCount,
    (current, added) => current + added
  );

  const handleRegisterSuccess = (newUser) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRefreshProducts = () => {
    setProductsPromise(reloadProductsPromise());
  };

  // Async Cart API with 2.5s delay to allow easy screenshot capture of the optimistic in-flight state
  const handleAddToCart = async (quantity, shouldFail) => {
    return new Promise((resolve, reject) => {
      startCartTransition(async () => {
        // Step 1: Immediate optimistic update
        setOptimisticCartCount(quantity);

        // Step 2: 2.5s simulated network request
        await new Promise((res) => setTimeout(res, 2500));

        if (shouldFail) {
          // Step 3 (error): Reject - React automatically rolls back optimisticCartCount to real cartCount
          reject(new Error("Simulated Server Error 500: Inventory sync failed"));
        } else {
          // Step 3 (success): Commit real state
          setCartCount((prev) => prev + quantity);
          resolve();
        }
      });
    });
  };

  return (
    // React 19 Context syntax: <UserContext value={...}> directly
    <UserContext value={user}>
      {/* React 19 Document Metadata: dynamically changes title based on selected product */}
      <title>
        {selectedProduct 
          ? `${selectedProduct.name} – NovaStore` 
          : "Mini E-Commerce Store – Products"}
      </title>
      <meta 
        name="description" 
        content={
          selectedProduct 
            ? `Buy ${selectedProduct.name} online at NovaStore.` 
            : "Browse curated premium products with modern React 19 features."
        } 
      />

      <div className="app-layout">
        <Header 
          onResetUser={user ? handleLogout : null} 
          cartCount={optimisticCartCount}
          isCartPending={isCartPending}
        />

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
                    Click <strong>View Details</strong> to test React 19 <code>useOptimistic()</code>, Ref as a Prop, and Ref Cleanup.
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
                  <ProductList 
                    productsPromise={productsPromise} 
                    onSelectProduct={setSelectedProduct} 
                  />
                </Suspense>
              </ErrorBoundary>
            </section>
          </div>
        </main>

        {selectedProduct && (
          <ProductDetails 
            product={selectedProduct} 
            cartCount={optimisticCartCount}
            isCartPending={isCartPending}
            onAddToCart={handleAddToCart}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </UserContext>
  );
}
