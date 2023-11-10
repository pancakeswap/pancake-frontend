import { Currency, CurrencyAmount, Fraction } from '@pancakeswap/sdk'
import { formatAmount } from '@pancakeswap/utils/formatFractions'

const CURRENCY_AMOUNT_MIN = new Fraction(1n, 1000000n)

interface FormatterCurrencyAmountProps {
  currencyAmount?: CurrencyAmount<Currency>
  significantDigits?: number
}

export function formattedCurrencyAmount({ currencyAmount, significantDigits = 4 }: FormatterCurrencyAmountProps) {
  const formattedAmount = formatAmount(currencyAmount, significantDigits)
  return !formattedAmount || !currencyAmount || currencyAmount.equalTo(0n)
    ? '0'
    : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
    ? new Intl.NumberFormat(undefined, {
        maximumSignificantDigits: significantDigits,
      }).format(Number(formattedAmount))
    : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`
}

export default function FormattedCurrencyAmount(props: FormatterCurrencyAmountProps) {
  return <>{formattedCurrencyAmount(props)}</>
}
