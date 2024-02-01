import { useTranslation } from '@pancakeswap/localization'
import { useQuery } from '@tanstack/react-query'

interface ResponseLanguageType {
  code: string
  name: string
}

// We can't hide the language in Strapi only can delete it.
// 日本語, Georgian, Français, Deutsch
const HIDE_LANGUAGE_CODE = ['ja', 'ka', 'fr', 'de']

const useLanguage = () => {
  const { t } = useTranslation()
  const defaultLanguage = { label: t('All'), value: 'all' }

  const { data } = useQuery({
    queryKey: ['/language', defaultLanguage],

    queryFn: async () => {
      try {
        const response = await fetch(`/api/locales`)
        const result: ResponseLanguageType[] = await response.json()
        const languages = result
          .filter((i) => !HIDE_LANGUAGE_CODE.includes(i.code))
          .map((i) => ({
            label: i.name,
            value: i.code,
          }))
        return [defaultLanguage, ...languages].sort((a) => (a.value === 'en' ? -1 : 1))
      } catch (error) {
        console.error('Get all language error: ', error)
        return [defaultLanguage]
      }
    },

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return data || []
}

export default useLanguage
