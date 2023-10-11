import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, Button, Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import dayjs from 'dayjs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import BarChart from './components/BarChart/alt'
import { DarkGreyCard } from './components/Card'
import LineChart from './components/LineChart/alt'
import Percent from './components/Percent'
import PoolTable from './components/PoolTable'
import { RowBetween, RowFixed } from './components/Row'
import TokenTable from './components/TokenTable'
import TransactionsTable from './components/TransactionsTable'
import { ChartCardsContainer, MonoSpace, ProtocolWrapper } from './components/shared'
import {
  useProtocolChartData,
  useProtocolData,
  useProtocolTransactionData,
  useTopPoolsData,
  useTopTokensData,
} from './hooks'
import { useTransformedVolumeData } from './hooks/chart'
import { VolumeWindow } from './types'
import { getPercentChange } from './utils/data'
import { unixToDate } from './utils/date'
import { formatDollarAmount } from './utils/numbers'

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
  const now = dayjs()

  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [chainId])

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
  const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.daily)

  const formattedTokens = useMemo(() => {
    if (topTokensData)
      return Object.values(topTokensData)
        .map((d) => d)
        .filter((d) => !isUndefinedOrNull(d))
        .filter((d) => d.tvlUSD > 0)
    return []
  }, [topTokensData])

  const poolDatas = useMemo(() => {
    if (topPoolsData)
      return Object.values(topPoolsData)
        .map((p) => p)
        .filter((p) => !isUndefinedOrNull(p))
    return []
  }, [topPoolsData])

  const tvlValue = useMemo(() => {
    return formatDollarAmount(liquidityHover, 2, true)
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
                <Text fontSize="16px">{t('TVL')}</Text>
                <Text fontSize="32px">
                  <MonoSpace>{tvlValue}</MonoSpace>
                </Text>
                <Text fontSize="12px" height="14px">
                  <MonoSpace>{leftLabel ?? now.format('MMM D, YYYY')} (UTC)</MonoSpace>
                </Text>
              </AutoColumn>
            }
          />
        </Card>
        <Card>
          <BarChart
            height={200}
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
                <Button
                  scale="sm"
                  variant={volumeWindow === VolumeWindow.daily ? 'primary' : 'bubblegum'}
                  onClick={() => setVolumeWindow(VolumeWindow.daily)}
                >
                  D
                </Button>
                <Button
                  scale="sm"
                  variant={volumeWindow === VolumeWindow.weekly ? 'primary' : 'bubblegum'}
                  style={{ marginLeft: '8px' }}
                  onClick={() => setVolumeWindow(VolumeWindow.weekly)}
                >
                  W
                </Button>
                <Button
                  variant={volumeWindow === VolumeWindow.monthly ? 'primary' : 'bubblegum'}
                  scale="sm"
                  style={{ marginLeft: '8px' }}
                  onClick={() => setVolumeWindow(VolumeWindow.monthly)}
                >
                  M
                </Button>
              </RowFixed>
            }
            topLeft={
              <AutoColumn gap="4px">
                <Text fontSize="16px">{t('Volume')}</Text>
                <Text fontSize="32px">
                  <MonoSpace>
                    {volumeHover
                      ? formatDollarAmount(volumeHover)
                      : formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value, 2)}
                  </MonoSpace>
                </Text>
                <Text fontSize="12px" height="14px">
                  <MonoSpace>{rightLabel ?? now.format('MMM D, YYYY')} (UTC)</MonoSpace>
                </Text>
              </AutoColumn>
            }
          />
        </Card>
      </ChartCardsContainer>
      <ProtocolWrapper>
        <DarkGreyCard>
          <RowBetween>
            <RowFixed>
              <RowFixed mr="20px">
                <Text mr="4px">{t('Volume 24H')}: </Text>
                <Text mr="4px">{formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)}</Text>
                <Percent
                  value={getPercentChange(
                    formattedVolumeData[formattedVolumeData.length - 1]?.value.toString(),
                    formattedVolumeData[formattedVolumeData.length - 2]?.value.toString(),
                  )}
                  wrap
                />
              </RowFixed>
              <RowFixed mr="20px">
                <Text mr="4px">{t('Fees 24H')}: </Text>
                <Text mr="4px">{formatDollarAmount(protocolData?.feesUSD)}</Text>
                <Percent value={protocolData?.feeChange} wrap />
              </RowFixed>
              <Box>
                <RowFixed mr="20px">
                  <Text mr="4px">{t('TVL')}: </Text>
                  <Text mr="4px">{formatDollarAmount(protocolData?.tvlUSD)}</Text>
                  <Percent value={protocolData?.tvlUSDChange} wrap />
                </RowFixed>
              </Box>
            </RowFixed>
          </RowBetween>
        </DarkGreyCard>
      </ProtocolWrapper>
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

      {transactionData ? <TransactionsTable transactions={transactionData} /> : null}
    </Page>
  )
}
