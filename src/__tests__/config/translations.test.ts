import translations from '../../config/localization/translations.json'

describe('Check translations integrity', () => {
  it.each(Object.keys(translations))('Translation key value should be equal', (key) => {
    expect(key).toEqual(translations[key])
  })
})
