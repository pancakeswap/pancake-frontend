import useSWR from 'swr'
import { useTranslation } from '@pancakeswap/localization'

interface ResponseLanguageType {
  code: string
  name: string
}

const useLanguage = () => {
  const { t } = useTranslation()
  const defaultLanguage = { label: t('All'), value: 'all' }

  const { data } = useSWR(
    ['/language', defaultLanguage],
    async () => {
      try {
        const response = await fetch(`/api/locales`)
        const result: ResponseLanguageType[] = await response.json()
        const languages = result.map((i) => ({
          label: i.name,
          value: i.code,
        }))
        return [defaultLanguage, ...languages]
      } catch (error) {
        console.error('Get all language error: ', error)
        return [defaultLanguage]
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return data || []
}

export default useLanguage
