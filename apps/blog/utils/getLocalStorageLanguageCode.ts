const storageLanguage: any = {
  'en-US': 'en',
  'id-ID': 'id',
  'pt-PT': 'pt',
  'es-ES': 'es',
  'tr-TR': 'tr',
  'zh-CN': 'zh-CN',
  'ru-RU': 'ru',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'de-DE': 'de',
  'vi-VN': 'vi',
  'fr-FR': 'fr',
}
// {label: 'Georgian', value: 'ka'}

export const storageLangMap = (languageCode: string) => {
  if (!languageCode) {
    return 'en'
  }
  if (storageLanguage[languageCode]) {
    return storageLanguage[languageCode]
  }
  return 'en'
}
