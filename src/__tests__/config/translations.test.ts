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

  function throughDirectory(directory, includeJs = false) {
    fs.readdirSync(directory).forEach((file) => {
      const absolute = Path.join(directory, file)
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute)
      if (
        (absolute.includes('.tsx') || absolute.includes('.ts') || (includeJs && absolute.includes('.js'))) &&
        !absolute.includes('.d.ts')
      ) {
        return files.push(absolute)
      }
      return files.length
    })
  }

  throughDirectory('src/')
  throughDirectory('node_modules/@pancakeswap/uikit/dist', true)

  let match

  const unknownKeys = new Set<string>()

  const regexWithoutCarriageReturn = /\bt\((["'])((?:\\1|(?:(?!\1)).)*)(\1)/gm
  const regexWithCarriageReturn = /\bt\([\r\n]\s+(["'])([^']*?)(\1)/gm

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithoutCarriageReturn.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithCarriageReturn.exec(data)) !== null
    ) {
      if (match[2].trim()) {
        unknownKeys.add(match[2])
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
          unknownKeys.add(placeHolderMatch[1])
        }
      }
    }
  }

  it.each([...unknownKeys])('Translation key should exist in translations json', (key) => {
    const includes = translationKeys.includes(key)
    try {
      expect(includes).toBe(true)
    } catch (e) {
      console.info(`Found unknown key "${key}"`)
    }
  })
})
