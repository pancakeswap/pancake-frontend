import { ReactText } from 'react'
import { Language } from '@pancakeswap/uikit'

import translations from 'config/localization/translations.json'

export type ContextData = {
  [key: string]: ReactText
}

export interface ProviderState {
  isFetching: boolean
  currentLanguage: Language
}

export interface ContextApi extends ProviderState {
  setLanguage: (language: Language) => void
  t: TranslateFunction
}

// To support string literals and union of string
// https://stackoverflow.com/questions/61047551/typescript-union-of-string-and-string-literals
// eslint-disable-next-line @typescript-eslint/ban-types
export type TranslationKey = keyof typeof translations | (string & {})

export type TranslateFunction = (key: TranslationKey, data?: ContextData) => string
