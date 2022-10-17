import { Fraction } from '@pancakeswap/aptos-swap-sdk'

export default function formatAmountDisplay(amount: Fraction | undefined): string {
  if (!amount) return ''

  return `${parseFloat(amount?.toFixed(8) || '0')}`
}
