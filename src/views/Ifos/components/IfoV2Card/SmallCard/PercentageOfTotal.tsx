import React from 'react'
import BigNumber from 'bignumber.js'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface PercentageOfTotalProps {
  userAmount: BigNumber
  totalAmount: BigNumber
}

const PercentageOfTotal: React.FC<PercentageOfTotalProps> = ({ userAmount, totalAmount }) => {
  const TranslateString = useI18n()
  const percentOfUserContribution = userAmount.div(totalAmount).times(100).toNumber()
  const percentOfUserDisplay = percentOfUserContribution.toLocaleString(undefined, { maximumFractionDigits: 5 })

  return (
    <Text fontSize="14px" color="textSubtle">
      {TranslateString(999, `${percentOfUserDisplay}% of total`, { num: percentOfUserDisplay })}
    </Text>
  )
}

export default PercentageOfTotal
