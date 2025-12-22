# El Pollo Loco - Chicken Tabasco 🐔🌶️

A modern, modular 2D jump'n'run game inspired by "El Pollo Loco". Built with vanilla JavaScript, HTML5 Canvas, and ES6 classes, this project demonstrates clean architecture, maintainability, professional CSS design patterns, and a Single Page Application with optimized asset management.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-Educational-green.svg)](#license)

---

## 🎮 Features

- **Canvas-based 2D platformer** with smooth 60 FPS animations
- **18 ES6 Classes**: Object-oriented game architecture
- **Single Page Application** with client-side routing (`spa-router.js`)
- **Responsive UI**: Fullscreen support + mobile touch controls
- **Rich Audio**: 18 sound effects and background music tracks
- **10 Game Screens**: Start, Settings, How-to-Play, Highscore, Game Over, Win, Impressum, Datenschutz
- **Collectibles System**: Bottles, coins, golden eggs with real-time status bars
- **Parallax Backgrounds**: Multi-layer scrolling for depth (4 layers)
- **Advanced Enemy AI**: Normal chickens, small chickens, endboss with multiple attack states
- **Optimized CSS**: 65% reduction (3500→1350 lines) with shared components architecture

---

## 📂 Project Structure

```
pollo-loco/
│
├── index.html                 # Main game canvas entry point
├── README.md                  # Project documentation
├── style.css                  # Global base styles
│
├── assets/                    # Optimized game assets
│   ├── audio/                 # 18 sound files (MP3)
│   │   ├── bottle-crack.mp3, game-over.mp3, start-screen-sound.mp3
│   │   ├── chicken-cluking, chicken-laying-egg, chicken-alarm-call
│   │   └── character sounds (grandpa-dying, male-scream, sand-walk, snoring)
│   ├── button/                # 22 UI button images (PNG)
│   │   ├── Navigation: arrow-left/right, back-btn, home-btn
│   │   ├── Controls: boot (jump), bow-and-arrow (throw), mute
│   │   ├── UI elements: check-btn, close-btn, star-btn, sheriff badge
│   │   └── Decorative: cowboy, hat, guitar icon, board.png
│   ├── fonts/                 # Custom fonts
│   │   └── banderos/Bandero.otf (GringoNights - Western style)
│   └── img/                   # Organized sprite assets
│       ├── 2_character_pepe/  # Player: walk, jump, hurt, dead, idle, long_idle
│       ├── 3_enemies_chicken/ # Normal (1_walk, 2_dead) & small variants
│       ├── 4_enemie_boss_chicken/ # Endboss: walk, alert, attack, hurt, dead
│       ├── 5_background/      # Parallax layers (1-4) + air.png
│       ├── 6_salsa_bottle/    # Ground sprites + rotation + splash animations
│       ├── 7_statusbars/      # Health, bottle, coin, endboss (3 color variants)
│       ├── 8_coin/            # Coin animations (coin_1.png, coin_2.png)
│       ├── 10_external_img/   # UI backgrounds (desert, start-screen, bullet)
│       └── added-img/         # Special items (golden-egg.png, pow.png)
│
├── css/                       # Modular CSS (1350 lines, 65% optimized)
│   ├── root.css               # 🎨 CSS Custom Properties (113 lines)
│   │                          # - 20+ colors, spacing, borders, transitions
│   │                          # - Z-index scale, shadows, fonts, backgrounds
│   ├── layout.css             # 🧩 Layout: Grundstruktur, Scoreboard, Body
│   ├── navigation.css         # Navigation & Buttons
│   ├── carousel.css           # Karussell-Komponenten
│   ├── overlay.css            # Overlays & Modals
│   ├── animations.css         # Keyframe-Animationen
│   ├── responsive-tablet.css  # Responsive Styles (Tablet & Medium)
│   ├── responsive-mobile.css  # Responsive Styles (Mobile & Small)
│   ├── responsive-desktop.css # Responsive Styles (Desktop & Large)
│   ├── start-screen.css       # Start screen specific styles
│   ├── game-over.css          # Game over styles
│   ├── win.css                # Win screen styles
│   ├── settings.css           # Settings page + mute range slider
│   ├── highscore-screen.css   # Highscore leaderboard
│   ├── how-toplay.css         # Controls & instructions
│   ├── impressum-data.css     # Legal pages + scroll fix
│   └── overlay-highscore.css  # Highscore name input overlay
│
├── js/                        # UI Logic & Utilities (7 files)
│   ├── game.js                # 🎮 Game init, keyboard handlers, pause logic
│   ├── spa-router.js          # 🔀 Client-side navigation (277 lines)
│   │                          # - Dynamic CSS loading, body attribute copying
│   ├── main-menu-carousel.js  # Carousel navigation logic
│   ├── extra-screens.js       # Highscore, game-over, win screen handlers
│   ├── fullscreen.js          # Fullscreen API + mobile control toggle
│   ├── interval-helper.js     # Interval management utilities
│   └── game-animation-utils.js # Animation frame utilities
│
├── levels/                    # Level Definitions (2 levels)
│   ├── level1.js              # Enemies, backgrounds, bottles, coins
│   └── level2.js              # Extended challenges
│
├── models/                    # Core Game Logic (18 ES6 Classes)
│   ├── drawable-object.class.js      # 🎨 Base: image loading, drawing
│   ├── movable-object.class.js       # ⚡ Physics, collision, gravity, animations
│   ├── character.class.js            # 🤠 Player: walk, jump, hurt, death, idle states
│   ├── chicken.class.js              # 🐔 Normal chicken enemy
│   ├── chicken-small.class.js        # 🐤 Small chicken enemy
│   ├── endboss.class.js              # 🐓 Boss: walk, alert, attack, hurt, death
│   ├── endboss-effect.class.js       # 💥 Visual attack effects (pow.png)
│   ├── bottle.class.js               # 🍾 Collectible bottles
│   ├── coin.class.js                 # 💰 Collectible coins
│   ├── golden-egg.class.js           # 🥚 Special collectible
│   ├── collectible-object.class.js   # Base for all collectibles
│   ├── throwable-object.class.js     # 🎯 Thrown bottle projectiles
│   ├── background-object.class.js    # 🏜️ Parallax background layers
│   ├── cloud.class.js                # ☁️ Moving clouds
│   ├── status-bar.class.js           # 📊 UI status bars (health, bottles, coins)
│   ├── world.class.js                # 🌍 Game world manager, collision detection
│   ├── level.class.js                # 📋 Level data structure
│   └── keyboard.class.js             # ⌨️ Keyboard input state
│
└── pages/                     # HTML Screens (10 pages)
    ├── start-screen.html      # Main menu with carousel
    ├── game-over.html         # Game over + restart + highscore input
    ├── win.html               # Victory screen + highscore
    ├── settings.html          # Audio settings + mute slider
    ├── highscore.html         # Leaderboard display
    ├── how-to-play.html       # Controls guide + instructions
    ├── overlay-highscore.html # Name input overlay component
    ├── impressum.html         # Legal notice (German)
    ├── datenschutz.html       # Privacy policy (German)
    └── main-menu.html         # Menu overlay component
```

---

## 🏗️ Architecture & Design Patterns

### CSS Architecture (Modern Component-Based)

**65% CSS Reduction** (3500 → 1350 lines) achieved through:

1. **CSS Custom Properties (`root.css` - 113 lines)**

   - 20+ color variables (primary, secondary, accent with transparency variants)
   - Spacing system: `--spacing-xs` (8px) → `--spacing-xxl` (64px)
   - Border radius: `--border-radius-small` (8px) → `--border-radius-canvas` (25px)
   - Z-index scale: `--z-background` (10) → `--z-overlay` (10000)
   - Transitions: `--transition-standard`, `--transition-fast`, `--transition-combined`
   - Shadows: `--shadow-box`, `--shadow-text`

2. **Modulare Komponenten (layout.css, navigation.css, carousel.css, overlay.css, animations.css, responsive-\*.css)**

   - Eliminieren doppelten Code durch Aufteilung in logische Module
   - Enthalten: Layout, Navigation, Overlays, Karussell, Animationen, Responsive-Design
   - Einheitliche Hover-Effekte und Animationen
   - Media Queries jetzt in eigene Dateien für bessere Wartbarkeit

3. **DRY Principle**
   - All hardcoded colors → CSS variables
   - All spacing values → spacing system
   - All borders/shadows → reusable tokens

### JavaScript Architecture

**Class Hierarchy:**

```
DrawableObject (base: image loading, drawing)
  ├── MovableObject (physics, collision, gravity, animations)
  │   ├── Character (player with 5 animation states)
  │   ├── Chicken, ChickenSmall (enemy AI)
  │   ├── Endboss (boss with 5 states: walk, alert, attack, hurt, dead)
  │   └── ThrowableObject (projectile physics)
  ├── BackgroundObject (parallax scrolling)
  ├── Cloud (decorative movement)
  └── CollectibleObject (base for items)
      ├── Bottle (throwable items)
      ├── Coin (collectible with percentage tracking)
      └── GoldenEgg (special item from endboss)
```

**Key Patterns:**

- ✅ **Separation of Concerns**: Game logic (`models/`), UI (`js/`), data (`levels/`), presentation (`css/`)
- ✅ **Single Responsibility**: Each class handles one entity type
- ✅ **JSDoc Documentation**: All public methods documented
- ✅ **File Size Discipline**: No file exceeds 400 lines
- ✅ **SPA Pattern**: Client-side routing without page reloads

### Game Loop & Rendering

- **RequestAnimationFrame**: 60 FPS rendering
- **Separate Intervals**: Animation (200ms), collision detection (100ms), AI updates
- **Canvas 2D Context**: Image rendering with transformations
- **Parallax Effect**: 4 background layers with different scroll speeds

---

## 🎯 Key Technical Achievements (2025)

### CSS Refactoring

- ✅ **65% reduction**: 3500 lines → 1350 lines durch Modularisierung in 15+ CSS-Dateien
- ✅ **Komplette Aufteilung**: shared-components.css ersetzt durch layout.css, navigation.css, carousel.css, overlay.css, animations.css, responsive-tablet.css, responsive-mobile.css, responsive-desktop.css
- ✅ **50+ hardcoded values** replaced with CSS custom properties
- ✅ **Fixed SPA navigation**: Dynamic CSS loading, body attribute preservation
- ✅ **Unified design**: Consistent hover effects, backgrounds, scoreboards
- ✅ **Scroll fix**: Impressum/Datenschutz with proper overflow handling
- ✅ **Link styling**: Separate navbar vs content link styles with `:not()` selectors

### Game Optimization

- ✅ **18 ES6 Classes**: Clean OOP architecture
- ✅ **Collision Detection**: Precise hitboxes for all entities
- ✅ **Asset Audit**: 50+ unused files identified (GIFs, examples, duplicates)
- ✅ **Audio System**: Dynamic loading with mute/volume controls
- ✅ **Mobile Support**: Touch controls with responsive UI

### Code Quality

- ✅ **JSDoc**: All classes documented
- ✅ **No files > 400 lines**: Enforced readability
- ✅ **Vanilla JavaScript**: No frameworks, no build step
- ✅ **Cross-browser**: Tested on Chrome, Firefox, Edge, Safari

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- No build tools or dependencies required

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MadJoJoker/pollo-loco.git
   cd pollo-loco
   ```

2. **Open the game:**

   ```bash
   # Option 1: Direct file access
   open index.html

   # Option 2: Local server (recommended for asset loading)
   python -m http.server 8000
   # Visit: http://localhost:8000
   ```

3. **Play!**
   - Game auto-redirects to `pages/start-screen.html`
   - Use arrow keys or on-screen buttons

---

## 🎮 Controls

### Desktop

- **← / →**: Move left/right
- **↑ / Space**: Jump
- **D**: Throw bottle
- **M**: Mute/unmute audio

### Mobile

- **On-screen buttons**: All controls via touch
- **Fullscreen button**: Toggle fullscreen mode

---

## 📊 Project Statistics

| Metric                       | Count                     |
| ---------------------------- | ------------------------- |
| **Total Files**              | 60+                       |
| **Lines of Code**            | ~5,500 (HTML, CSS, JS)    |
| **CSS Files**                | 9 (1,350 lines optimized) |
| **JavaScript Classes**       | 18                        |
| **Game Levels**              | 2                         |
| **Audio Files**              | 18 (MP3)                  |
| **Image Sprites**            | 200+ (PNG)                |
| **Game Screens**             | 10 (HTML pages)           |
| **Unused Assets Identified** | ~50 (for cleanup)         |

---

## 👨‍💻 Developer

- **Owner**: [MadJoJoker](https://github.com/MadJoJoker)
- **Repository**: [pollo-loco](https://github.com/MadJoJoker/pollo-loco)
- **Branch**: main
- **Last Updated**: December 2025

---

## 🛠️ Development Best Practices

- ✅ **Modular Architecture**: Each class has a single responsibility
- ✅ **CSS Custom Properties**: Centralized design system with 113 variables
- ✅ **Component-Based CSS**: Shared components eliminate duplication
- ✅ **JSDoc Documentation**: All public methods documented for maintainability
- ✅ **Asset Organization**: Logical folder structure, unused files identified
- ✅ **No Build Step**: Pure vanilla JavaScript (ES6+), runs directly in browser
- ✅ **Cross-Browser**: Compatible with all major modern browsers
- ✅ **Responsive**: Desktop keyboard + mobile touch controls
- ✅ **SPA Pattern**: Client-side routing with dynamic CSS loading
- ✅ **Performance**: 60 FPS with RequestAnimationFrame

---

## 🌟 Future Enhancements

- [ ] Level editor for custom level creation
- [ ] Remove 50+ unused asset files identified in audit
- [ ] Convert remaining CSS to use more CSS custom properties
- [ ] Add WebGL renderer for improved performance
- [ ] Multiplayer support (WebSockets or WebRTC)
- [ ] Achievement system with localStorage persistence
- [ ] Additional enemy types and power-ups
- [ ] Internationalization (i18n) for multiple languages
- [ ] Progressive Web App (PWA) with offline support

---

## 📄 License

This project is for **educational and demonstration purposes**.

- Game code: Available for learning and reference
- Assets: May have individual licenses (see respective files)
- Custom code: Free to use for educational purposes

---

## 🙏 Acknowledgments

- Inspired by the classic **"El Pollo Loco"** game
- Font: **Bandero** (GringoNights) - Western-style typography
- Audio: Various royalty-free sources
- Sprites: Custom and open-source collections

---

## 📞 Contact & Support

For questions, suggestions, or issues:

- **GitHub Issues**: [pollo-loco/issues](https://github.com/MadJoJoker/pollo-loco/issues)
- **GitHub Profile**: [MadJoJoker](https://github.com/MadJoJoker)

---

**Made with ❤️ and vanilla JavaScript by MadJoJoker** | December 2025
