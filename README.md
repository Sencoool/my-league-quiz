<div align="center">

# 🐻 Poro Guess UI

**The frontend interface for a multi-mode League of Legends guessing game**

### 🎮 Play Now: [https://poro-guess.vercel.app](https://poro-guess.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

</div>

---

## 🎮 Overview

**Poro Guess UI** is the frontend client for an interactive League of Legends guessing web application. It features a modern, responsive, and highly interactive user interface designed to provide a premium gaming experience.

The application communicates with the [Poro Guess API](https://github.com/Sencoool/poro-guess-api) and offers four distinct mini-games:

| Mode | Description |
|------|-------------|
| 🏆 **Classic** | Daily champion guessing with dynamic attribute clues — Role, Species, Release Year, with directional comparison arrows |
| 🧩 **Tile Reveal (Jigsaw)** | Grid-based image reveal puzzle — a region of the champion splash art is uncovered with each attempt |
| 🔍 **Traits** | A Fan-Pantae-inspired progressive mystery game — 5 clues are unlocked one by one until the champion is identified |
| ⚡ **Ability Matcher** | Memory-match card mechanics linking champion skills to their hotkey slots |

---

## 🏗️ Architecture & State Management

The project is built using the new Next.js App Router for optimized routing and layout rendering. 

- **State Management**: Handled globally via **Zustand** (`src/app/store/useGameStore.ts`), which manages user sessions, game progress, and active challenges seamlessly.
- **Styling**: Utilizes **Tailwind CSS v4** for utility-first rapid styling, combined with custom CSS for complex micro-animations and glowing effects.
- **Animations**: Powered by **Framer Motion** to deliver smooth, premium transitions, modal pop-ups, and game interactions.
- **Authentication**: Supports seamless Guest sessions (auto-generated) and OAuth Google Login, handling conflict resolutions automatically.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) v15.5 (App Router)
- **Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Extras**: Canvas Confetti (for victory screens)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20

### 1. Clone & install

```bash
git clone https://github.com/Sencoool/poro-guess-ui.git
cd poro-guess-ui
npm install
```

### 2. Configure environment

Create a `.env.local` file in the root directory (if not exists) and configure your API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```
*(Make sure the Poro Guess API is running locally on port 3000)*

### 3. Start the development server

```bash
npm run dev
```

The UI will be available at: 🚀 **http://localhost:3001** (or 3000 if port is free).

---

## 📦 Build & Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

---

## 🎨 UI/UX Features

- **Responsive Design**: fully optimized for Mobile, Tablet, and Desktop screens.
- **Glassmorphism & Glow Effects**: Premium visual aesthetics matching the League of Legends hextech/magical thematic.
- **Seamless Auth Flow**: Guest accounts are instantly created upon entry. If a user logs in with Google and a conflict occurs, the system smoothly migrates the session without interrupting the user experience.
- **Dynamic Avatars**: Players can select their favorite League of Legends champion as their profile icon.

---

## 📜 License

UNLICENSED — private project.
