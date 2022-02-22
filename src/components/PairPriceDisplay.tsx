import { Flex, FlexProps, Skeleton, Text } from '@pancakeswap/uikit'
import { FC } from 'react'
import styled from 'styled-components'
import { formatAmount, formatAmountNotation } from 'utils/formatInfoNumbers'

const formatOptions = {
  notation: 'standard' as formatAmountNotation,
  displayThreshold: 0.001,
  tokenPrecision: true,
}

interface TokenDisplayProps extends FlexProps {
  value?: number | string
  inputSymbol?: string
  outputSymbol?: string
  format?: boolean
}

const TextLabel = styled(Text)`
  font-size: 32px;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
`

const PairPriceDisplay: FC<TokenDisplayProps> = ({
  value,
  inputSymbol,
  outputSymbol,
  children,
  format = true,
  ...props
}) => {
  return value ? (
    <Flex alignItems="flex-end" {...props}>
      <TextLabel mr="8px" bold>
        {format ? formatAmount(value, formatOptions) : value}
      </TextLabel>
      {inputSymbol && outputSymbol && (
        <Text color="textSubtle" fontSize="20px" bold>
          {`${inputSymbol}/${outputSymbol}`}
        </Text>
      )}
      {children}
    </Flex>
  ) : (
    <Skeleton height="36px" width="128px" {...props} />
  )
}

export default PairPriceDisplay
