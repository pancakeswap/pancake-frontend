import { Flex, Skeleton, Text, FlexGap, FlexGapProps } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { formatAmount, formatAmountNotation, tokenPrecisionStyle } from 'utils/formatInfoNumbers'

const formatOptions = {
  notation: 'standard' as formatAmountNotation,
  displayThreshold: 0.001,
  tokenPrecision: 'normal' as tokenPrecisionStyle,
}

interface TokenDisplayProps extends FlexGapProps {
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

const PairPriceDisplay: React.FC<React.PropsWithChildren<TokenDisplayProps>> = ({
  value,
  inputSymbol,
  outputSymbol,
  children,
  format = true,
  ...props
}) => {
  return value ? (
    <FlexGap alignItems="baseline" {...props}>
      <Flex alignItems="inherit">
        <TextLabel mr="8px" bold>
          {format ? formatAmount(typeof value === 'string' ? parseFloat(value) ?? 0 : value, formatOptions) : value}
        </TextLabel>
        {inputSymbol && outputSymbol && (
          <Text color="textSubtle" fontSize="20px" bold lineHeight={1.1}>
            {`${inputSymbol}/${outputSymbol}`}
          </Text>
        )}
      </Flex>
      {children}
    </FlexGap>
  ) : (
    <Skeleton height="36px" width="128px" {...props} />
  )
}

export default PairPriceDisplay
