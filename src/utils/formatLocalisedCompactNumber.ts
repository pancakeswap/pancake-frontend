import { getLanguageCodeFromLS } from 'contexts/Localization/helpers'

const formatLocalisedCompactNumber = (number: number): string => {
  const codeFromStorage = getLanguageCodeFromLS()
  return new Intl.NumberFormat(codeFromStorage, {
    notation: 'compact',
    compactDisplay: 'long',
    maximumSignificantDigits: 2,
  }).format(number)
}

export default formatLocalisedCompactNumber
