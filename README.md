# 2D Space Shooter Game

A classic 2D space shooter game built with Next.js and Tailwind CSS.

## Features

- **Player Ship**: Control your ship with WASD or Arrow keys
- **Shooting**: Press SPACE to shoot at enemies
- **Enemies**: Waves of enemies spawn from the top
- **Collision Detection**: Bullets destroy enemies, enemies damage the player
- **Score System**: Earn points by destroying enemies
- **Health System**: Avoid enemies to stay alive
- **Pause/Resume**: Press ESC to pause the game
- **Beautiful UI**: Modern, neon-styled interface with Tailwind CSS

## How to Play

1. Click "Start Game" to begin
2. Use **WASD** or **Arrow Keys** to move your ship
3. Press **SPACE** to shoot
4. Press **ESC** to pause/resume
5. Destroy enemies to earn points
6. Avoid colliding with enemies (you lose health)
7. Survive as long as possible!

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Controls

- **W / ↑**: Move up
- **S / ↓**: Move down
- **A / ←**: Move left
- **D / →**: Move right
- **SPACE**: Shoot
- **ESC**: Pause/Resume

## Game Mechanics

- **Player Speed**: 5 units per frame
- **Bullet Speed**: 10 units per frame
- **Enemy Speed**: 2 units per frame
- **Shot Cooldown**: 200ms
- **Enemy Spawn Rate**: Random, increases difficulty over time
- **Health**: Start with 100, lose 10 per enemy collision
- **Score**: +10 points per enemy destroyed

## Tech Stack

- **Next.js 14**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety
- **HTML5 Canvas**: 2D rendering

Enjoy the game!
