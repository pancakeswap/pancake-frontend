export const AR: Language = { code: 'ar', language: 'العربية' }
export const CA: Language = { code: 'ca', language: 'Català' }
export const CS: Language = { code: 'cs', language: 'Čeština' }
export const EN: Language = { code: 'en', language: 'English' }
export const DA: Language = { code: 'da', language: 'Dansk' }
export const DE: Language = { code: 'de', language: 'Deutsch' }
export const EL: Language = { code: 'el', language: 'Ελληνικά' }
export const ESES: Language = { code: 'es-ES', language: 'Español' }
export const FI: Language = { code: 'fi', language: 'Suomalainen' }
export const FIL: Language = { code: 'fil', language: 'Filipino' }
export const FR: Language = { code: 'fr', language: 'Français' }
export const HI: Language = { code: 'hi', language: 'हिंदी' }
export const HU: Language = { code: 'hu', language: 'Magyar' }
export const ID: Language = { code: 'id', language: 'Bahasa Indonesia' }
export const IT: Language = { code: 'it', language: 'Italiano' }
export const JA: Language = { code: 'ja', language: '日本語' }
export const KO: Language = { code: 'ko', language: '한국어' }
export const NL: Language = { code: 'nl', language: 'Nederlands' }
export const PTBR: Language = { code: 'pt-BR', language: 'Português' }
export const RO: Language = { code: 'ro', language: 'Română' }
export const RU: Language = { code: 'ru', language: 'Русский' }
export const SR: Language = { code: 'sr', language: 'Српски' }
export const SVSE: Language = { code: 'sv-SE', language: 'Svenska' }
export const TA: Language = { code: 'ta', language: 'தமிழ்' }
export const TR: Language = { code: 'tr', language: 'Türkçe' }
export const UK: Language = { code: 'uk', language: 'Українська' }
export const VI: Language = { code: 'vi', language: 'Tiếng Việt' }
export const ZHCN: Language = { code: 'zh-CN', language: '简体中文' }
export const ZHTW: Language = { code: 'zh-TW', language: '繁體中文' }

export const languages = {
  ar: AR,
  ca: CA,
  cs: CS,
  en: EN,
  da: DA,
  de: DE,
  el: EL,
  'es-ES': ESES,
  fi: FI,
  fil: FIL,
  fr: FR,
  hi: HI,
  hu: HU,
  id: ID,
  it: IT,
  ja: JA,
  ko: KO,
  nl: NL,
  'pt-BR': PTBR,
  ro: RO,
  ru: RU,
  sr: SR,
  'sv-SE': SVSE,
  ta: TA,
  tr: TR,
  uk: UK,
  vi: VI,
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
