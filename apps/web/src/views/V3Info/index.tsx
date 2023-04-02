import { ethereumTokens } from '@pancakeswap/tokens'
import Page from 'components/Layout/Page'
import { AutoColumn, Box, Button, Card, PairDataTimeWindowEnum, Text, Heading } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
// import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
// import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
// import styled from 'styled-components'
import BarChart from './components/BarChart/alt'
import { DarkGreyCard } from './components/Card'
import LineChart from './components/LineChart/alt'
import Percent from './components/Percent'
import { RowBetween, RowFixed } from './components/Row'
import { MonoSpace, ChartCardsContainer } from './components/shared'
import TokenTable from './components/TokenTable'
import PoolTable from './components/PoolTable'
import TransactionsTable from './components/TransactionsTable'
import {
  useProtocolChartData,
  useProtocolData,
  useProtocolTransactionData,
  useTopTokensData,
  useTopPoolsData,
} from './hooks'
import { useTransformedVolumeData } from './hooks/chart'
import { VolumeWindow } from './types'
import { notEmpty } from './utils'
import { unixToDate } from './utils/date'
import { formatDollarAmount } from './utils/numbers'

// const SwapLineChart = dynamic(() => import('@pancakeswap/uikit/src/components/Chart/PairPriceChart'), {
//   ssr: false,
// })

// const ChartWrapper = styled.div`
//   width: 49%;
// `

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { theme } = useTheme()

  const protocolData = useProtocolData()
  const transactionData = useProtocolTransactionData()
  const topTokensData = useTopTokensData()
  const topPoolsData = useTopPoolsData()
  const chartData = useProtocolChartData()
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  const [leftLabel, setLeftLabel] = useState<string | undefined>()
  const [rightLabel, setRightLabel] = useState<string | undefined>()

  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [chainId])

  // const [, setHoverValue] = useState<number | undefined>()
  // const [, setHoverDate] = useState<string | undefined>()
  // const pairTokensPrice = usePairTokensPrice(
  //   Pool.getAddress(ethereumTokens.weth, ethereumTokens.usdc, FeeAmount.LOW),
  //   PairDataTimeWindowEnum.YEAR,
  //   1,
  // )

  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (volumeHover === undefined && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])
  useEffect(() => {
    if (liquidityHover === undefined && protocolData) {
      setLiquidityHover(protocolData.tvlUSD)
    }
  }, [liquidityHover, protocolData])

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

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [chartData])

  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.weekly)

  const formattedTokens = useMemo(() => {
    if (topTokensData)
      return Object.values(topTokensData)
        .map((d) => d)
        .filter(notEmpty)
    return []
  }, [topTokensData])

  const poolDatas = useMemo(() => {
    if (topPoolsData)
      return Object.values(topPoolsData)
        .map((p) => p)
        .filter(notEmpty)
    return []
  }, [topPoolsData])

  const tvlValue = useMemo(() => {
    return formatDollarAmount(liquidityHover ?? 0, 2, true)
  }, [liquidityHover])
  return (
    <Page>
      <Heading scale="lg" mb="16px">
        {t('PancakeSwap Info & Analytics')}
      </Heading>
      <ChartCardsContainer>
        <Card>
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
        </Card>
        <Card>
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
            color={theme.colors.primary}
            setValue={setVolumeHover}
            setLabel={setRightLabel}
            value={volumeHover}
            label={rightLabel}
            activeWindow={volumeWindow}
            topRight={
              <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
                <Button scale="sm" onClick={() => setVolumeWindow(VolumeWindow.daily)}>
                  D
                </Button>
                <Button scale="sm" style={{ marginLeft: '8px' }} onClick={() => setVolumeWindow(VolumeWindow.weekly)}>
                  W
                </Button>
                <Button scale="sm" style={{ marginLeft: '8px' }} onClick={() => setVolumeWindow(VolumeWindow.monthly)}>
                  M
                </Button>
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
        </Card>
      </ChartCardsContainer>
      <Box>
        <DarkGreyCard>
          <RowBetween>
            <RowFixed>
              <RowFixed mr="20px">
                <Text mr="4px">Volume 24H: </Text>
                <Text mr="4px">{formatDollarAmount(protocolData?.volumeUSD)}</Text>
                <Percent value={protocolData?.volumeUSDChange} wrap />
              </RowFixed>
              <RowFixed mr="20px">
                <Text mr="4px">Fees 24H: </Text>
                <Text mr="4px">{formatDollarAmount(protocolData?.feesUSD)}</Text>
                <Percent value={protocolData?.feeChange} wrap />
              </RowFixed>
              <Box>
                <RowFixed mr="20px">
                  <Text mr="4px">TVL: </Text>
                  <Text mr="4px">{formatDollarAmount(protocolData?.tvlUSD)}</Text>
                  <Percent value={protocolData?.tvlUSDChange} wrap />
                </RowFixed>
              </Box>
            </RowFixed>
          </RowBetween>
        </DarkGreyCard>
      </Box>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Top Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />

      <Heading scale="lg" mt="40px" mb="16px">
        {t('Top Pairs')}
      </Heading>
      <PoolTable poolDatas={poolDatas} />
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Transactions')}
      </Heading>

      {transactionData ? <TransactionsTable transactions={transactionData} color={theme.colors.primary} /> : null}

      {/* <ChartWrapper>
        <SwapLineChart
          data={pairTokensPrice}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={false}
          isChartExpanded={false}
          timeWindow={PairDataTimeWindowEnum.MONTH}
          // priceLineData={[
          //   { title: 'max', price: 100, color: '#31D0AA' },
          //   { title: 'min', price: 80, color: '#ED4B9E' },
          //   { title: 'mid', price: 90, color: '#BDC2C4' },
          // ]}
        />
      </ChartWrapper> */}
    </Page>
  )
}
