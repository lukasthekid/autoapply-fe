import { useEffect, useState } from 'react'

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updatePosition = () => {
      const currentPosition = window.pageYOffset
      setScrollPosition(currentPosition)
      setIsScrolled(currentPosition > 50)
    }

    window.addEventListener('scroll', updatePosition)
    updatePosition()

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return { scrollPosition, isScrolled }
}

