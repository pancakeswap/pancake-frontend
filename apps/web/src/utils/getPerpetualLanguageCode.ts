export const perpetualLangs = {
  en: 'en',
  ko: 'ko',
  ja: 'ja',
  de: 'de',
  fr: 'fr',
  id: 'id',
  tr: 'tr',
  hi: 'hi',
  ru: 'ru',
  vi: 'vi',
  pl: 'pl',
  uk: 'uk-UA',
  'es-ES': 'es',
  'zh-cn': 'zh-CN',
  'pt-br': 'pt-BR',
}

export const perpLangMap = (languageCode: string) => {
  if (!languageCode) {
    return 'en'
  }
  if (perpetualLangs[languageCode]) {
    return perpetualLangs[languageCode]
  }
  return 'en'
}
