import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, Text } from '@pancakeswap/uikit'
import { RowFixed } from 'components/Layout/Row'
import useTheme from 'hooks/useTheme'
import { PoolInfo } from 'state/farmsV4/state/type'
import { styled } from 'styled-components'
import { V3LiquidityChartData } from './type'

const Wrapper = styled.div`
  border-radius: 8px;
  padding: 6px 12px;
  color: white;
  width: fit-content;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

interface CurrentPriceLabelProps {
  data: V3LiquidityChartData[] | undefined
  x?: number
  // y?: number
  index?: number
  poolInfo?: PoolInfo
}

export const CurrentPriceLabel: React.FC<CurrentPriceLabelProps> = ({ data, x = 0, index = 0, poolInfo }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const entryData = data?.[index]
  if (entryData?.isCurrent) {
    const { price0 } = entryData
    const { price1 } = entryData
    return (
      <g>
        <foreignObject x={x - 80} y={290} width="100%" height={100} style={{ zIndex: 9999 }}>
          <Wrapper>
            <AutoColumn gap="2px">
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
              <Text>{`1 ${poolInfo?.token0.symbol} = ${Number(price0).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolInfo?.token1.symbol}`}</Text>
              <Text>{`1 ${poolInfo?.token1.symbol} = ${Number(price1).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolInfo?.token0.symbol}`}</Text>
            </AutoColumn>
          </Wrapper>
        </foreignObject>
      </g>
    )
  }
  return null
}
