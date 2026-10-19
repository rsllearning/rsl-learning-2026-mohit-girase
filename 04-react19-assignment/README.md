# React 19 Features Assignment - Task 1: E-Commerce Product Listing & Registration Flow

This project demonstrates core features introduced in **React 19** within a Mini E-Commerce application. It covers asynchronous data handling, form actions, state management, context, metadata, and asset loading.

---

## React 19 Features Demonstrated

### 1. `use()` API for Asynchronous Resources
- **Implementation**: In [`src/components/ProductList.jsx`](./src/components/ProductList.jsx), `use(productsPromise)` is used directly within the component body to read the product data Promise during rendering.
- **Outside-Render Promise Creation**: In accordance with React 19 guidelines, the Promise is initialized outside the render cycle in [`src/api/productsApi.js`](./src/api/productsApi.js) (and refreshed through state) to prevent re-creating promises on every render.
- **Context Consumption**: In [`src/components/Header.jsx`](./src/components/Header.jsx), `use(UserContext)` is used to read context values, demonstrating `use()`'s ability to read Context conditionally.

### 2. `<Suspense>` with Loading Fallback
- **Implementation**: In [`src/App.jsx`](./src/App.jsx), `<ProductList>` is wrapped inside `<Suspense fallback={<LoadingFallback />}>`.
- While `use(productsPromise)` is suspended, React displays `<LoadingFallback />` (with animated skeletons and a spinner) until the simulated network request completes.
- Error handling is integrated using [`src/components/ErrorBoundary.jsx`](./src/components/ErrorBoundary.jsx) to catch and display any promise rejections.

### 3. `useActionState()` for Form Actions
- **Implementation**: In [`src/components/RegistrationForm.jsx`](./src/components/RegistrationForm.jsx), `useActionState()` manages the registration form submission without a traditional `onSubmit` handler or manual `event.preventDefault()`.
- It tracks:
  - `state`: validation errors, success flags, and messages returned by the action function.
  - `formAction`: the wrapped action passed directly to `<form action={formAction}>`.
  - `isPending`: automatic pending indicator while the asynchronous mutation is running.

### 4. `useFormStatus()` in Child Form Components
- **Implementation**: In [`src/components/SubmitButton.jsx`](./src/components/SubmitButton.jsx), `useFormStatus()` is imported from `react-dom`.
- It accesses the parent `<form>`'s pending state directly without any prop-drilling:
  ```jsx
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Submitting..." : "Register Now"}</button>;
  ```

### 5. React 19 Context Syntax (`<Context value={...}>`)
- **Implementation**: Instead of the legacy `<UserContext.Provider value={...}>`, React 19 allows rendering the context object directly as a provider in [`src/App.jsx`](./src/App.jsx):
  ```jsx
  <UserContext value={user}>
    ...
  </UserContext>
  ```
- The registered user's profile information is read and displayed dynamically in [`src/components/Header.jsx`](./src/components/Header.jsx).

### 6. React 19 Asset Loading APIs (`react-dom`)
- **Implementation**: In [`src/App.jsx`](./src/App.jsx):
  - `preconnect("https://images.unsplash.com")`: Establishes an early network connection (DNS lookup, TCP handshake, TLS negotiation) to the external image CDN before images are rendered.
  - `preload("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", { as: "image" })`: Starts downloading the first hero product image early to avoid layout shift and improve Core Web Vitals (LCP).

### 7. Native Document Metadata Support
- **Implementation**: In [`src/App.jsx`](./src/App.jsx), `<title>` and `<meta>` tags are rendered directly inside the React component tree:
  ```jsx
  <title>Mini E-Commerce Store – Products</title>
  <meta name="description" content="Browse curated premium products with modern React 19 features." />
  ```
- React 19 automatically hoists these tags to the document `<head>` and manages them cleanly without third-party libraries (e.g., `react-helmet`).

---

## Project Setup & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```
