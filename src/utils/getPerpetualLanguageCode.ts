export const perpetualLangs = { 'zh-cn': 'zh-CN' }
export const perpLangMap = (code: string) => {
  if (!code) {
    return 'en'
  }
  if (perpetualLangs[code]) {
    return perpetualLangs[code]
  }
  return code
}
