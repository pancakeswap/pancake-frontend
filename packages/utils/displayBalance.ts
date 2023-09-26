import { parseUnits } from 'viem'
import { formatBigInt } from './formatBalance'

export const displayBalance = ({
  balance,
  decimals,
  isBalanceZero,
}: {
  balance: `${number}`
  decimals: number
  isBalanceZero: boolean
}) => {
  if (isBalanceZero) {
    return '0'
  }

  const balanceUnits = parseUnits(balance, decimals)
  return formatBigInt(balanceUnits, decimals, decimals)
}
