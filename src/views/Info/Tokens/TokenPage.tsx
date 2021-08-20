/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import { format, fromUnixTime, Duration } from 'date-fns'
import styled from 'styled-components'
import {
  Text,
  Box,
  Heading,
  Button,
  Card,
  Flex,
  Breadcrumbs,
  Link as UIKitLink,
  LinkExternal,
  Spinner,
  Image,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { shortenAddress, getBscscanLink, currentTimestamp } from 'utils/infoUtils'
import useTheme from 'hooks/useTheme'
import useCMCLink from 'hooks/useCMCLink'
import { CurrencyLogo } from 'components/CurrencyLogo'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'components/Percent'
import SaveIcon from 'components/SaveIcon'
import {
  usePoolDatas,
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
} from 'state/info/hooks'
import PoolTable from 'components/InfoTables/PoolsTable'
import LineChart from 'components/LineChart'
import BarChart from 'components/BarChart'
import CandleChart from 'components/CandleChart'
import TransactionTable from 'components/InfoTables/TransactionsTable'
import { useWatchlistTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { TabToggleGroup, TabToggle } from 'components/TabToggle'
import { useTranslation } from 'contexts/Localization'

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

const StyledCMCLink = styled(UIKitLink)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  & :hover {
    opacity: 0.8;
  }
`

enum ChartView {
  TVL,
  VOL,
  PRICE,
}

const DEFAULT_TIME_WINDOW: Duration = { weeks: 1 }

const TokenPage: React.FC<RouteComponentProps<{ address: string }>> = ({
  match: {
    params: { address: routeAddress },
  },
}) => {
  const { theme } = useTheme()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const cmcLink = useCMCLink(address)

  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolDatas(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  // format for chart component
  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
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
          time: fromUnixTime(day.date),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [chartData])

  // chart labels
  const [view, setView] = useState(ChartView.VOL)
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

  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()

  const currentDate = format(new Date(), 'MMM d, yyyy')

  return (
    <Page symbol={tokenData?.symbol}>
      {tokenData ? (
        !tokenData.exists ? (
          <Card>
            <Box p="16px">
              <Text>
                {t('No pool has been created with this token yet. Create one')}
                <LinkExternal
                  style={{ display: 'inline', marginLeft: '6px' }}
                  href={`https://exchange.pancakeswap.finance/#/add/${address}`}
                >
                  {t('here.')}
                </LinkExternal>
              </Text>
            </Box>
          </Card>
        ) : (
          <>
            {/* Stuff on top */}
            <Flex justifyContent="space-between" mb="24px" flexDirection={['column', 'column', 'row']}>
              <Breadcrumbs mb="32px">
                <Link to="/">
                  <Text color="primary">{t('Home')}</Text>
                </Link>
                <Link to="/tokens">
                  <Text color="primary">{t('Tokens')}</Text>
                </Link>
                <Flex>
                  <Text mr="8px">{tokenData.symbol}</Text>
                  <Text>{`(${shortenAddress(address)})`}</Text>
                </Flex>
              </Breadcrumbs>
              <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
                <LinkExternal mr="8px" color="primary" href={getBscscanLink(address, 'address')}>
                  {t('View on BscScan')}
                </LinkExternal>
                {cmcLink && (
                  <StyledCMCLink href={cmcLink} rel="noopener noreferrer nofollow" target="_blank">
                    <Image src="/images/CMC-logo.svg" height={22} width={22} alt={t('View token on CoinMarketCap')} />
                  </StyledCMCLink>
                )}
                <SaveIcon fill={watchlistTokens.includes(address)} onClick={() => addWatchlistToken(address)} />
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection="column" mb={['8px', null]}>
                <Flex alignItems="center">
                  <CurrencyLogo size="32px" address={address} />
                  <Text ml="12px" bold lineHeight="0.7" fontSize={isXs || isSm ? '24px' : '40px'}>
                    {tokenData.name}
                  </Text>
                  <Text ml="12px" lineHeight="1" color="textSubtle" fontSize={isXs || isSm ? '14px' : '20px'}>
                    ({tokenData.symbol})
                  </Text>
                </Flex>
                <Flex mt="8px" ml="46px" alignItems="center">
                  <Text mr="16px" bold fontSize="24px">
                    ${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
                  </Text>
                  <Percent value={tokenData.priceUSDChange} fontWeight={600} />
                </Flex>
              </Flex>
              <Flex>
                <a href={`https://exchange.pancakeswap.finance/#/add/${address}`}>
                  <Button mr="8px" variant="secondary">
                    {t('Add Liquidity')}
                  </Button>
                </a>
                <a href={`https://exchange.pancakeswap.finance/#/swap?inputCurrency=${address}`}>
                  <Button>{t('Trade')}</Button>
                </a>
              </Flex>
            </Flex>

            {/* data on the right side of chart */}
            <ContentLayout>
              <Card>
                <Box p="24px">
                  <Text bold small color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Liquidity')}
                  </Text>
                  <Text bold fontSize="24px">
                    ${formatAmount(tokenData.tvlUSD)}
                  </Text>
                  <Percent value={tokenData.tvlUSDChange} />

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Volume 24H')}
                  </Text>
                  {/* TODO PCS Capitalize MiBillions */}
                  <Text bold fontSize="24px" textTransform="uppercase">
                    ${formatAmount(tokenData.volumeUSD)}
                  </Text>
                  <Percent value={tokenData.volumeUSDChange} />

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Volume 7D')}
                  </Text>
                  <Text bold fontSize="24px">
                    ${formatAmount(tokenData.volumeUSDWeek)}
                  </Text>

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Transactions 24H')}
                  </Text>
                  <Text bold fontSize="24px">
                    {formatAmount(tokenData.txCount, { isInteger: true })}
                  </Text>
                </Box>
              </Card>
              {/* charts card */}
              <Card>
                <TabToggleGroup>
                  <TabToggle isActive={view === ChartView.VOL} onClick={() => setView(ChartView.VOL)}>
                    <Text>{t('Volume')}</Text>
                  </TabToggle>
                  <TabToggle isActive={view === ChartView.TVL} onClick={() => setView(ChartView.TVL)}>
                    <Text>{t('Liquidity')}</Text>
                  </TabToggle>
                  <TabToggle isActive={view === ChartView.PRICE} onClick={() => setView(ChartView.PRICE)}>
                    <Text>{t('Price')}</Text>
                  </TabToggle>
                </TabToggleGroup>

                <Flex flexDirection="column" px="24px" pt="24px">
                  <Text fontSize="24px" bold>
                    $
                    {latestValue
                      ? formatAmount(latestValue)
                      : view === ChartView.VOL
                      ? formatAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                      : view === ChartView.TVL
                      ? formatAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
                      : formatAmount(tokenData.priceUSD)}
                  </Text>
                  <Text small color="secondary">
                    {valueLabel || currentDate}
                  </Text>
                </Flex>

                <Box px="24px">
                  {view === ChartView.TVL ? (
                    <LineChart
                      data={formattedTvlData}
                      color={theme.colors.primary}
                      height="270px"
                      value={latestValue}
                      label={valueLabel}
                      setValue={setLatestValue}
                      setLabel={setValueLabel}
                    />
                  ) : view === ChartView.VOL ? (
                    <BarChart
                      data={formattedVolumeData}
                      color={theme.colors.primary}
                      height="270px"
                      value={latestValue}
                      label={valueLabel}
                      setValue={setLatestValue}
                      setLabel={setValueLabel}
                    />
                  ) : view === ChartView.PRICE ? (
                    adjustedToCurrent ? (
                      <Box mb="16px">
                        <CandleChart
                          height={270}
                          data={adjustedToCurrent}
                          setValue={setLatestValue}
                          setLabel={setValueLabel}
                          color={theme.colors.primary}
                        />
                      </Box>
                    ) : (
                      <Flex justifyContent="center" alignItems="center">
                        <Spinner />
                      </Flex>
                    )
                  ) : null}
                </Box>
              </Card>
            </ContentLayout>

            {/* pools and transaction tables */}
            <Heading scale="lg" mb="16px" mt="40px">
              {t('Pools')}
            </Heading>

            <PoolTable poolDatas={poolDatas} />

            <Heading scale="lg" mb="16px" mt="40px">
              {t('Transactions')}
            </Heading>

            <TransactionTable transactions={transactions} />
          </>
        )
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default TokenPage
