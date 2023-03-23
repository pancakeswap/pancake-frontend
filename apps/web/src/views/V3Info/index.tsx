import { AutoColumn, PairDataTimeWindowEnum, Text } from '@pancakeswap/uikit'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { ethereumTokens } from '@pancakeswap/tokens'
// import { useTransformedVolumeData } from 'hooks/chart'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import { useEffect, useMemo, useState } from 'react'
import { useProtocolChartData } from './hooks'

import { MonoSpace, PageWrapper, ThemedBackgroundGlobal } from './components/shared'
// import BarChart from './components/BarChart/alt'

import LineChart from './components/LineChart/alt'
import { ResponsiveRow } from './components/Row'
import { unixToDate } from './utils/date'
import { formatDollarAmount } from './utils/numbers'

const SwapLineChart = dynamic(() => import('@pancakeswap/uikit/src/components/Chart/PairPriceChart'), {
  ssr: false,
})

const ChartWrapper = styled.div`
  width: 49%;
`

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { theme } = useTheme()

  // const [protocolData] = useProtocolData()
  const { chainId } = useActiveChainId()

  const [, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  const [leftLabel, setLeftLabel] = useState<string | undefined>()
  // const [rightLabel, setRightLabel] = useState<string | undefined>()

  // Hot fix to remove errors in TVL data while subgraph syncs.
  const chartData = useProtocolChartData()

  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [chainId])

  const [, setHoverValue] = useState<number | undefined>()
  const [, setHoverDate] = useState<string | undefined>()
  const pairTokensPrice = usePairTokensPrice(ethereumTokens.weth, ethereumTokens.usdc, 'day', 1)

  // if hover value undefined, reset to current day value
  // useEffect(() => {
  //   if (volumeHover === undefined && protocolData) {
  //     setVolumeHover(protocolData.volumeUSD)
  //   }
  // }, [protocolData, volumeHover])
  // useEffect(() => {
  //   if (liquidityHover === undefined && protocolData) {
  //     setLiquidityHover(protocolData.tvlUSD)
  //   }
  // }, [liquidityHover, protocolData])

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.tvlUSD,
        }
      })
    }
    return []
  }, [chartData])

  // const formattedVolumeData = useMemo(() => {
  //   if (chartData) {
  //     return chartData.map((day) => {
  //       return {
  //         time: unixToDate(day.date),
  //         value: day.volumeUSD,
  //       }
  //     })
  //   }
  //   return []
  // }, [chartData])

  // const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  // const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  // const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.weekly)

  const tvlValue = useMemo(() => {
    return formatDollarAmount(liquidityHover ?? 0, 2, true)
  }, [liquidityHover])
  return (
    <PageWrapper>
      <ThemedBackgroundGlobal backgroundColor={theme.colors.background} />
      <AutoColumn gap="16px">
        <Text>PancakeSwap Overview</Text>
        <ResponsiveRow>
          <ChartWrapper>
            <LineChart
              data={formattedTvlData}
              height={220}
              minHeight={332}
              // color={theme.colors.primary}
              value={liquidityHover}
              label={leftLabel}
              setValue={setLiquidityHover}
              setLabel={setLeftLabel}
              topLeft={
                <AutoColumn gap="4px">
                  <Text fontSize="16px">TVL</Text>
                  <Text fontSize="32px">
                    <MonoSpace>{tvlValue} </MonoSpace>
                  </Text>
                  <Text fontSize="12px" height="14px">
                    {leftLabel ? <MonoSpace>{leftLabel} (UTC)</MonoSpace> : null}
                  </Text>
                </AutoColumn>
              }
            />
          </ChartWrapper>
          <ChartWrapper>
            <SwapLineChart
              data={pairTokensPrice}
              setHoverValue={setHoverValue}
              setHoverDate={setHoverDate}
              isChangePositive={false}
              isChartExpanded={false}
              timeWindow={PairDataTimeWindowEnum.DAY}
              // priceLineData={[
              //   { title: 'max', price: 100, color: '#31D0AA' },
              //   { title: 'min', price: 80, color: '#ED4B9E' },
              //   { title: 'mid', price: 90, color: '#BDC2C4' },
              // ]}
            />
          </ChartWrapper>
          {/* <ChartWrapper>
            <BarChart
              height={220}
              minHeight={332}
              data={
                volumeWindow === VolumeWindow.monthly
                  ? monthlyVolumeData
                  : volumeWindow === VolumeWindow.weekly
                  ? weeklyVolumeData
                  : formattedVolumeData
              }
              color={theme.colors.gradientBlue}
              setValue={setVolumeHover}
              setLabel={setRightLabel}
              value={volumeHover}
              label={rightLabel}
              activeWindow={volumeWindow}
              topRight={
                <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
                  <SmallOptionButton
                    active={volumeWindow === VolumeWindow.daily}
                    onClick={() => setVolumeWindow(VolumeWindow.daily)}
                  >
                    D
                  </SmallOptionButton>
                  <SmallOptionButton
                    active={volumeWindow === VolumeWindow.weekly}
                    style={{ marginLeft: '8px' }}
                    onClick={() => setVolumeWindow(VolumeWindow.weekly)}
                  >
                    W
                  </SmallOptionButton>
                  <SmallOptionButton
                    active={volumeWindow === VolumeWindow.monthly}
                    style={{ marginLeft: '8px' }}
                    onClick={() => setVolumeWindow(VolumeWindow.monthly)}
                  >
                    M
                  </SmallOptionButton>
                </RowFixed>
              }
              topLeft={
                <AutoColumn gap="4px">
                  <Text fontSize="16px">Volume 24H</Text>
                  <Text fontSize="32px">
                    <MonoSpace> {formatDollarAmount(volumeHover, 2)}</MonoSpace>
                  </Text>
                  <Text fontSize="12px" height="14px">
                    {rightLabel ? <MonoSpace>{rightLabel} (UTC)</MonoSpace> : null}
                  </Text>
                </AutoColumn>
              }
            />
          </ChartWrapper> */}
        </ResponsiveRow>
      </AutoColumn>
    </PageWrapper>
  )
}
