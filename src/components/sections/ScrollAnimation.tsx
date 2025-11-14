import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import './ScrollAnimation.css'

interface ScrollAnimationProps {
  children: ReactNode
  delay?: number
  className?: string
}

const ScrollAnimation = ({ children, delay = 0, className = '' }: ScrollAnimationProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true })

  return (
    <div
      ref={elementRef as any}
      className={`scroll-animation ${isVisible ? 'scroll-animation-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default ScrollAnimation

