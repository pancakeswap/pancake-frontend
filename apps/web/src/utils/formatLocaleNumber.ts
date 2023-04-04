import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'

interface FormatLocaleNumberArgs {
  number: CurrencyAmount<Currency> | Price<Currency, Currency> | number
  locale: string | null | undefined
  options?: Intl.NumberFormatOptions
  sigFigs?: number
  fixedDecimals?: number
}

export default function formatLocaleNumber({
  number,
  locale,
  sigFigs,
  fixedDecimals,
  options = {},
}: FormatLocaleNumberArgs): string {
  let numberString: number
  if (typeof number === 'number') {
    numberString = fixedDecimals ? parseFloat(number.toFixed(fixedDecimals)) : number
  } else {
    const baseString = parseFloat(number.toSignificant(sigFigs))
    numberString = fixedDecimals ? parseFloat(baseString.toFixed(fixedDecimals)) : baseString
  }

  return numberString.toLocaleString(locale, {
    ...options,
    minimumFractionDigits: options.minimumFractionDigits || fixedDecimals,
    maximumFractionDigits: options.maximumFractionDigits || fixedDecimals,
    maximumSignificantDigits: options.maximumSignificantDigits || fixedDecimals ? undefined : sigFigs,
  })
}
