# Phase 5: Analytics & Visualization

## Goal
Add analytics and data visualization features to the HR Performance Dashboard.

## What You'll Learn
- How to use chart libraries in React
- How to visualize employee data (performance, retention, salary, etc.)
- How to build an analytics dashboard page

## Step-by-Step Guide

### 1. Choose a Chart Library
- Popular options: [Recharts](https://recharts.org/en-US/), [Chart.js](https://www.chartjs.org/), [Victory](https://formidable.com/open-source/victory/)
- Install with `npm install recharts` (or your choice)

### 2. Create Analytics Page
- Add a new page (e.g., `/analytics`) in `src/app/analytics/`.
- Display charts for key metrics: performance trends, department distribution, retention, etc.

### 3. Integrate with State
- Use employee data from Zustand store for chart data.
- Update charts as data changes.

### 4. Export/Download Data
- Add options to export analytics as CSV or images (optional, advanced).

## Resources
- [Data Visualization in React](https://recharts.org/en-US/)
- [Building Dashboards](https://www.smashingmagazine.com/2020/02/react-dashboard-react-vis/)

---

In this phase, focus on making your data come alive! Try different chart types and visualize various employee metrics. 