import { useCallback } from 'react'

/**
 * Custom hook for smooth scrolling to elements
 */
export const useScrollTo = () => {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return { scrollTo }
}

