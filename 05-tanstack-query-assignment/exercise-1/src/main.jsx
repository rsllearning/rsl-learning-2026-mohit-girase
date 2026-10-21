import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles.css';

const queryClient = new QueryClient();

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: '$99' },
  { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: '$120' },
  { id: 3, name: 'Ergonomic Chair', category: 'Furniture', price: '$250' },
  { id: 4, name: 'Standing Desk', category: 'Furniture', price: '$350' },
  { id: 5, name: 'Coffee Mug', category: 'Kitchen', price: '$15' },
];

async function fetchProducts(search, shouldFail) {
  await new Promise((res) => setTimeout(res, 500));
  if (shouldFail) {
    throw new Error('Simulated API failure.');
  }
  if (!search) return SAMPLE_PRODUCTS;
  return SAMPLE_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );
}

function ProductListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [simulateError, setSimulateError] = useState(false);

  const {
    data: products,
    isPending,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', { search: searchTerm }],
    queryFn: () => fetchProducts(searchTerm, simulateError),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <div className="container">
      <h1>Exercise 1: Product Listing</h1>
      <p className="hint">
        TanStack Query fetching, caching, query keys, and states.
      </p>

      <div className="search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="button" onClick={() => refetch()}>Refresh Products</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
          />
          Simulate API Error
        </label>
      </div>

      {isFetching && !isPending && (
        <div className="fetching">Updating in background...</div>
      )}

      {isPending && <div className="status">Loading products...</div>}

      {isError && (
        <div className="error">
          <p>{error?.message || 'Failed to load products.'}</p>
          <button type="button" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {isSuccess && products && (
        <>
          <div className="success">Products loaded successfully ({products.length})</div>
          <div className="grid">
            {products.map((product) => (
              <div key={product.id} className="card">
                <h2>{product.name}</h2>
                <p className="hint">Category: {product.category}</p>
                <p><strong>{product.price}</strong></p>
              </div>
            ))}
            {products.length === 0 && <p className="hint">No matching products found.</p>}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductListing />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
