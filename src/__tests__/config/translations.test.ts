import Path from 'path'
import fs from 'fs'
import translations from 'config/localization/translations.json'

const allTranslationKeys = Object.keys(translations)

describe('Check translations integrity', () => {
  it.each(allTranslationKeys)('Translation key value should be equal', (key) => {
    expect(key).toEqual(translations[key])
  })
})

describe('Check translations available', () => {
  const files = []
  const translationKeys = new Set(allTranslationKeys)

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

  const extractedKeys = new Set<string>()

  const regexWithoutCarriageReturn = /\bt\((["'])((?:\\1|(?:(?!\1)).)*)(\1)/gm
  const regexWithCarriageReturn = /\bt\([\r\n]\s+(["'])([^]*?)(\1)/gm

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
        extractedKeys.add(match[2])
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
          extractedKeys.add(placeHolderMatch[1])
        }
      }
    }

    const regexWithTrans = /<Trans>([^$]*?)<\/Trans>/gm
    const regexWithTransCarriage = /<Trans>([\r\n]\s+[^]*?)<\/Trans>/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithTrans.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithTransCarriage.exec(data)) !== null
    ) {
      match = match[1].replace(/\n\s+/g, ' ').trim()
      if (match) {
        extractedKeys.add(match)
      }
    }
  }

  it.each(Array.from(extractedKeys))('Translation key should exist in translations json', (key) => {
    const includes = translationKeys.has(key)
    try {
      expect(includes).toBe(true)
      translationKeys.delete(key)
    } catch (e) {
      console.info(`Found unknown key "${key}"`)
    }
  })

  it('should use all translation key in translation.json', () => {
    try {
      expect(translationKeys.size).toBe(0)
    } catch (error) {
      throw new Error(
        `Found unused key(s) ${JSON.stringify(Array.from(translationKeys.values()), null, '\t')} in translation.json`,
      )
    }
  })
})
