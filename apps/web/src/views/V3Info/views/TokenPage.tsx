import { AutoColumn, Button, Text, LinkExternal, Box } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import dayjs from 'dayjs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

// import { useSavedTokens } from 'state/user/hooks'
import styled from 'styled-components'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import BarChart from '../components/BarChart/alt'
import { DarkGreyCard, LightGreyCard } from '../components/Card'
import Loader, { LocalLoader } from '../components/Loader'
import Percent from '../components/Percent'
import PoolTable from '../components/PoolTable'
import { AutoRow, RowBetween, RowFixed, RowFlat } from '../components/Row'
import { MonoSpace } from '../components/shared'
import TransactionTable from '../components/TransactionsTable'
import { currentTimestamp, getEtherscanLink, shortenAddress } from '../utils'
import { unixToDate } from '../utils/date'
import { formatDollarAmount } from '../utils/numbers'
import { ONE_HOUR_SECONDS, TimeWindow, v3InfoPath } from '../constants'
import {
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
  usePoolsData,
} from '../hooks'

const CandleChart = dynamic(() => import('../components/CandleChart'), {
  ssr: false,
})

const LineChart = dynamic(() => import('../components/LineChart/alt'), {
  ssr: false,
})

// import { SmallOptionButton } from '../../components/Button'
// import { useCMCLink } from 'hooks/useCMCLink'

const PriceText = styled(Text)`
  font-size: 36px;
  line-height: 0.8;
`

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 24px;
    width: 100%;
  }
`

enum ChartView {
  TVL,
  VOL,
  PRICE,
}

const DEFAULT_TIME_WINDOW = TimeWindow.WEEK

const TokenPage: React.FC<{ address: string }> = ({ address }) => {
  const { chainId } = useActiveChainId()

  // eslint-disable-next-line no-param-reassign
  address = address.toLowerCase()

  const { theme, isDark } = useTheme()
  const backgroundColor = theme.colors.background

  // scroll on page view
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolsData(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.totalValueLockedUSD,
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

  // chart labels
  const [view, setView] = useState(ChartView.TVL)
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()
  const [timeWindow] = useState(DEFAULT_TIME_WINDOW)

  // pricing data
  const priceData = useTokenPriceData(address, ONE_HOUR_SECONDS, timeWindow)
  const adjustedToCurrent = useMemo(() => {
    if (priceData && tokenData && priceData.length > 0) {
      const adjusted = Object.assign([], priceData)
      adjusted.push({
        time: currentTimestamp() / 1000,
        open: priceData[priceData.length - 1].close,
        close: tokenData?.priceUSD,
        high: tokenData?.priceUSD,
        low: priceData[priceData.length - 1].close,
      })
      return adjusted
    }
    return undefined
  }, [priceData, tokenData])

  // watchlist
  // const [savedTokens, addSavedToken] = useSavedTokens()

  return (
    <Page>
      {tokenData ? (
        !tokenData.exists ? (
          <LightGreyCard style={{ textAlign: 'center' }}>
            No pool has been created with this token yet. Create one
            <LinkExternal style={{ marginLeft: '4px' }} href={`https://app.uniswap.org/#/add/${address}`}>
              here.
            </LinkExternal>
          </LightGreyCard>
        ) : (
          <AutoColumn gap="32px">
            <AutoColumn gap="32px">
              <RowBetween>
                <AutoRow gap="4px">
                  <NextLink href={`/${v3InfoPath}`}>
                    <Text>{`Home > `}</Text>
                  </NextLink>
                  <NextLink href={`/${v3InfoPath}tokens`}>
                    <Text>{` Tokens `}</Text>
                  </NextLink>
                  <Text>{` > `}</Text>
                  <Text>{` ${tokenData.symbol} `}</Text>
                  <LinkExternal href={getEtherscanLink(chainId, address, 'address')}>
                    <Text>{` (${shortenAddress(address)}) `}</Text>
                  </LinkExternal>
                </AutoRow>
                <RowFixed align="center" justify="center">
                  {/* <StarLineIcon fill={savedTokens.includes(address)} onClick={() => addSavedToken(address)} /> */}
                  {/* {cmcLink && (
                    <StyledExternalLink href={cmcLink} style={{ marginLeft: '12px' }} onClickCapture={() => {}}>
                      <StyledCMCLogo src={CMCLogo} alt="" />
                    </StyledExternalLink>
                  )} */}
                  {/* <LinkExternal href={getEtherscanLink(chainId, address, 'address')}>
                    <LinkExternal stroke={theme.colors.textSubtle} size="17px" style={{ marginLeft: '12px' }} />
                  </LinkExternal> */}
                </RowFixed>
              </RowBetween>
              <ResponsiveRow align="flex-end">
                <AutoColumn gap="md">
                  <RowFixed gap="lg">
                    <CurrencyLogo address={address} />
                    <Text ml="10px" fontSize="20px">
                      {tokenData.name}
                    </Text>
                    <Text ml="6px" fontSize="20px">
                      ({tokenData.symbol})
                    </Text>
                    {/* {activeNetwork === EthereumNetworkInfo ? null : (
                      <GenericImageWrapper src={activeNetwork.imageURL} style={{ marginLeft: '8px' }} size={'26px'} />
                    )} */}
                  </RowFixed>
                  <RowFlat style={{ marginTop: '8px' }}>
                    <PriceText mr="10px"> {formatDollarAmount(tokenData.priceUSD)}</PriceText>
                    (<Percent value={tokenData.priceUSDChange} />)
                  </RowFlat>
                </AutoColumn>
                {
                  <RowFixed>
                    <LinkExternal href={`https://app.uniswap.org/#/add/${address}`}>
                      <Button width="170px" mr="12px" height="100%" style={{ height: '44px' }}>
                        <RowBetween>
                          {/* <Download size={24} /> */}
                          <div style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</div>
                        </RowBetween>
                      </Button>
                    </LinkExternal>
                    <LinkExternal href={`https://app.uniswap.org/#/swap?inputCurrency=${address}`}>
                      <Button variant="primary" width="100px" style={{ height: '44px' }}>
                        Trade
                      </Button>
                    </LinkExternal>
                  </RowFixed>
                }
              </ResponsiveRow>
            </AutoColumn>
            <ContentLayout>
              <DarkGreyCard>
                <AutoColumn gap="lg">
                  <AutoColumn gap="4px">
                    <Text fontWeight={400}>TVL</Text>
                    <Text fontSize="24px">{formatDollarAmount(tokenData.tvlUSD)}</Text>
                    <Percent value={tokenData.tvlUSDChange} />
                  </AutoColumn>
                  <AutoColumn gap="4px">
                    <Text fontWeight={400}>24h Trading Vol</Text>
                    <Text fontSize="24px">{formatDollarAmount(tokenData.volumeUSD)}</Text>
                    <Percent value={tokenData.volumeUSDChange} />
                  </AutoColumn>
                  <AutoColumn gap="4px">
                    <Text fontWeight={400}>7d Trading Vol</Text>
                    <Text fontSize="24px">{formatDollarAmount(tokenData.volumeUSDWeek)}</Text>
                  </AutoColumn>
                  <AutoColumn gap="4px">
                    <Text fontWeight={400}>24h Fees</Text>
                    <Text fontSize="24px">{formatDollarAmount(tokenData.feesUSD)}</Text>
                  </AutoColumn>
                </AutoColumn>
              </DarkGreyCard>
              <DarkGreyCard>
                <RowBetween align="flex-start">
                  <AutoColumn>
                    <RowFixed>
                      <Text fontSize="24px" height="30px">
                        <MonoSpace>
                          {latestValue
                            ? formatDollarAmount(latestValue, 2)
                            : view === ChartView.VOL
                            ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                            : view === ChartView.TVL
                            ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
                            : formatDollarAmount(tokenData.priceUSD, 2)}
                        </MonoSpace>
                      </Text>
                    </RowFixed>
                    <Text height="20px" fontSize="12px">
                      {valueLabel ? (
                        <MonoSpace>{valueLabel} (UTC)</MonoSpace>
                      ) : (
                        <MonoSpace>{dayjs.utc().format('MMM D, YYYY')}</MonoSpace>
                      )}
                    </Text>
                  </AutoColumn>
                  <Box>
                    <Button
                      // isActive={view === ChartView.VOL}
                      onClick={() => {
                        setView(ChartView.VOL)
                      }}
                    >
                      Volume
                    </Button>
                    <Button
                      // isActive={view === ChartView.TVL}
                      onClick={() => setView(ChartView.TVL)}
                    >
                      TVL
                    </Button>
                    <Button
                      // isActive={view === ChartView.PRICE}
                      onClick={() => setView(ChartView.PRICE)}
                    >
                      Price
                    </Button>
                  </Box>
                </RowBetween>
                {view === ChartView.TVL ? (
                  <LineChart
                    data={formattedTvlData}
                    color={isDark ? '#9A6AFF' : '#7A6EAA'}
                    minHeight={340}
                    value={latestValue}
                    label={valueLabel}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                  />
                ) : view === ChartView.VOL ? (
                  <BarChart
                    data={formattedVolumeData}
                    color="#1FC7D4"
                    minHeight={340}
                    value={latestValue}
                    label={valueLabel}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                  />
                ) : view === ChartView.PRICE ? (
                  adjustedToCurrent ? (
                    <Box height={300}>
                      <CandleChart
                        data={adjustedToCurrent}
                        setValue={setLatestValue}
                        setLabel={setValueLabel}
                        color={backgroundColor}
                      />
                    </Box>
                  ) : (
                    <LocalLoader fill={false} />
                  )
                ) : null}
                {/* <RowBetween width="100%">
                  <div> </div>
                  <AutoRow gap="4px" width="fit-content">
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.DAY}
                      onClick={() => setTimeWindow(TimeWindow.DAY)}
                    >
                      24H
                    </SmallOptionButton>
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.WEEK}
                      onClick={() => setTimeWindow(TimeWindow.WEEK)}
                    >
                      1W
                    </SmallOptionButton>
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.MONTH}
                      onClick={() => setTimeWindow(TimeWindow.MONTH)}
                    >
                      1M
                    </SmallOptionButton>
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.DAY}
                      onClick={() => setTimeWindow(TimeWindow.DAY)}
                    >
                      All
                    </SmallOptionButton>
                  </AutoRow>
                </RowBetween> */}
              </DarkGreyCard>
            </ContentLayout>
            <Text>Pools</Text>
            <DarkGreyCard>
              <PoolTable poolDatas={poolDatas ?? []} />
            </DarkGreyCard>
            <Text>Transactions</Text>
            <DarkGreyCard>
              {transactions ? (
                <TransactionTable transactions={transactions} color={backgroundColor} />
              ) : (
                <LocalLoader fill={false} />
              )}
            </DarkGreyCard>
          </AutoColumn>
        )
      ) : (
        <Loader />
      )}
    </Page>
  )
}

export default TokenPage
