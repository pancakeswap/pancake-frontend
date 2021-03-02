import React from 'react'
import BigNumber from 'bignumber.js'
import { Text } from '@pancakeswap-libs/uikit'
import { UserInfo } from 'views/Ifos/hooks/useGetWalletIfoData'
import useI18n from 'hooks/useI18n'

interface PercentageOfTotalProps {
  userAmount: UserInfo['amount']
  raisingAmount: BigNumber
}

const PercentageOfTotal: React.FC<PercentageOfTotalProps> = ({ userAmount, raisingAmount }) => {
  const TranslateString = useI18n()
  const percentOfUserContribution = userAmount.div(raisingAmount).times(100).toNumber()
  const percentofUserDisplay = percentOfUserContribution.toLocaleString(undefined, { maximumFractionDigits: 2 })

  return (
    <Text fontSize="14px" color="textSubtle">
      {TranslateString(999, `${percentofUserDisplay}% of total`, { num: percentofUserDisplay })}
    </Text>
  )
}

export default PercentageOfTotal
