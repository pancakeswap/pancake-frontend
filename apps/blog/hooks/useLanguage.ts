import { useTranslation } from '@pancakeswap/localization'
import { useQuery } from '@tanstack/react-query'

interface ResponseLanguageType {
  code: string
  name: string
}

const useLanguage = () => {
  const { t } = useTranslation()
  const defaultLanguage = { label: t('All'), value: 'all' }

  const { data } = useQuery(
    ['/language', defaultLanguage],
    async () => {
      try {
        const response = await fetch(`/api/locales`)
        const result: ResponseLanguageType[] = await response.json()
        const languages = result.map((i) => ({
          label: i.name,
          value: i.code,
        }))
        return [defaultLanguage, ...languages].sort((a) => (a.value === 'en' ? -1 : 1))
      } catch (error) {
        console.error('Get all language error: ', error)
        return [defaultLanguage]
      }
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  )

  return data || []
}

export default useLanguage
