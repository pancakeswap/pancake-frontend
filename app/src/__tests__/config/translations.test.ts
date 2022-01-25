import Path from 'path'
import fs from 'fs'
import translations from 'config/localization/translations.json'

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
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })

    let match

    const unknownKeys = new Set()

    const regexWithoutCarriageReturn = /\bt\('([^']*?)'/gm
    const regexWithCarriageReturn = /\bt\([\r\n]\s+'([^']*?)'/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithoutCarriageReturn.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithCarriageReturn.exec(data)) !== null
    ) {
      if (match[1].trim()) {
        const includes = translationKeys.includes(match[1])
        try {
          expect(includes).toBe(true)
        } catch (e) {
          unknownKeys.add(match[1])
          console.info(`Found unknown key "${match[1]}" in ${file}`)
        }
      }
    }

    const regexWithSearchInput = /<SearchInput ([^']*?) \/>/gm
    const regexWithSearchInputPlaceHolder = /placeholder="([^']*?)"/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithSearchInput.exec(data)) !== null
    ) {
      if (match[1].trim()) {
        const placeHolderMatch = regexWithSearchInputPlaceHolder.exec(match[1])
        if (placeHolderMatch[1]) {
          const includes = translationKeys.includes(placeHolderMatch[1])
          try {
            expect(includes).toBe(true)
          } catch (e) {
            unknownKeys.add(placeHolderMatch[1])
            console.info(`Found unknown key "${placeHolderMatch[1]}" in ${file}`)
          }
        }
      }
    }

    if (unknownKeys.size > 0) {
      throw new Error(`Found unknown key(s) ${JSON.stringify(Array.from(unknownKeys.values()), null, '\t')} in ${file}`)
    }
  })
})
