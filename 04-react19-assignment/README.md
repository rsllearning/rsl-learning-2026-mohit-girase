# React 19 Features Assignment - E-Commerce Application

This project implements **Task 1** and **Task 2** of the React 19 assignment, demonstrating the headline features introduced in React 19 within a clean, practical Mini E-Commerce application.

---

## Task 1: Product Listing & Registration Flow

### 1. `use()` API for Asynchronous Resources
- **Where**: [`src/components/ProductList.jsx`](./src/components/ProductList.jsx)
- **How it works**: Uses `use(productsPromise)` directly in the component body to read product data during rendering.
- **Outside-Render Promise Rule**: Per React 19 guidelines, the promise is created outside the render cycle in [`src/api/productsApi.js`](./src/api/productsApi.js) (and refreshed through state) to avoid recreating promises on each render.
- **Context Reading**: In [`src/components/Header.jsx`](./src/components/Header.jsx), `use(UserContext)` reads context values, demonstrating `use()`'s flexibility.

### 2. `<Suspense>` with Loading Fallback
- **Where**: [`src/App.jsx`](./src/App.jsx)
- **How it works**: `<ProductList>` is wrapped in `<Suspense fallback={<LoadingFallback />}>`. While the simulated network request resolves, React displays an animated skeleton and spinner.
- **Error Handling**: Wrapped in [`src/components/ErrorBoundary.jsx`](./src/components/ErrorBoundary.jsx) to catch and display any asynchronous promise rejections with a retry button.

### 3. `useActionState()` for Form Actions
- **Where**: [`src/components/RegistrationForm.jsx`](./src/components/RegistrationForm.jsx)
- **How it works**: Manages form submission without an `onSubmit` handler or `event.preventDefault()`.
- Automatically tracks:
  - `state`: validation errors, success flags, and messages returned by the action.
  - `formAction`: wrapped action function passed directly to `<form action={formAction}>`.
  - `isPending`: boolean indicating when the simulated async registration is active.

### 4. `useFormStatus()` in Child Form Components
- **Where**: [`src/components/SubmitButton.jsx`](./src/components/SubmitButton.jsx)
- **How it works**: Imported from `react-dom`. Reads `{ pending }` directly from the parent `<form>` without prop drilling, disabling the button and displaying a loading spinner while submitting.

### 5. React 19 Context Syntax (`<Context value={...}>`)
- **Where**: [`src/App.jsx`](./src/App.jsx) and [`src/context/UserContext.js`](./src/context/UserContext.js)
- **How it works**: Uses `<UserContext value={user}>` directly instead of the legacy `<UserContext.Provider value={user}>`.
- The registered user's profile information is read and displayed dynamically in [`src/components/Header.jsx`](./src/components/Header.jsx).

### 6. React 19 Asset Loading APIs (`react-dom`)
- **Where**: [`src/App.jsx`](./src/App.jsx)
- `preconnect("https://images.unsplash.com")`: Establishes early TCP/TLS connections to the image CDN before elements request images, cutting latency.
- `preload("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", { as: "image" })`: Initiates early downloading of the hero product image before the grid finishes rendering.

### 7. Native Document Metadata
- **Where**: [`src/App.jsx`](./src/App.jsx)
- **How it works**: Directly renders `<title>` and `<meta name="description">` inside React components. React 19 automatically hoists them to the HTML `<head>` and updates them dynamically (e.g., when a product details card opens).

---

## Task 2: Enhancements (Product Details, Optimistic Cart & Refs)

### 1. Product Details Section
- **Where**: [`src/components/ProductDetails.jsx`](./src/components/ProductDetails.jsx)
- **How it works**: Clicking **"View Details"** on any product card in [`src/components/ProductCard.jsx`](./src/components/ProductCard.jsx) opens the product details overlay displaying the full image, price, category, and description.

### 2. `useOptimistic()` Add to Cart Flow
- **Where**: [`src/components/ProductDetails.jsx`](./src/components/ProductDetails.jsx)
- **How it works**:
  1. User clicks **"Add to Cart"**.
  2. Inside a `startTransition`, `setOptimisticCartCount(quantity)` runs immediately, updating the cart badge in real-time before the server request completes.
  3. The button displays `"Adding... (Optimistic Count: X)"` during the in-flight simulated API request.
  4. **Rollback on Error**: A *"Simulate API Error"* toggle is provided. When checked, the API throws an error; React's `useOptimistic` hook automatically rolls back the cart counter to its real value and displays an error message.

### 3. Ref as a Prop (No `forwardRef`)
- **Where**: [`src/components/QuantityInput.jsx`](./src/components/QuantityInput.jsx)
- **How it works**: In React 19, function components accept `ref` directly as a regular prop:
  ```jsx
  export function QuantityInput({ ref, value, onChange }) {
    return <input ref={ref} type="number" ... />;
  }
  ```
- **DOM Operation**: In `ProductDetails`, clicking the **"Focus Input (Ref)"** button invokes `quantityInputRef.current.focus()` and selects the input without needing `forwardRef()`.

### 4. Ref Cleanup Function
- **Where**: [`src/components/ProductDetails.jsx`](./src/components/ProductDetails.jsx)
- **How it works**: Callback refs in React 19 can return a cleanup function:
  ```jsx
  ref={(element) => {
    if (!element) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // React 19 Ref Cleanup Function:
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }}
  ```
- When the Product Details card unmounts (or user presses `Esc`), React automatically executes the cleanup function, co-locating setup and teardown without a separate `useEffect`.

---

## Conceptual & Architectural Concepts

### 5. Server & Client Components Architecture
In a full-stack framework (such as Next.js with React 19 RSC):
1. **Why Product Details can be a Server Component**:
   - Product data (title, price, description, images) is static or fetched from a database.
   - A Server Component can query the database directly without exposing API keys, sending zero JavaScript to the client for rendering the markup, which improves initial load speed and SEO.
2. **Why Add to Cart must be a Client Component (`"use client"`)**:
   - It requires browser interactivity: client state (`useState`), `useOptimistic()`, transitions (`useTransition`), and DOM event handlers (`onClick`).
   - Server Components cannot use hooks or attach client event listeners.
3. **How They Work Together**:
   - The Server Component renders the product shell and data on the server, importing and embedding `<AddToCartButton productId={product.id} />` as an interactive client island.

### 6. React Compiler
- **What it does**: React Compiler is a build-time optimization tool that automatically memoizes values, calculations, and component render outputs based on the Rules of React.
- **How it optimizes this application**:
  - Automatically avoids unnecessary re-renders of `<ProductCard>` or `<QuantityInput>` when parent states (like cart count or user state) update.
  - Automatically memoizes callback handlers like `handleAddToCart` and total price calculations (`product.price * quantity`) without needing manual `useMemo()` or `useCallback()`.
  - **Example**: In our app, calculating the line total or re-rendering unchanged product cards would previously need `React.memo(ProductCard)` and `useCallback(onSelect)`; React Compiler applies these safe optimizations automatically at build time.

---

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```
