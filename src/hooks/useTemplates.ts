import { useState, useEffect } from 'react'
import { templatesService } from '@/services/templatesService'
import type { TypstTemplate } from '@/types/api'

export const useTemplates = () => {
  const [templates, setTemplates] = useState<TypstTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await templatesService.getAllTemplates()
        setTemplates(response.templates)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch templates'))
        console.error('Error fetching templates:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  return { templates, isLoading, error, refetch: () => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await templatesService.getAllTemplates()
        setTemplates(response.templates)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch templates'))
        console.error('Error fetching templates:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTemplates()
  } }
}

