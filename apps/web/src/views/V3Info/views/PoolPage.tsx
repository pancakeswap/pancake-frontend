import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CopyButton,
  Flex,
  Heading,
  ScanLink,
  Spinner,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import dayjs from 'dayjs'

import Page from 'components/Layout/Page'
import { TabToggle, TabToggleGroup } from 'components/TabToggle'
import { CHAIN_QUERY_NAME } from 'config/chains'
// import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import { ChainLinkSupportChains, multiChainId, multiChainScan } from 'state/info/constant'
import { useChainIdByQuery, useChainNameByQuery, useMultiChainPath, useStableSwapPath } from 'state/info/hooks'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'

import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import BarChart from '../components/BarChart/alt'
import { GreyBadge } from '../components/Card'
import DensityChart from '../components/DensityChart'
import LineChart from '../components/LineChart/alt'
import { LocalLoader } from '../components/Loader'
import Percent from '../components/Percent'
import { RowBetween, RowFixed } from '../components/Row'
import TransactionTable from '../components/TransactionsTable'
import { v3InfoPath } from '../constants'
import { usePoolChartData, usePoolData, usePoolTransactions } from '../hooks'
import { feeTierPercent } from '../utils'
import { unixToDate } from '../utils/date'
import { formatDollarAmount } from '../utils/numbers'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

enum ChartView {
  VOL,
  PRICE,
  DENSITY,
  FEES,
  TVL,
}

const PoolPage: React.FC<{ address: string }> = ({ address }) => {
  // const { chainId } = useActiveChainId()
  const { isXs, isSm } = useMatchBreakpoints()

  const now = dayjs()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // theming

  const { theme } = useTheme()
  const backgroundColor = theme.colors.primary

  // token data
  const poolData = usePoolData(address)
  const chartData = usePoolChartData(address)
  const transactions = usePoolTransactions(address)

  const [view, setView] = useState(ChartView.VOL)
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()

  const hasSmallDifference = useMemo(() => {
    return poolData ? Math.abs(poolData.token1Price - poolData.token0Price) < 1 : false
  }, [poolData])

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

  const formattedFeesUSD = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.feesUSD,
        }
      })
    }
    return []
  }, [chartData])

  const chainName = useChainNameByQuery()
  const chainId = useChainIdByQuery()
  const chainPath = useMultiChainPath()
  const infoTypeParam = useStableSwapPath()
  const { t } = useTranslation()

  const [poolSymbol, symbol0, symbol1] = useMemo(() => {
    const s0 = getTokenSymbolAlias(poolData?.token0.address, chainId, poolData?.token0.symbol)
    const s1 = getTokenSymbolAlias(poolData?.token1.address, chainId, poolData?.token1.symbol)
    return [`${s0} / ${s1}`, s0, s1]
  }, [chainId, poolData?.token0.address, poolData?.token0.symbol, poolData?.token1.address, poolData?.token1.symbol])

  return (
    <Page>
      {poolData ? (
        <AutoColumn gap="32px">
          <Flex justifyContent="space-between" mb="16px" flexDirection={['column', 'column', 'row']}>
            <Breadcrumbs mb="32px">
              <NextLinkFromReactRouter to={`/${v3InfoPath}${chainPath}${infoTypeParam}`}>
                <Text color="primary">{t('Info')}</Text>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/${v3InfoPath}${chainPath}/pairs${infoTypeParam}`}>
                <Text color="primary">{t('Pairs')}</Text>
              </NextLinkFromReactRouter>
              <Flex>
                <Text mr="8px">
                  {poolSymbol}
                  <GreyBadge ml="4px" style={{ display: 'inline-block' }}>
                    {feeTierPercent(poolData.feeTier)}
                  </GreyBadge>
                </Text>
              </Flex>
            </Breadcrumbs>

            <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
              <ScanLink
                useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
                href={getBlockExploreLink(address, 'address', multiChainId[chainName])}
                mr="8px"
              >
                {t('View on %site%', { site: multiChainScan[chainName] })}
              </ScanLink>
              <CopyButton text={address} tooltipMessage={t('Token address copied')} />
              {/* <SaveIcon fill={watchlistPools.includes(address)} onClick={() => addPoolToWatchlist(address)} /> */}
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={['8px', null]}>
              <DoubleCurrencyLogo
                address0={poolData.token0.address}
                address1={poolData.token1.address}
                size={32}
                chainName={chainName}
              />
              <Text ml="38px" bold fontSize={isXs || isSm ? '24px' : '40px'} id="info-pool-pair-title">
                {`${symbol0} / ${symbol1}`}{' '}
                <GreyBadge ml="4px" style={{ display: 'inline-block' }}>
                  {feeTierPercent(poolData.feeTier)}
                </GreyBadge>
              </Text>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection={['column', 'column', 'row']} mb={['8px', '8px', null]}>
                <NextLinkFromReactRouter
                  to={`/${v3InfoPath}${chainPath}/tokens/${poolData.token0.address}${infoTypeParam}`}
                >
                  <TokenButton>
                    <CurrencyLogo address={poolData.token0.address} size="24px" chainName={chainName} />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${symbol0} =  ${formatAmount(poolData.token1Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
                      })} ${symbol1}`}
                    </Text>
                  </TokenButton>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter
                  to={`/${v3InfoPath}${chainPath}/tokens/${poolData.token1.address}${infoTypeParam}`}
                >
                  <TokenButton ml={[null, null, '10px']}>
                    <CurrencyLogo address={poolData.token1.address} size="24px" chainName={chainName} />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${symbol1} =  ${formatAmount(poolData.token0Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
                      })} ${symbol0}`}
                    </Text>
                  </TokenButton>
                </NextLinkFromReactRouter>
              </Flex>
              <Flex>
                <NextLinkFromReactRouter
                  to={`/add/${poolData.token0.address}/${poolData.token1.address}?chain=${
                    CHAIN_QUERY_NAME[multiChainId[chainName]]
                  }`}
                >
                  <Button mr="8px" variant="secondary">
                    {t('Add Liquidity')}
                  </Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter
                  to={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}&chain=${
                    CHAIN_QUERY_NAME[multiChainId[chainName]]
                  }`}
                >
                  <Button>{t('Trade')}</Button>
                </NextLinkFromReactRouter>
              </Flex>
            </Flex>
          </Flex>
          <ContentLayout>
            <Card>
              <Box p="24px">
                <Card mb="24px">
                  <AutoColumn padding="16px" gap="md">
                    <Text>{t('Total Tokens Locked')}</Text>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo address={poolData.token0.address} size="20px" chainName={chainName} />
                        <Text fontSize="14px" ml="8px">
                          {symbol0}
                        </Text>
                      </RowFixed>
                      <Text fontSize="14px">
                        {formatAmount(poolData.tvlToken0, {
                          displayThreshold: 0.001,
                        })}
                      </Text>
                    </RowBetween>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo address={poolData.token1.address} size="20px" chainName={chainName} />
                        <Text fontSize="14px" ml="8px">
                          {symbol1}
                        </Text>
                      </RowFixed>
                      <Text fontSize="14px">
                        {formatAmount(poolData.tvlToken1, {
                          displayThreshold: 0.001,
                        })}
                      </Text>
                    </RowBetween>
                  </AutoColumn>
                </Card>
                <Box mb="20px">
                  <Text lineHeight={1.3} fontWeight={400}>
                    {t('TVL')}
                  </Text>
                  <Text lineHeight={1} fontSize="24px">
                    {formatDollarAmount(poolData.tvlUSD)}
                  </Text>
                  <Percent value={poolData.tvlUSDChange} />
                </Box>
                <Box mb="20px">
                  <Text lineHeight={1.3} fontWeight={400}>
                    {t('Volume 24H')}
                  </Text>
                  <Text lineHeight={1} fontSize="24px">
                    {formatDollarAmount(poolData.volumeUSD)}
                  </Text>
                  <Percent value={poolData.volumeUSDChange} />
                </Box>
                <Box mb="20px">
                  <Text lineHeight={1.3} fontWeight={400}>
                    {t('Fees 24H')}
                  </Text>
                  <Text lineHeight={1} fontSize="24px">
                    {formatDollarAmount(poolData.feeUSD)}
                  </Text>
                </Box>
              </Box>
            </Card>
            <Card>
              <TabToggleGroup>
                <TabToggle isActive={view === ChartView.VOL} onClick={() => setView(ChartView.VOL)}>
                  <Text>{t('Volume')}</Text>
                </TabToggle>
                <TabToggle isActive={view === ChartView.DENSITY} onClick={() => setView(ChartView.DENSITY)}>
                  <Text>{t('Liquidity')}</Text>
                </TabToggle>
                <TabToggle isActive={view === ChartView.FEES} onClick={() => setView(ChartView.FEES)}>
                  <Text>{t('Fees')}</Text>
                </TabToggle>
                <TabToggle isActive={view === ChartView.TVL} onClick={() => setView(ChartView.TVL)}>
                  <Text>{t('TVL')}</Text>
                </TabToggle>
              </TabToggleGroup>
              <Flex flexDirection="column" px="24px" pt="24px">
                {latestValue
                  ? formatDollarAmount(latestValue)
                  : view === ChartView.VOL
                  ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                  : view === ChartView.DENSITY
                  ? ''
                  : view === ChartView.TVL
                  ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
                  : formatDollarAmount(formattedFeesUSD[formattedFeesUSD.length - 1]?.value)}
                <Text small color="secondary">
                  {view !== ChartView.DENSITY && `${valueLabel ?? now.format('MMM D, YYYY')} (UTC)`}
                </Text>
              </Flex>
              <Box height="380px">
                {view === ChartView.VOL ? (
                  <BarChart
                    data={formattedVolumeData}
                    color={backgroundColor}
                    minHeight={340}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    value={latestValue}
                    label={valueLabel}
                  />
                ) : view === ChartView.FEES ? (
                  <BarChart
                    data={formattedFeesUSD}
                    color={backgroundColor}
                    minHeight={340}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    value={latestValue}
                    label={valueLabel}
                  />
                ) : view === ChartView.TVL ? (
                  <LineChart
                    data={formattedTvlData}
                    minHeight={340}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    value={latestValue}
                    label={valueLabel}
                  />
                ) : (
                  <DensityChart address={address} />
                )}
              </Box>
            </Card>
          </ContentLayout>
          <Heading>{t('Transactions')}</Heading>
          {transactions ? <TransactionTable transactions={transactions} /> : <LocalLoader fill={false} />}
        </AutoColumn>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default PoolPage
