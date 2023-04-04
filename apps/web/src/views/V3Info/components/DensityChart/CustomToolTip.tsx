import { AutoColumn, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { PoolData } from '../../types'
import { formatAmount } from '../../utils/numbers'
import { LightCard } from '../Card'
import { RowBetween } from '../Row'

const TooltipWrapper = styled(LightCard)`
  padding: 12px;
  width: 320px;
  opacity: 0.6;
  font-size: 12px;
  z-index: 10;
`

interface CustomToolTipProps {
  chartProps: any
  poolData: PoolData
  currentPrice: number | undefined
}

function CustomToolTip({ chartProps, poolData, currentPrice }: CustomToolTipProps) {
  const { theme } = useTheme()
  const price0 = chartProps?.payload?.[0]?.payload.price0
  const price1 = chartProps?.payload?.[0]?.payload.price1
  const tvlToken0 = chartProps?.payload?.[0]?.payload.tvlToken0
  const tvlToken1 = chartProps?.payload?.[0]?.payload.tvlToken1

  return (
    <TooltipWrapper>
      <AutoColumn gap="sm">
        <Text color={theme.colors.textSubtle}>Tick stats</Text>
        <RowBetween>
          <Text>{poolData?.token0?.symbol} Price: </Text>
          <Text>
            {price0
              ? Number(price0).toLocaleString(undefined, {
                  minimumSignificantDigits: 1,
                })
              : ''}{' '}
            {poolData?.token1?.symbol}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text>{poolData?.token1?.symbol} Price: </Text>
          <Text>
            {price1
              ? Number(price1).toLocaleString(undefined, {
                  minimumSignificantDigits: 1,
                })
              : ''}{' '}
            {poolData?.token0?.symbol}
          </Text>
        </RowBetween>
        {currentPrice && price0 && currentPrice > price1 ? (
          <RowBetween>
            <Text>{poolData?.token0?.symbol} Locked: </Text>
            <Text>
              {tvlToken0 ? formatAmount(tvlToken0) : ''} {poolData?.token0?.symbol}
            </Text>
          </RowBetween>
        ) : (
          <RowBetween>
            <Text>{poolData?.token1?.symbol} Locked: </Text>
            <Text>
              {tvlToken1 ? formatAmount(tvlToken1) : ''} {poolData?.token1?.symbol}
            </Text>
          </RowBetween>
        )}
      </AutoColumn>
    </TooltipWrapper>
  )
}

export default CustomToolTip
