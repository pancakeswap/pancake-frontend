export const AR: Language = { code: 'ar-SA', language: 'العربية' }
// export const CA: Language = { code: 'ca', language: 'Català' }
// export const CS: Language = { code: 'cs', language: 'Čeština' }
export const EN: Language = { code: 'en-US', language: 'English' }
// export const DA: Language = { code: 'da', language: 'Dansk' }
export const DE: Language = { code: 'de-DE', language: 'Deutsch' }
export const EL: Language = { code: 'el-GR', language: 'Ελληνικά' }
export const ESES: Language = { code: 'es-ES', language: 'Español' }
export const FI: Language = { code: 'fi-FI', language: 'Suomalainen' }
export const FIL: Language = { code: 'fil-PH', language: 'Filipino' }
export const FR: Language = { code: 'fr-FR', language: 'Français' }
export const HI: Language = { code: 'hi-IN', language: 'हिंदी' }
export const HU: Language = { code: 'hu-HU', language: 'Magyar' }
export const ID: Language = { code: 'id-ID', language: 'Bahasa Indonesia' }
export const IT: Language = { code: 'it-IT', language: 'Italiano' }
export const JA: Language = { code: 'ja-JP', language: '日本語' }
export const KO: Language = { code: 'ko-KR', language: '한국어' }
export const NL: Language = { code: 'nl-NL', language: 'Nederlands' }
export const PTBR: Language = { code: 'pt-BR', language: 'Português' }
export const RO: Language = { code: 'ro-RO', language: 'Română' }
export const RU: Language = { code: 'ru-RU', language: 'Русский' }
// export const SR: Language = { code: 'sr', language: 'Српски' }
export const SVSE: Language = { code: 'sv-SE', language: 'Svenska' }
export const TA: Language = { code: 'ta-IN', language: 'தமிழ்' }
export const TR: Language = { code: 'tr-TR', language: 'Türkçe' }
export const UK: Language = { code: 'uk-UA', language: 'Українська' }
export const VI: Language = { code: 'vi-VN', language: 'Tiếng Việt' }
export const ZHCN: Language = { code: 'zh-CN', language: '简体中文' }
export const ZHTW: Language = { code: 'zh-TW', language: '繁體中文' }

export const languages = {
  'ar-SA': AR,
  'en-US': EN,
  'de-DE': DE,
  'el-GR': EL,
  'es-ES': ESES,
  'fi-FI': FI,
  'fil-PH': FIL,
  'fr-FR': FR,
  'hi-IN': HI,
  'hu-HU': HU,
  'id-ID': ID,
  'it-IT': IT,
  'ja-JP': JA,
  'ko-KR': KO,
  'nl-NL': NL,
  'pt-BR': PTBR,
  'ro-RO': RO,
  'ru-RU': RU,
  'sv-SE': SVSE,
  'ta-IN': TA,
  'tr-TR': TR,
  'uk-UA': UK,
  'vi-VN': VI,
  'zh-CN': ZHCN,
  'zh-TW': ZHTW,
}

export const languageList = Object.values(languages)

// Export this here to avoid dependency cycle
export type LanguageCode = keyof typeof languages

export interface Language {
  code: LanguageCode
  language: string
}
