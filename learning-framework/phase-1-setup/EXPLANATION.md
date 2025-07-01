# Phase 1: Setup

## Goal
Set up the foundation for the HR Performance Dashboard using Next.js, Tailwind CSS, and Zustand.

## What You'll Learn
- How to create a Next.js project
- How to configure Tailwind CSS
- Introduction to Zustand for state management
- Project structure overview

## Step-by-Step Guide

### 1. Create a Next.js App
- Use `npx create-next-app@latest` to scaffold a new project.
- Choose TypeScript for type safety.

### 2. Install Tailwind CSS
- Follow the [official guide](https://tailwindcss.com/docs/guides/nextjs):
  - `npm install -D tailwindcss postcss autoprefixer`
  - `npx tailwindcss init -p`
  - Configure `tailwind.config.js` and add Tailwind to your CSS.

### 3. Install Zustand
- Run `npm install zustand`.
- Zustand is a minimal, scalable state management library for React.

### 4. Project Structure
- `src/app/` – Main app pages and routing
- `src/components/` – Reusable UI components
- `src/store/` – Zustand store for state management
- `src/lib/` – Utility functions

### 5. Run the App
- Use `npm run dev` to start the development server.

## Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

In this phase, focus on understanding the project setup and the role of each tool. Don't worry about features yet—just get the app running! 