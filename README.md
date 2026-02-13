# 🏞️ River Crossing Puzzle Game

A beautiful, interactive browser-based **River Crossing Logic Puzzle** built with React, Vite, and Tailwind CSS.

![Game Preview](https://img.shields.io/badge/Status-Complete-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## 🎮 About the Game

The classic **River Crossing Puzzle** — get all 8 characters safely from the Starting Shore to the Destination shore using a raft that can carry only 2 people at a time!

### Characters
| Emoji | Character | Can Drive? |
|-------|-----------|------------|
| 👨 | Father | ✅ Yes |
| 👩 | Mother | ✅ Yes |
| 👦 | Son 1 | ❌ No |
| 👦 | Son 2 | ❌ No |
| 👧 | Daughter 1 | ❌ No |
| 👧 | Daughter 2 | ❌ No |
| 👮 | Policeman | ✅ Yes |
| 🦹 | Thief | ❌ No |

### Rules
- 🚣 **Drivers:** Only Father, Mother, or Policeman can operate the raft
- ⛵ **Raft:** Maximum 2 people, needs at least 1 driver to sail
- 🦹 **Thief:** Cannot be with any family member without the Policeman present
- 👧 **Daughters:** Cannot be with Father unless Mother is also present
- 👦 **Sons:** Cannot be with Mother unless Father is also present
- 🏆 **Win:** Move all 8 characters to the destination shore!

## ✨ Features

- 🎨 Beautiful animated UI with clouds, waves, and floating effects
- 🪵 Realistic wooden raft with wood grain texture
- 🌊 Animated river with wave effects and floating fish
- 💫 Smooth transitions and hover animations
- ↩️ Undo move functionality
- 🔄 Reset game
- 📊 Move counter
- 🚨 Game Over overlay with rule violation explanation
- 🎉 Win celebration overlay
- 📱 Responsive design (works on mobile & desktop)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/river-crossing-puzzle.git
   cd river-crossing-puzzle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder. The output is a **single HTML file** (using `vite-plugin-singlefile`) that you can open directly in any browser!

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
river-crossing-puzzle/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── README.md               # This file
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main game component (all game logic)
│   ├── index.css           # Tailwind CSS import
│   └── utils/
│       └── cn.ts           # Tailwind merge utility
└── dist/
    └── index.html          # Built single-file output
```

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** — UI library
- **[Vite 7](https://vitejs.dev/)** — Build tool & dev server
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[vite-plugin-singlefile](https://github.com/nickreese/vite-plugin-singlefile)** — Bundles everything into a single HTML file

## 🧩 Decision Categories (MIS/Game Theory)

This puzzle demonstrates four levels of decision-making:

| Level | Decision Type | Example in Game |
|-------|--------------|-----------------|
| **Operational** | Structured, rule-based | "Can I move this character onto the raft?" |
| **Tactical** | Sub-goal focused | "How do I move both sons without breaking a rule?" |
| **Semi-Structured** | Judgment + rules | "Who should I bring back on the return trip?" |
| **Strategic** | Big-picture planning | "What is the complete sequence to solve the puzzle?" |

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

Made with ❤️ and ☕
