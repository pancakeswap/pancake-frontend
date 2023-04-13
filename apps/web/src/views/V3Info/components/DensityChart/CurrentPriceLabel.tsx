import { AutoColumn, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { PoolData, DensityChartEntry } from '../../types'
import { RowFixed } from '../Row'

const Wrapper = styled.div`
  border-radius: 8px;
  padding: 6px 12px;
  color: white;
  width: fit-content;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

interface LabelProps {
  x: number
  y: number
  index: number
}

interface CurrentPriceLabelProps {
  data: DensityChartEntry[] | undefined
  chartProps: any
  poolData: PoolData
}

export function CurrentPriceLabel({ data, chartProps, poolData }: CurrentPriceLabelProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const labelData = chartProps as LabelProps
  const entryData = data?.[labelData.index]
  if (entryData?.isCurrent) {
    const { price0 } = entryData
    const { price1 } = entryData
    return (
      <g>
        <foreignObject x={labelData.x - 80} y={318} width="100%" height={100}>
          <Wrapper>
            <AutoColumn gap="6px">
              <RowFixed align="center">
                <Text mr="6px">{t('Current Price')}</Text>
                <Box
                  style={{
                    marginTop: '2px',
                    height: '6px',
                    width: '6px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.failure,
                  }}
                />
              </RowFixed>
              <Text>{`1 ${poolData.token0.symbol} = ${Number(price0).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolData.token1.symbol}`}</Text>
              <Text>{`1 ${poolData.token1.symbol} = ${Number(price1).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolData.token0.symbol}`}</Text>
            </AutoColumn>
          </Wrapper>
        </foreignObject>
      </g>
    )
  }
  return null
}
