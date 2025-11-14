import { useMouseAmbient } from '@/hooks/useMouseAmbient'
import './MouseAmbientLight.css'

const MouseAmbientLight = () => {
  const { x, y } = useMouseAmbient()

  return (
    <div
      className="mouse-ambient-light"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  )
}

export default MouseAmbientLight

