import { useQuery } from '@tanstack/react-query'
import { fetchAPI } from 'views/Home/utils/api'

interface ResponseLanguageType {
  code: string
  name: string
}

export const useLanguage = (): Array<string> => {
  const { data } = useQuery(
    ['game-language'],
    async () => {
      try {
        const result: ResponseLanguageType[] = await fetchAPI(`/i18n/locales`)
        const languages = result.map((i) => i.code)
        return languages
      } catch (error) {
        console.error('Get all language error: ', error)
        return []
      }
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  return data || []
}
