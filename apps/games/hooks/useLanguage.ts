import { useQuery } from '@tanstack/react-query'
import { fetchAPI } from '@pancakeswap/blog'
import { useTranslation } from '@pancakeswap/localization'

interface ResponseLanguageType {
  code: string
  name: string
}

interface UseLanguageType {
  label: string
  value: string
}

export const useLanguage = (): UseLanguageType[] => {
  const { t } = useTranslation()
  const defaultLanguage = { label: t('All'), value: 'all' }

  const { data } = useQuery({
    queryKey: ['game-language'],

    queryFn: async () => {
      try {
        const result: ResponseLanguageType[] = await fetchAPI(`/i18n/locales`)
        const languages = result.map((i) => ({
          label: i.name,
          value: i.code,
        }))
        return [defaultLanguage, ...languages].sort((a) => (a.value === 'en' ? -1 : 1))
      } catch (error) {
        console.error('Get all language error: ', error)
        return []
      }
    },

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return data || []
}
