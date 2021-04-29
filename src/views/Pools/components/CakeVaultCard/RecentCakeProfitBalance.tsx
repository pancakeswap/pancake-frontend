import React from 'react'
import BigNumber from 'bignumber.js'
import { Text } from '@pancakeswap-libs/uikit'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { convertSharesToCake } from '../../helpers'

interface RecentCakeProfitBalanceProps {
  cakeAtLastUserAction: BigNumber
  userShares: BigNumber
  pricePerFullShare: BigNumber
}

const RecentCakeProfitBalance: React.FC<RecentCakeProfitBalanceProps> = ({
  cakeAtLastUserAction,
  userShares,
  pricePerFullShare,
}) => {
  const currentSharesAsCake = convertSharesToCake(userShares, pricePerFullShare)
  const cakeProfit = currentSharesAsCake.cakeAsBigNumber.minus(cakeAtLastUserAction)
  const cakeToDisplay = cakeProfit.gte(0) ? getFullDisplayBalance(cakeProfit, 18, 5) : '0'

  return <Text fontSize="14px">{cakeToDisplay}</Text>
}

export default RecentCakeProfitBalance
