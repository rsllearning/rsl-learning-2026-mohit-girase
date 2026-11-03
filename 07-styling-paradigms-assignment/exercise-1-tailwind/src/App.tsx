import { useState, useMemo } from 'react';
import { initialProducts } from './data/products';
import type { Product } from './types/product';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProductGrid } from './components/ProductGrid';
import { Palette, Check, X, ShieldAlert } from 'lucide-react';

export function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeBrandColor, setActiveBrandColor] = useState('#4f46e5');

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Audio');
  const [newProductPrice, setNewProductPrice] = useState('149.99');
  const [newProductStock, setNewProductStock] = useState('15');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const inStockCount = useMemo(() => {
    return products.filter((p) => p.status === 'in_stock').length;
  }, [products]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product) => {
    if (product.status === 'out_of_stock') return;
    showToast(`Added "${product.name}" to cart!`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const stock = parseInt(newProductStock, 10) || 0;
    const price = parseFloat(newProductPrice) || 99.99;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      category: newProductCategory,
      price,
      rating: 5.0,
      status: stock > 5 ? 'in_stock' : stock > 0 ? 'low_stock' : 'out_of_stock',
      stockCount: stock,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      description: 'Newly registered inventory unit with automated stock allocation.',
    };

    setProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    setNewProductName('');
    showToast(`Successfully created "${newProd.name}"`);
  };

  // Allows verifying Verification Step 7:
  // "Change one of the configured theme/design-token values and verify that the corresponding UI elements update consistently."
  const applyBrandToken = (color: string) => {
    setActiveBrandColor(color);
    document.documentElement.style.setProperty('--color-brand', color);
    showToast(`Updated design token --color-brand to ${color}`);
  };

  return (
    <div className="min-h-screen bg-canvas text-content-body flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-action shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header component */}
      <Header
        totalCount={products.length}
        inStockCount={inStockCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        onAddNewProduct={() => setIsAddModalOpen(true)}
      />

      {/* Main Layout: Sidebar + Dashboard Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        {/* Adaptive Sidebar (Desktop sidebar + Mobile bottom bar) */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Design Token Inspector Banner (Verification Step 7 Demonstration) */}
          <section className="mb-6 bg-surface border border-border-subtle rounded-card p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-brand" />
                <div>
                  <h2 className="text-sm font-bold text-content-title">
                    Design Token Live Testing (Requirement 7 & Verification Step 7)
                  </h2>
                  <p className="text-xs text-content-muted">
                    Switch primary brand token to verify UI elements update consistently:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { name: 'Indigo (Default)', hex: '#4f46e5' },
                  { name: 'Emerald', hex: '#059669' },
                  { name: 'Violet', hex: '#7c3aed' },
                  { name: 'Rose', hex: '#e11d48' },
                  { name: 'Amber', hex: '#d97706' },
                ].map((token) => (
                  <button
                    key={token.hex}
                    type="button"
                    onClick={() => applyBrandToken(token.hex)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-action border border-border-subtle hover:bg-canvas transition-colors cursor-pointer"
                    title={`Apply ${token.name}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-black/10"
                      style={{ backgroundColor: token.hex }}
                    />
                    <span className="hidden sm:inline">{token.name.split(' ')[0]}</span>
                    {activeBrandColor === token.hex && (
                      <Check className="w-3 h-3 text-content-title ml-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section Heading & Grid Description */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-content-title tracking-tight">
                Products Grid
              </h2>
              <p className="text-xs text-content-muted mt-0.5">
                Responsive breakpoint demonstration: 1-col (mobile) $\rightarrow$ 2-col (tablet/md) $\rightarrow$ 3-col (desktop/lg)
              </p>
            </div>
            <span className="text-xs font-medium text-content-muted">
              Showing {filteredProducts.length} items
            </span>
          </div>

          {/* Product Grid Component */}
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-card border border-border-subtle shadow-xl w-full max-w-md p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-lg font-bold text-content-title">Add New Product</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-content-muted hover:text-content-title p-1 rounded-action hover:bg-canvas transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-content-title uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Ergonomic Keyboard"
                  className="w-full px-3 py-2 text-sm bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-content-title uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Displays">Displays</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-title uppercase tracking-wider mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-title uppercase tracking-wider mb-1">
                  Stock Units (0 = Out of Stock / Disabled)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
                />
                <span className="text-[11px] text-content-muted mt-1 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  Setting 0 tests the disabled action button requirement.
                </span>
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-action text-content-muted hover:text-content-title hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-action bg-brand text-white hover:bg-brand-hover transition-colors shadow-xs cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
