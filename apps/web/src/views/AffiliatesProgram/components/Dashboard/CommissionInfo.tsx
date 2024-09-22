import React, { ReactNode, useMemo } from 'react'
import { useTranslation, Trans } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Box, Card, Flex, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { InfoDetail } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import PieChartContainer from './PieChartContainer'

const StyledFlex = styled(Flex)`
  flex: 1;
  flex-direction: column;
`

const CardInner = styled(Flex)`
  width: 100%;
  height: 100%;
  justify-content: space-between;

  ${StyledFlex} {
    &:first-child {
      height: 66px;
      border-right: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};
    }
  }
`

const StyledCircle = styled(Flex)<{ backgroundColor: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => `${backgroundColor}`};
`

interface CommissionInfoProps {
  affiliate: InfoDetail
}

export interface ChartInfo {
  id: string
  name: ReactNode
  chartColor: string
  usdValue: string
  cakeValue: string
  cakeValueAsNumber: number
  percentage: string
}

const chartConfig: ChartInfo[] = [
  {
    id: 'totalPerpSwapEarnFeeUSD',
    name: <Trans>V1 Perp Swap Earn Fee</Trans>,
    chartColor: '#ED4B9E',
    usdValue: '0',
    cakeValue: '0',
    cakeValueAsNumber: 0,
    percentage: '0',
  },
  {
    id: 'totalStableSwapEarnFeeUSD',
    name: <Trans>Stable Swap Earn Fee</Trans>,
    chartColor: '#FFB237',
    usdValue: '0',
    cakeValue: '0',
    cakeValueAsNumber: 0,
    percentage: '0',
  },
  {
    id: 'totalV2SwapEarnFeeUSD',
    name: <Trans>V2 Swap Earn Fee</Trans>,
    chartColor: '#7645D9',
    usdValue: '0',
    cakeValue: '0',
    cakeValueAsNumber: 0,
    percentage: '0',
  },
  {
    id: 'totalV3SwapEarnFeeUSD',
    name: <Trans>V3 Swap Earn Fee</Trans>,
    chartColor: '#2ECFDC',
    usdValue: '0',
    cakeValue: '0',
    cakeValueAsNumber: 0,
    percentage: '0',
  },
]

const CommissionInfo: React.FC<React.PropsWithChildren<CommissionInfoProps>> = ({ affiliate }) => {
  const { t } = useTranslation()
  const cakePrice = useCakePrice()
  const { totalUsers, totalEarnFeeUSD } = affiliate.metric

  const totalCakeEarned = useMemo(() => {
    const cakeBalance = new BigNumber(totalEarnFeeUSD).div(cakePrice).toNumber()
    return formatNumber(cakeBalance)
  }, [cakePrice, totalEarnFeeUSD])

  const chartData = useMemo(() => {
    return chartConfig
      .map((chart) => {
        const usdValue: string = affiliate.metric[chart?.id] ?? '0'
        const cakeBalance = new BigNumber(usdValue).div(cakePrice).toNumber()
        const valuePercentage = new BigNumber(usdValue).div(totalEarnFeeUSD)
        const percentage = new BigNumber(valuePercentage.isNaN() ? '0' : valuePercentage).times(100).toNumber()
        return {
          ...chart,
          usdValue,
          cakeValue: formatNumber(cakeBalance),
          cakeValueAsNumber: cakeBalance,
          percentage: formatNumber(percentage),
        }
      })
      .sort((a, b) => b.cakeValueAsNumber - a.cakeValueAsNumber)
  }, [affiliate?.metric, cakePrice, totalEarnFeeUSD])

  return (
    <Box width={['100%', '100%', '100%', '100%', '100%', '387px']}>
      <Card>
        <Box padding={['24px']}>
          <CardInner mb="28px">
            <StyledFlex>
              <Text color="secondary" bold fontSize={['12px']} textTransform="uppercase">
                {t('Active friends')}
              </Text>
              <Text fontSize={['32px']} bold>
                {totalUsers}
              </Text>
            </StyledFlex>
            <StyledFlex pl="10%">
              <Text color="secondary" bold fontSize={['12px']} textTransform="uppercase">
                {t('Total cake earned')}
              </Text>
              <Text fontSize={['32px']} bold>{`~ ${totalCakeEarned}`}</Text>
              <Text color="textSubtle" fontSize="14px">{`$ ${formatNumber(Number(totalEarnFeeUSD))}`}</Text>
            </StyledFlex>
          </CardInner>
          <Box mb="24px">
            <Text mb="16px" color="secondary" bold fontSize={['12px']} textTransform="uppercase">
              {t('Rewards Breakdown')}
            </Text>
            {Number(totalEarnFeeUSD) > 0 && <PieChartContainer chartData={chartData} />}
          </Box>
          <Flex flexDirection="column">
            {chartData.map((chart) => (
              <Flex key={chart.id} width="100%" justifyContent="space-between" mb="16px">
                <Flex>
                  <StyledCircle backgroundColor={chart.chartColor} />
                  <Text ellipsis ml="8px" fontSize={['14px']}>
                    {chart.name}
                  </Text>
                </Flex>
                <Box ml="10px">
                  <Text bold fontSize={['16px']}>
                    {`${chart.percentage}%`}
                  </Text>
                  <Text color="textSubtle" fontSize={['14px']}>
                    {`~ ${chart.cakeValue} CAKE`}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Card>
    </Box>
  )
}

export default CommissionInfo
