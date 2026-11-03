import { useState, useMemo } from 'react';
import { initialProducts } from './data/products';
import type { Product } from './types/product';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProductGrid } from './components/ProductGrid';
import { Palette, Check, X, Cpu, CheckCircle2 } from 'lucide-react';

export function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeBrandColor, setActiveBrandColor] = useState('#06b6d4');

  // New asset form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Acoustics');
  const [newProductPrice, setNewProductPrice] = useState('499.00');
  const [newProductStock, setNewProductStock] = useState('12');
  const [newProductSpecs, setNewProductSpecs] = useState('Custom BSI Sensor • Precision CNC');

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
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
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
    }, 3200);
  };

  const handleAddToCart = (product: Product) => {
    if (product.status === 'out_of_stock') return;
    showToast(`Unit [${product.sku}] added to procurement queue.`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const stock = parseInt(newProductStock, 10) || 0;
    const price = parseFloat(newProductPrice) || 299.00;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sku: `APX-${Math.floor(100 + Math.random() * 900)}`,
      name: newProductName,
      category: newProductCategory,
      price,
      rating: 5.0,
      status: stock > 5 ? 'in_stock' : stock > 0 ? 'low_stock' : 'out_of_stock',
      stockCount: stock,
      imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
      specs: newProductSpecs,
      description: 'Factory-calibrated hardware asset initialized into local procurement directory.',
    };

    setProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    setNewProductName('');
    showToast(`Registered "${newProd.name}" (${newProd.sku})`);
  };

  // Verification Step 7:
  // "Change one of the configured theme/design-token values and verify that the corresponding UI elements update consistently."
  const applyBrandToken = (color: string) => {
    setActiveBrandColor(color);
    document.documentElement.style.setProperty('--color-brand', color);
    showToast(`Design token --color-brand updated to ${color}`);
  };

  return (
    <div className="min-h-screen bg-canvas text-content-body flex flex-col antialiased selection:bg-brand selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-surface-elevated/95 backdrop-blur-md border border-border-strong text-content-title text-xs font-mono font-medium rounded-action shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 md:pb-10">
        {/* Adaptive Sidebar (Desktop sidebar + Mobile bottom bar) */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Design Token Live Theme Panel */}
          <section className="mb-6 bg-surface/70 backdrop-blur-md border border-border-subtle hover:border-border-strong rounded-card p-4 shadow-sm transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-action bg-surface-elevated border border-border-subtle flex items-center justify-center text-brand">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-content-title">
                    Theme Accent
                  </h2>
                  <p className="text-[11px] font-mono text-content-muted">
                    Primary palette: <code className="text-brand font-bold">{activeBrandColor}</code>
                  </p>
                </div>
              </div>

              {/* Token palette chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { name: 'Cyber Cyan', hex: '#06b6d4' },
                  { name: 'Emerald Pro', hex: '#10b981' },
                  { name: 'Nordic Gold', hex: '#f59e0b' },
                  { name: 'Vapor Violet', hex: '#a855f7' },
                  { name: 'Rose Titanium', hex: '#f43f5e' },
                ].map((token) => (
                  <button
                    key={token.hex}
                    type="button"
                    onClick={() => applyBrandToken(token.hex)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-action border border-border-subtle bg-surface-elevated/50 hover:bg-surface-elevated transition-colors cursor-pointer"
                    title={`Switch token to ${token.name}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                      style={{ backgroundColor: token.hex }}
                    />
                    <span className="text-[11px] font-medium text-content-title">{token.name.split(' ')[0]}</span>
                    {activeBrandColor === token.hex && (
                      <Check className="w-3 h-3 text-brand ml-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section Heading & Grid Description */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-content-title">
                  HARDWARE MATRIX
                </h2>
              </div>
              <p className="text-xs font-mono text-content-muted mt-0.5">
                Active inventory units deployed across infrastructure
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-elevated text-content-body border border-border-subtle">
              Showing {filteredProducts.length} units
            </span>
          </div>

          {/* Product Grid Component */}
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>

      {/* Register Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 backdrop-blur-md p-4">
          <div className="bg-surface rounded-card border border-border-strong shadow-2xl w-full max-w-md p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-content-title">
                  Register Hardware Asset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-content-muted hover:text-content-title p-1 rounded-action hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted mb-1.5">
                  Asset Title
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Reference Planar Master DAC"
                  className="w-full px-3 py-2 text-xs font-mono bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option value="Acoustics">Acoustics</option>
                    <option value="Displays">Displays</option>
                    <option value="Optics">Optics</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted mb-1.5">
                    Unit Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted mb-1.5">
                  Technical Specifications
                </label>
                <input
                  type="text"
                  value={newProductSpecs}
                  onChange={(e) => setNewProductSpecs(e.target.value)}
                  placeholder="e.g. Dual 40mm Beryllium Drivers"
                  className="w-full px-3 py-2 text-xs font-mono bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted mb-1.5">
                  Stock Allocation (0 = Out of Stock)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-canvas border border-border-subtle rounded-action text-content-title focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <span className="text-[10px] font-mono text-content-muted mt-1.5 block">
                  Set 0 to mark asset as backordered.
                </span>
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold rounded-action text-content-muted hover:text-content-title hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-action bg-brand text-slate-950 hover:bg-brand-hover transition-colors shadow-sm cursor-pointer"
                >
                  Deploy Asset
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
