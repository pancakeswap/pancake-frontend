import { Flex, FlexProps, Skeleton, Text } from '@pancakeswap/uikit'
import React, { FC } from 'react'
import { formatAmount, formatAmountNotation } from 'views/Info/utils/formatInfoNumbers'

const formatOptions = {
  notation: 'standard' as formatAmountNotation,
  displayThreshold: 0.001,
  tokenPrecision: true,
}

interface TokenDisplayProps extends FlexProps {
  value?: number
  symbol?: string
}

const TokenDisplay: FC<TokenDisplayProps> = ({ value, symbol, children, ...props }) => {
  return value ? (
    <Flex alignItems="flex-end" {...props}>
      <Text fontSize="40px" mr="8px" bold>
        {formatAmount(value, formatOptions)}
      </Text>
      <Text color="textSubtle" fontSize="20px" mb="8px" mr="8px" bold>
        {symbol}
      </Text>
      {children}
    </Flex>
  ) : (
    <Skeleton height="36px" width="128px" {...props} />
  )
}

export default TokenDisplay
