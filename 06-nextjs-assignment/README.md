# Project Explorer: A Project Management Portal

## Overview

**Project Explorer** is a lightweight, minimal project management portal that allows employees to browse projects, view project details, and navigate different sections of the application. It demonstrates modern Next.js development using the **App Router**, **Server and Client Component architecture**, **nested layouts**, **dynamic routing**, **catch-all routes**, **loading states**, **error handling**, and **React Suspense streaming**.

Designed with a clean, dark-mode-only minimalist interface focusing strictly on the assignment requirements.

---

## Application Structure & Routes

| Route | Section | Description |
|---|---|---|
| `/` | **Home** | Minimal portal introduction and project listing |
| `/about` | **About** | App Router architectural overview and principles |
| `/dashboard` | **Dashboard** | Central hub featuring React Suspense streaming Server Components |
| `/projects` | **Projects** | Primary project catalog with URL search parameter filtering (`?search=`, `?status=`) |
| `/projects/[id]` | **Project Overview** | Dynamic project route with shared nested layout and navigation tabs |
| `/projects/[id]/team` | **Project Team** | Team member roster for the selected project |
| `/projects/[id]/tasks` | **Project Tasks** | Interactive task checklist with client-side status toggles |
| `/projects/[id]/activity` | **Project Activity** | Chronological audit trail and activity log |
| `/projects/[id]/docs/[[...slug]]` | **Catch-All Docs** | Resolves arbitrary documentation paths (e.g., `/projects/1/docs/setup/database`) |
| `/settings` | **Settings** | Local preferences and client storage management |

---

## Key Technical Features

1. **Common Application Layout (`app/layout.tsx`)**:
   - Persistent header (`Navbar`) with active link states, mobile menu, and favorite counter.
   - Persistent minimal footer.
2. **Dedicated Dashboard Layout (`app/dashboard/layout.tsx`)**:
   - Scoped sidebar navigation affecting only `/dashboard` pages.
3. **Dynamic & Nested Routing (`app/projects/[id]/`)**:
   - Shared project header banner and tab navigation across `Overview`, `Team`, `Tasks`, and `Activity`.
4. **Catch-All Documentation Route (`app/projects/[id]/docs/[[...slug]]`)**:
   - Displays requested URL path and extracted route segments.
5. **Server and Client Component Separation**:
   - Reading `searchParams` on the server while client components handle input debouncing and URL updates.
6. **Built-in Loading Experience (`loading.tsx`)**:
   - Immediate feedback via lightweight skeleton components.
7. **Graceful Error Handling (`error.tsx`)**:
   - Friendly error message with an interactive `reset()` retry button.
8. **Suspense Streaming on Dashboard (`app/dashboard/page.tsx`)**:
   - Asynchronously streams slow Server Components (`StreamingStats` and `StreamingActivity`) while rendering the page shell immediately.
9. **Client-Side Interactivity**:
   - Project favoriting with `localStorage` persistence and live navbar counter.
   - Interactive task checklist where clicking items toggles their completion status in real-time.

---

## Running Locally

```bash
# Navigate to the assignment directory
cd 06-nextjs-assignment

# Install dependencies
npm install

# Start the Turbopack development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify the production build:
```bash
npm run build
npm start
```
