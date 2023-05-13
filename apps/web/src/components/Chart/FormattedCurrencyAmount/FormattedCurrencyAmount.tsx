import { Currency, CurrencyAmount, Fraction } from '@pancakeswap/sdk'

const CURRENCY_AMOUNT_MIN = new Fraction(1n, 1000000n)

interface FormatterCurrencyAmountProps {
  currencyAmount?: CurrencyAmount<Currency>
  significantDigits?: number
  isShowExactAmount?: boolean
}

export function formattedCurrencyAmount({
  currencyAmount,
  significantDigits = 4,
  isShowExactAmount = false,
}: FormatterCurrencyAmountProps) {
  return !currencyAmount || currencyAmount.equalTo(0n)
    ? '0'
    : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
    ? isShowExactAmount
      ? currencyAmount.toFixed(6, { groupSeparator: ',' })
      : currencyAmount.toSignificant(significantDigits, { groupSeparator: ',' })
    : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`
}

export default function FormattedCurrencyAmount(props: FormatterCurrencyAmountProps) {
  return <>{formattedCurrencyAmount(props)}</>
}
