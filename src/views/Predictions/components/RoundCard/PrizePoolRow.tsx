import React from 'react'
import { Flex, FlexProps, Text } from '@pancakeswap-libs/uikit'
import { formatBnb } from 'views/Predictions/helpers'
import useI18n from 'hooks/useI18n'
import { Round } from 'state/types'

interface PrizePoolRowProps extends FlexProps {
  totalAmount: Round['totalAmount']
}

const getPrizePoolAmount = (totalAmount: PrizePoolRowProps['totalAmount']) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnb(totalAmount)
}

const PrizePoolRow: React.FC<PrizePoolRowProps> = ({ totalAmount, ...props }) => {
  const TranslateString = useI18n()

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      <Text bold>{TranslateString(999, 'Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmount(totalAmount)} BNB`}</Text>
    </Flex>
  )
}

export default PrizePoolRow
