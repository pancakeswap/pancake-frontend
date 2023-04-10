import { Currency, CurrencyAmount, Fraction } from '@pancakeswap/sdk'
import JSBI from 'jsbi'

const CURRENCY_AMOUNT_MIN = new Fraction(JSBI.BigInt(1), JSBI.BigInt(1000000))

interface FormatterCurrencyAmountProps {
  currencyAmount?: CurrencyAmount<Currency>
  significantDigits?: number
}

export function formattedCurrencyAmount({ currencyAmount, significantDigits = 4 }: FormatterCurrencyAmountProps) {
  return !currencyAmount || currencyAmount.equalTo(JSBI.BigInt(0))
    ? '0'
    : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
    ? currencyAmount.toSignificant(significantDigits, { groupSeparator: ',' })
    : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`
}

export default function FormattedCurrencyAmount(props: FormatterCurrencyAmountProps) {
  return <>{formattedCurrencyAmount(props)}</>
}
