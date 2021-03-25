import React from 'react'
import { Box, BoxProps, Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round } from 'state/types'
import { formatBnb, formatUsd } from '../../helpers'

interface ExpiredRoundCardProps extends BoxProps {
  lockPrice: Round['lockPrice']
  totalAmount: Round['totalAmount']
}

const RoundInfo: React.FC<ExpiredRoundCardProps> = ({ lockPrice, totalAmount, ...props }) => {
  const TranslateString = useI18n()

  return (
    <Box {...props}>
      {lockPrice && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="14px">{TranslateString(999, 'Locked Price')}:</Text>
          <Text fontSize="14px">{`${formatUsd(lockPrice)}`}</Text>
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text bold>{TranslateString(999, 'Prize Pool')}:</Text>
        <Text bold>{`${formatBnb(totalAmount)} BNB`}</Text>
      </Flex>
    </Box>
  )
}

export default RoundInfo
