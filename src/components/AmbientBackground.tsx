import { useEffect, useRef } from 'react'
import './AmbientBackground.css'

const AmbientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let time = 0
    const gradientColors = [
      { r: 99, g: 102, b: 241 },   // primary indigo
      { r: 139, g: 92, b: 246 },   // secondary purple
      { r: 16, g: 185, b: 129 },   // accent green
      { r: 99, g: 102, b: 241 },   // back to indigo
    ]

    const animate = () => {
      time += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create animated gradient
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time) * 100,
        canvas.height * 0.2 + Math.cos(time * 0.7) * 80,
        0,
        canvas.width * 0.3,
        canvas.height * 0.2,
        canvas.width * 0.8
      )

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * 0.8) * 120,
        canvas.height * 0.8 + Math.sin(time * 0.6) * 100,
        0,
        canvas.width * 0.7,
        canvas.height * 0.8,
        canvas.width * 0.9
      )

      // Animate colors
      const colorIndex1 = Math.floor(time * 0.5) % (gradientColors.length - 1)
      const colorIndex2 = (colorIndex1 + 1) % gradientColors.length
      const t = (time * 0.5) % 1

      const color1 = gradientColors[colorIndex1]
      const color2 = gradientColors[colorIndex2]
      const currentColor1 = {
        r: Math.floor(color1.r + (color2.r - color1.r) * t),
        g: Math.floor(color1.g + (color2.g - color1.g) * t),
        b: Math.floor(color1.b + (color2.b - color1.b) * t),
      }

      const color3 = gradientColors[(colorIndex1 + 2) % gradientColors.length]
      const color4 = gradientColors[(colorIndex1 + 3) % gradientColors.length]
      const currentColor2 = {
        r: Math.floor(color3.r + (color4.r - color3.r) * t),
        g: Math.floor(color3.g + (color4.g - color3.g) * t),
        b: Math.floor(color3.b + (color4.b - color3.b) * t),
      }

      gradient1.addColorStop(0, `rgba(${currentColor1.r}, ${currentColor1.g}, ${currentColor1.b}, 0.15)`)
      gradient1.addColorStop(0.5, `rgba(${currentColor1.r}, ${currentColor1.g}, ${currentColor1.b}, 0.08)`)
      gradient1.addColorStop(1, 'transparent')

      gradient2.addColorStop(0, `rgba(${currentColor2.r}, ${currentColor2.g}, ${currentColor2.b}, 0.12)`)
      gradient2.addColorStop(0.5, `rgba(${currentColor2.r}, ${currentColor2.g}, ${currentColor2.b}, 0.06)`)
      gradient2.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="ambient-background">
      <canvas ref={canvasRef} className="ambient-canvas" />
      <div className="ambient-overlay" />
    </div>
  )
}

export default AmbientBackground

