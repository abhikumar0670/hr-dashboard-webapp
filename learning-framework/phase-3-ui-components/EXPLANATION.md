# Phase 3: UI Components

## Goal
Build reusable UI components and set up the app layout and navigation.

## What You'll Learn
- How to create and use reusable React components
- How to structure your UI for scalability
- How to implement navigation with Next.js

## Step-by-Step Guide

### 1. Component Basics
- Components are the building blocks of React apps.
- Example:
  ```tsx
  function Button({ children, onClick }) {
    return <button onClick={onClick}>{children}</button>;
  }
  ```

### 2. Layout Components
- Create a `Navbar` for navigation.
- Use a `Layout` component to wrap your pages.

### 3. Organizing Components
- Store components in `src/components/`.
- Use folders for related components (e.g., `ui/`, `layout/`).

### 4. Navigation
- Use Next.js file-based routing (`src/app/`).
- Add links in the `Navbar` to different pages (e.g., Dashboard, Employees, Analytics).

## Resources
- [React Components](https://react.dev/learn/your-first-component)
- [Component-Driven Development](https://storybook.js.org/docs/react/get-started/introduction)
- [Next.js Routing](https://nextjs.org/docs/pages/building-your-application/routing)

---

In this phase, focus on building and reusing components. Try creating your own Button, Card, and Navbar! 