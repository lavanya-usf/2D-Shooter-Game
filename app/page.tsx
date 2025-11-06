'use client'

import { useEffect, useRef, useState } from 'react'

// Game constants
const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PLAYER_SPEED = 5
const BULLET_SPEED = 10
const ENEMY_SPEED = 2
const ENEMY_SPAWN_RATE = 0.02
const STAR_COUNT = 200

interface Position {
  x: number
  y: number
}

interface Star {
  x: number
  y: number
  speed: number
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [gameRunning, setGameRunning] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showPauseScreen, setShowPauseScreen] = useState(false)
  const [bannerMessage, setBannerMessage] = useState<string>('')
  const [showBanner, setShowBanner] = useState(false)

  const playerRef = useRef<Position>({ x: 0, y: -GAME_HEIGHT / 2 + 50 })
  const bulletsRef = useRef<Position[]>([])
  const enemiesRef = useRef<Position[]>([])
  const starsRef = useRef<Star[]>([])
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const lastShotTimeRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const previousScoreRef = useRef(0)
  const SHOT_COOLDOWN = 200

  // Encouraging messages
  const encouragingMessages = [
    "Great shot! 🎯",
    "Keep it up! ⚡",
    "You're on fire! 🔥",
    "Amazing! 🌟",
    "Incredible! 💫",
    "Unstoppable! 🚀",
    "Perfect aim! 🎯",
    "You're a star! ⭐",
    "Outstanding! 👏",
    "Fantastic! 🎉",
    "Legendary! 🏆",
    "Masterful! 🎮",
    "Epic skills! 💪",
    "Dominating! 👑",
    "Unbeatable! 🥇"
  ]

  // Initialize stars
  useEffect(() => {
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * GAME_WIDTH * 2,
        y: (Math.random() - 0.5) * GAME_HEIGHT * 2,
        speed: 0.5 + Math.random() * 0.5
      })
    }
    starsRef.current = stars
  }, [])

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true
      if (e.code === 'Space' && gameRunning && !gamePaused) {
        e.preventDefault()
        shoot()
      }
      if (e.code === 'Escape') {
        e.preventDefault()
        if (gameRunning && !gamePaused) {
          setGamePaused(true)
          setShowPauseScreen(true)
        } else if (gamePaused) {
          setGamePaused(false)
          setShowPauseScreen(false)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameRunning, gamePaused])

  const shoot = () => {
    const currentTime = Date.now()
    if (currentTime - lastShotTimeRef.current < SHOT_COOLDOWN) return

    lastShotTimeRef.current = currentTime
    bulletsRef.current.push({
      x: playerRef.current.x,
      y: playerRef.current.y + 20
    })
  }

  const updatePlayer = () => {
    if (!gameRunning || gamePaused) return

    let moveX = 0
    let moveY = 0

    if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) moveY += PLAYER_SPEED
    if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) moveY -= PLAYER_SPEED
    if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) moveX -= PLAYER_SPEED
    if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) moveX += PLAYER_SPEED

    playerRef.current.x = Math.max(
      -GAME_WIDTH / 2 + 20,
      Math.min(GAME_WIDTH / 2 - 20, playerRef.current.x + moveX)
    )
    playerRef.current.y = Math.max(
      -GAME_HEIGHT / 2 + 20,
      Math.min(GAME_HEIGHT / 2 - 20, playerRef.current.y + moveY)
    )
  }

  const updateBullets = () => {
    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      bulletsRef.current[i].y += BULLET_SPEED
      if (bulletsRef.current[i].y > GAME_HEIGHT / 2) {
        bulletsRef.current.splice(i, 1)
      }
    }
  }

  const updateEnemies = () => {
    if (!gameRunning || gamePaused) return

    if (Math.random() < ENEMY_SPAWN_RATE) {
      enemiesRef.current.push({
        x: (Math.random() - 0.5) * (GAME_WIDTH - 100),
        y: GAME_HEIGHT / 2 + 20
      })
    }

    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      enemiesRef.current[i].y -= ENEMY_SPEED
      if (enemiesRef.current[i].y < -GAME_HEIGHT / 2 - 20) {
        enemiesRef.current.splice(i, 1)
      }
    }
  }

  const showEncouragingBanner = (message: string) => {
    setBannerMessage(message)
    setShowBanner(true)
    // Auto-hide after 2.5 seconds
    setTimeout(() => {
      setShowBanner(false)
    }, 2500)
  }

  const checkCollisions = () => {
    if (!gameRunning || gamePaused) return

    // Bullet-Enemy collisions
    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      const bullet = bulletsRef.current[i]
      for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
        const enemy = enemiesRef.current[j]
        const dx = bullet.x - enemy.x
        const dy = bullet.y - enemy.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 20) {
          bulletsRef.current.splice(i, 1)
          enemiesRef.current.splice(j, 1)
          setScore(prev => {
            const newScore = prev + 10
            // Show encouraging banner at score milestones
            const previousScore = previousScoreRef.current
            if (newScore > 0 && newScore % 50 === 0 && newScore !== previousScore) {
              const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
              showEncouragingBanner(randomMessage)
            }
            previousScoreRef.current = newScore
            return newScore
          })
          break
        }
      }
    }

    // Player-Enemy collisions
    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const enemy = enemiesRef.current[i]
      const dx = playerRef.current.x - enemy.x
      const dy = playerRef.current.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 25) {
        enemiesRef.current.splice(i, 1)
        setHealth(prev => {
          const newHealth = prev - 10
          if (newHealth <= 0) {
            setGameRunning(false)
            setShowGameOver(true)
            return 0
          }
          return newHealth
        })
      }
    }
  }

  const updateStars = () => {
    starsRef.current.forEach(star => {
      star.y -= star.speed
      if (star.y < -GAME_HEIGHT / 2) {
        star.y = GAME_HEIGHT / 2
        star.x = (Math.random() - 0.5) * GAME_WIDTH * 2
      }
    })
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // Draw stars
    ctx.fillStyle = '#ffffff'
    starsRef.current.forEach(star => {
      ctx.beginPath()
      ctx.arc(
        star.x + GAME_WIDTH / 2,
        star.y + GAME_HEIGHT / 2,
        1.5,
        0,
        Math.PI * 2
      )
      ctx.fill()
    })

    // Draw player
    ctx.save()
    ctx.translate(
      playerRef.current.x + GAME_WIDTH / 2,
      playerRef.current.y + GAME_HEIGHT / 2
    )
    ctx.fillStyle = '#00ffff'
    ctx.beginPath()
    ctx.moveTo(0, -20)
    ctx.lineTo(-15, 15)
    ctx.lineTo(15, 15)
    ctx.closePath()
    ctx.fill()

    // Engine glow
    ctx.fillStyle = '#ffff00'
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.arc(0, 20, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Draw bullets
    ctx.fillStyle = '#00ff00'
    bulletsRef.current.forEach(bullet => {
      ctx.beginPath()
      ctx.arc(
        bullet.x + GAME_WIDTH / 2,
        bullet.y + GAME_HEIGHT / 2,
        3,
        0,
        Math.PI * 2
      )
      ctx.fill()
    })

    // Draw enemies
    ctx.fillStyle = '#ff4444'
    enemiesRef.current.forEach(enemy => {
      ctx.save()
      ctx.translate(
        enemy.x + GAME_WIDTH / 2,
        enemy.y + GAME_HEIGHT / 2
      )
      ctx.beginPath()
      ctx.moveTo(0, 20)
      ctx.lineTo(-15, -15)
      ctx.lineTo(15, -15)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    })
  }

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = () => {
      updateStars()
      if (gameRunning) {
        updatePlayer()
        updateBullets()
        updateEnemies()
        checkCollisions()
      }
      draw(ctx)
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameRunning, gamePaused])

  const startGame = () => {
    setGameRunning(true)
    setGamePaused(false)
    setScore(0)
    setHealth(100)
    setShowStartScreen(false)
    setShowGameOver(false)
    setShowPauseScreen(false)
    setShowBanner(false)
    previousScoreRef.current = 0
    playerRef.current = { x: 0, y: -GAME_HEIGHT / 2 + 50 }
    bulletsRef.current = []
    enemiesRef.current = []
  }

  const restartGame = () => {
    bulletsRef.current = []
    enemiesRef.current = []
    playerRef.current = { x: 0, y: -GAME_HEIGHT / 2 + 50 }
    startGame()
  }

  const resumeGame = () => {
    setGamePaused(false)
    setShowPauseScreen(false)
  }

  const quitGame = () => {
    setGameRunning(false)
    setGamePaused(false)
    bulletsRef.current = []
    enemiesRef.current = []
    playerRef.current = { x: 0, y: -GAME_HEIGHT / 2 + 50 }
    setScore(0)
    setHealth(100)
    setShowPauseScreen(false)
    setShowGameOver(false)
    setShowStartScreen(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="relative flex items-center">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)] bg-black"
        />
        
        {/* Encouraging Banner - Right side */}
        {showBanner && gameRunning && !gamePaused && (
          <div className="ml-6 w-64 animate-slide-in-right">
            <div className="bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-sm border-2 border-cyan-400 rounded-lg p-4 shadow-[0_0_20px_rgba(0,255,255,0.6)]">
              <div className="text-center">
                <p className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  {bannerMessage}
                </p>
                <p className="text-lg text-cyan-100 mt-2 font-semibold">
                  Score: {score}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* UI Overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-5 left-5 text-2xl font-bold text-green-400 bg-black/50 px-5 py-2 rounded">
            Score: {score}
          </div>
          <div className="absolute top-5 right-5 text-2xl font-bold text-red-400 bg-black/50 px-5 py-2 rounded">
            Health: {health}
          </div>
        </div>

        {/* Start Screen */}
        {showStartScreen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-black/90 p-10 rounded-lg border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)] text-center">
              <h1 className="text-5xl mb-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                Space Shooter
              </h1>
              <p className="text-lg mb-2 text-white">Use WASD or Arrow Keys to move</p>
              <p className="text-lg mb-2 text-white">Press SPACE to shoot</p>
              <p className="text-lg mb-5 text-white">Press ESC to pause</p>
              <button
                onClick={startGame}
                className="mt-5 px-8 py-4 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,255,255,0.6)] active:scale-95"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {showGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-black/90 p-10 rounded-lg border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)] text-center">
              <h1 className="text-5xl mb-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                Game Over
              </h1>
              <p className="text-lg mb-2 text-white">
                Final Score: <span className="text-3xl font-bold text-green-400">{score}</span>
              </p>
              <button
                onClick={restartGame}
                className="mt-5 px-8 py-4 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,255,255,0.6)] active:scale-95"
              >
                Start New Game
              </button>
            </div>
          </div>
        )}

        {/* Pause Screen */}
        {showPauseScreen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-black/90 p-10 rounded-lg border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)] text-center">
              <h1 className="text-5xl mb-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                Paused
              </h1>
              <button
                onClick={resumeGame}
                className="block w-full mt-5 px-8 py-4 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,255,255,0.6)] active:scale-95"
              >
                Resume
              </button>
              <button
                onClick={quitGame}
                className="block w-full mt-3 px-8 py-4 text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-lg cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,255,255,0.6)] active:scale-95"
              >
                Quit Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

