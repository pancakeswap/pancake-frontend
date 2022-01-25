import { ReactText } from 'react'
import { Language } from '@pancakeswap/uikit'

export type ContextData = {
  [key: string]: ReactText
}

export interface ProviderState {
  isFetching: boolean
  currentLanguage: Language
}

export interface ContextApi extends ProviderState {
  setLanguage: (language: Language) => void
  t: Translate
}

export type Translate = (key: string, data?: ContextData) => string
