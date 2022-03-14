export const perpetualLangs = { 'zh-cn': 'zh-CN' }
export const perpLangMap = (languageCode: string) => {
  if (!languageCode) {
    return 'en'
  }
  if (perpetualLangs[languageCode]) {
    return perpetualLangs[languageCode]
  }
  return languageCode
}
