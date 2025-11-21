import { useEffect, useState, MutableRefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): {
  elementRef: MutableRefObject<T | null>
  isIntersecting: boolean
  hasIntersected: boolean
} => {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  
  // Create a mutable ref object that can be assigned (not using useRef to avoid read-only type)
  const elementRef: MutableRefObject<T | null> = { current: null }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting) {
          setHasIntersected(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, elementRef])

  return { elementRef, isIntersecting, hasIntersected }
}

