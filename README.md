# Smart Stack Calendar

A highly interactive, constant-dimension calendar component built for modern React and Next.js applications. It mimics the physical interactions of a real wall calendar using fluid animations, gesture controls, and 3D CSS physics.

## Features

- **Constant Dimension Engine**: The component guarantees a strict 42-cell layout lock. The calendar height will never jump or resize when changing months.
- **Framer Motion Stack Physics**: Seamlessly transition between months with a physical card-stack animation.
- **Swipe Gestures**: Fully mobile-responsive. Users can swipe left or right on the calendar to change the month.
- **Haptic Feedback**: Integrates with the browser `navigator.vibrate` API for tactile clicks on supported mobile devices.
- **Month-Specific Memos**: Includes an internal notepad that automatically saves and loads notes per month using `localStorage`.
- **Date Range Selector and Markers**: Click to set a start and end date, or mark important individual dates with a visual indicator.
- **3D Wind Physics**: Toggle the Breeze mode to apply a hardware-accelerated swaying animation.
- **Today Auto-Highlight**: Automatically detects and highlights the current real-world date.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation Engine**: [Framer Motion](https://www.framer.com/motion/)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm run start
```

### 4. Lint

```bash
npm run lint
```

## Scripts

- `npm run dev`: Run the Next.js development server.
- `npm run build`: Build the production bundle.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint checks.

## Usage

The calendar component is rendered from `src/app/page.js` and implemented in `src/components/WallCalendar.jsx`.

Example:

```jsx
import WallCalendar from '@/components/WallCalendar';

export default function Home() {
	return (
		<main>
			<WallCalendar />
		</main>
	);
}
```

## Persistence Details

The component stores user data in `localStorage` using:

- `stack-calendar-notes` for monthly notes
- `stack-marked-dates` for date markers

## Project Structure

```text
src/
	app/
		globals.css
		layout.js
		page.js
	components/
		WallCalendar.jsx
```