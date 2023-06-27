import BigNumber from 'bignumber.js'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

interface MinAmountDisplayProps {
  amount: number
  prefix?: string
  unit?: string
}

export const minAmountDisplay = ({ amount, prefix = '', unit = '' }: MinAmountDisplayProps) => {
  return new BigNumber(amount).gt(0) && new BigNumber(amount).lte(0.01)
    ? `<${prefix}0.01${unit}`
    : `${prefix}${formatNumber(amount)}${unit}`
}
