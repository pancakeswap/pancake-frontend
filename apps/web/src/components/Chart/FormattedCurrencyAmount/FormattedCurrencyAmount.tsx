import { Currency, CurrencyAmount, Fraction } from '@pancakeswap/sdk'

const CURRENCY_AMOUNT_MIN = new Fraction(1n, 1000000n)

interface FormatterCurrencyAmountProps {
  currencyAmount?: CurrencyAmount<Currency>
  significantDigits?: number
}

export function formattedCurrencyAmount({ currencyAmount, significantDigits = 4 }: FormatterCurrencyAmountProps) {
  return !currencyAmount || currencyAmount.equalTo(0n)
    ? '0'
    : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
    ? currencyAmount.toSignificant(significantDigits, { groupSeparator: ',' })
    : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`
}

export default function FormattedCurrencyAmount(props: FormatterCurrencyAmountProps) {
  return <>{formattedCurrencyAmount(props)}</>
}
