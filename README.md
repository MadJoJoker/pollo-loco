# El Pollo Loco - Chicken Tabasco

A modern, modular 2D jump'n'run game inspired by "El Pollo Loco". Built with vanilla JavaScript, HTML5 Canvas, and ES6 classes, this project demonstrates clean architecture, maintainability, and a rich asset pipeline.

---

## Project Structure (2025)

```
/ (root)
│
├── index.html                # Main entry point, loads the game
├── README.md                 # Project documentation
├── style.css                 # Global styles
│
├── assets/                   # All game assets
│   ├── audio/                # Sound effects & music
│   ├── button/               # UI button images
│   ├── fonts/                # Custom fonts
│   └── img/                  # Sprites, backgrounds, etc.
│
├── css/                      # Screen-specific styles
│   ├── highscore-screen.css
│   ├── how-toplay.css
│   └── ...
│
├── js/                       # UI logic & helpers
│   ├── extra-screens.js
│   ├── fullscreen.js
│   └── ...
│
├── levels/                   # Level definitions (JS)
│   ├── level1.js
│   └── ...
│
├── models/                   # Core game logic (ES6 classes)
│   ├── background-object.class.js
│   ├── bottle.class.js
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── coin.class.js
│   ├── world.class.js
│   └── ...
│
├── pages/                    # Additional HTML screens
│   ├── datenschutz.html
│   ├── game-over.html
│   └── ...
└── ...
```

### Key Architectural Points

- **Modular ES6 Classes:** Each entity (player, enemies, collectibles, world, etc.) is encapsulated in its own class for maintainability and reusability.
- **Separation of Concerns:** Game logic (`models/`), UI/UX (`js/`, `css/`, `pages/`), and assets are strictly separated.
- **Refactored Collectible Logic:** Coin collection and percentage logic are now handled in the `Coin` class, not in `World`, reducing file size and improving clarity.
- **JSDoc Documentation:** All core model files are documented with JSDoc for better developer experience and maintainability.
- **File Size Discipline:** No single file exceeds 400 lines, ensuring readability and modularity.
- **Asset Pipeline:** All images, sounds, and fonts are organized for easy extension and replacement.

---

## Features

- Canvas-based 2D platformer gameplay
- Animated player and enemy sprites
- Parallax backgrounds and level design
- Keyboard controls (movement, actions)
- Collectibles: bottles, coins, golden eggs
- Status bars: health, bottles, coins, endboss
- Sound effects and background music
- Responsive game loop and collision detection
- Multiple screens: start, highscore, settings, how-to-play, game over, win
- Modern codebase: ES6+, modular, documented

---

## Getting Started

1. **Clone or download the repository.**
2. **Open `index.html` in your browser.**
   - No build step or server required.

---

## Developer

- **Owner:** MadJoJoker

---

## Notes & Best Practices

- All assets are in the `assets/` folder, organized by type.
- Game logic is in `models/`, UI logic in `js/`, and level definitions in `levels/`.
- Refactoring and modularization are ongoing priorities.
- JSDoc is used for all core classes and methods.
- The project follows modern JavaScript and web development standards (2025).

---

## License

This project is for educational and demonstration purposes. See individual asset files for their respective licenses.
