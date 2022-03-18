export const perpetualLangs = { 'zh-cn': 'zh-CN', en: 'en', ko: 'ko' }
export const perpLangMap = (languageCode: string) => {
  if (!languageCode) {
    return 'en'
  }
  if (perpetualLangs[languageCode]) {
    return perpetualLangs[languageCode]
  }
  return 'en'
}
