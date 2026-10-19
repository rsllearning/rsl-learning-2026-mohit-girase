const mockProducts = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life."
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    price: 89.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    description: "RGB mechanical keyboard featuring tactile brown switches and durable aluminum frame."
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 249.00,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1580481077195-c3f83464d9f9?w=500&q=80",
    description: "Breathable mesh chair with adjustable lumbar support for all-day working comfort."
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    price: 149.50,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Track your workouts, heart rate, and sleep quality with continuous health monitoring."
  },
  {
    id: 5,
    name: "Minimalist Thermal Bottle",
    price: 29.99,
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    description: "Double-walled vacuum insulated stainless steel bottle keeping drinks cold for 24 hours."
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80",
    description: "Compact waterproof speaker with rich bass and crystal clear 360-degree sound."
  }
];

export function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 1200);
  });
}

// Initial promise created outside of render for React 19's use() API
export let initialProductsPromise = fetchProducts();

export function reloadProductsPromise() {
  initialProductsPromise = fetchProducts();
  return initialProductsPromise;
}
