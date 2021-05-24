import Path from 'path'
import fs from 'fs'
import translations from '../../config/localization/translations.json'

describe('Check translations integrity', () => {
  it.each(Object.keys(translations))('Translation key value should be equal', (key) => {
    expect(key).toEqual(translations[key])
  })
})

describe('Check translations available', () => {
  const files = []
  const translationKeys = Object.keys(translations)

  function throughDirectory(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const absolute = Path.join(directory, file)
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute)
      if (absolute.includes('.tsx') || absolute.includes('.ts')) {
        return files.push(absolute)
      }
      return files.length
    })
  }

  throughDirectory('src/')

  it.each(files)('Translation key should exist in translations json', (file) => {
    const regex = /\bt\('([^']*)'/gm
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
    let match
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(data)) !== null) {
      if (match[1].trim()) {
        const includes = translationKeys.includes(match[1])
        try {
          expect(includes).toBe(true)
        } catch (e) {
          throw new Error(`Found unknown key ${match[1]} in ${file}`)
        }
      }
    }
  })
})
