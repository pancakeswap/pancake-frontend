import React, { createContext } from 'react'

interface TranslationState {
  translations: Array<any>
  setTranslations: React.Dispatch<React.SetStateAction<Array<any>>>
}

const defaultTranslationState: TranslationState = {
  translations: [],
  setTranslations: (): void => {},
}

export const TranslationsContext = createContext(
  defaultTranslationState as TranslationState,
)
