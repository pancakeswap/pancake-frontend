import { useContext } from 'react'
import { TranslationsContext } from '../contexts/Localisation/translationsContext'

const variableRegex = /\%(.*?)\%/

const replaceDynamicString = (foundTranslation: string, fallback: string) => {
  const stringToReplace = variableRegex.exec(foundTranslation)[0]
  const indexToReplace = foundTranslation.split(' ').indexOf(stringToReplace)
  const fallbackValueAtIndex = fallback.split(' ')[indexToReplace]
  return foundTranslation.replace(stringToReplace, fallbackValueAtIndex)
}

export const getTranslation = (
  translations: Array<any>,
  translationId: number,
  fallback: string,
) => {
  const foundTranslation = translations.find((translation) => {
    return translation.data.stringId === translationId
  })
  if (foundTranslation) {
    const translatedString = foundTranslation.data.text
    const includesVariable = translatedString.includes('%')
    if (includesVariable) {
      return replaceDynamicString(translatedString, fallback)
    }
    return translatedString
  } else {
    return fallback
  }
}

export const TranslateString = (translationId: number, fallback: string) => {
  const { translations } = useContext(TranslationsContext)
  if (translations[0] === 'error') {
    return fallback
  } else if (translations.length > 0) {
    return getTranslation(translations, translationId, fallback)
  }
}
