import { Language } from '@pancakeswap/uikit'

export const EN: Language = { locale: 'en-US', language: 'English', code: 'en' }
export const VI: Language = { locale: 'vi-VN', language: 'Tiếng Việt', code: 'vi' }

export const languages: Record<string, Language> = {
  'en-US': EN,
  'vi-VN': VI,
}

const languageList = Object.values(languages)

export default languageList
