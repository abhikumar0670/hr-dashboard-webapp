# Phase 2: State Management

## Goal
Implement and understand state management for employees using Zustand.

## What You'll Learn
- How to use Zustand for global state
- How to create, read, update, and delete (CRUD) employee data
- How state flows between components

## Step-by-Step Guide

### 1. Zustand Store Basics
- Zustand uses hooks to manage state outside of React components.
- Example:
  ```ts
  import create from 'zustand';
  const useStore = create((set) => ({ count: 0, increment: () => set((state) => ({ count: state.count + 1 })) }));
  ```

### 2. Employee State
- Store employees as an array of objects.
- Provide actions for add, update, delete, and fetch.

### 3. Connecting State to Components
- Use the store in your components with the `useStore` hook.
- Example:
  ```ts
  const employees = useStore((state) => state.employees);
  ```

### 4. CRUD Operations
- Add forms and buttons to create, edit, and remove employees.
- Update the Zustand store accordingly.

## Resources
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React State Management](https://react.dev/learn/state-a-components-memory)

---

In this phase, focus on how data is managed and shared across your app. Practice adding and updating employees! 