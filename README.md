# Smart Stack Calendar 

A highly interactive, constant-dimension calendar component built for modern React and Next.js applications. It mimics the physical interactions of a real wall calendar using fluid animations, gesture controls, and 3D CSS physics.

## Features

- **Constant Dimension Engine**: The component guarantees a strict 42-cell layout lock. The calendar height will *never* jump or resize when changing months.
- **Framer Motion Stack Physics**: Seamlessly transition between months with a physical "card stack" animation. 
- **Swipe Gestures**: Fully mobile-responsive. Users can swipe left or right on the calendar to change the month.
- **Haptic Feedback**: Integrates with the browser's native `navigator.vibrate` API for satisfying tactile clicks on mobile devices.
- **Month-Specific Memos**: Features an internal notepad that automatically saves and loads data specific to the current viewing month using `localStorage`.
- **Date Range Selector & Markers**: Click to set a start and end date, or mark important individual dates with a visual star/dot indicator.
- **3D Wind Physics**: Toggle the "Breeze" environment to apply a hardware-accelerated, organic 3D swaying animation to the component.
- **"Today" Auto-Highlight**: The calendar intelligently finds the current real-world date and highlights it with a subtle UI ring.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) / [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation Engine**: [Framer Motion](https://www.framer.com/motion/)

## Quick Start

### 1. Install Dependencies
Ensure you have Framer Motion installed in your Next.js/React project:
```bash
npm install framer-motion