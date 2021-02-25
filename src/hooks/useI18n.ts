import { useContext } from 'react'
import { isEmpty } from 'lodash'
import { TranslationsContext } from '../contexts/Localisation/translationsContext'

interface ContextData {
  [key: string]: number | string
}

const useI18n = () => {
  const { translations } = useContext(TranslationsContext)

  return (translationId: number, fallback: string, data: ContextData = {}) => {
    if (translations.length === 0) {
      return fallback
    }

    const foundTranslation = translations.find((translation) => {
      return translation.data.stringId === translationId
    })

    if (foundTranslation) {
      const { text } = foundTranslation.data
      const includesVariable = text.includes('%')

      if (includesVariable) {
        let interpolatedText = text

        // If dynamic tags are found but no data was passed return the fallback
        if (isEmpty(data)) {
          return fallback
        }

        Object.keys(data).forEach((dataKey) => {
          const templateKey = new RegExp(`%${dataKey}%`, 'g')
          interpolatedText = interpolatedText.replace(templateKey, data[dataKey])
        })

        return interpolatedText
      }

      return text
    }

    return fallback
  }
}

export default useI18n
