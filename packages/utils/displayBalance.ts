import { formatBigInt } from './formatBalance'
import { parseUnits } from './viem/parseUnits'

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
