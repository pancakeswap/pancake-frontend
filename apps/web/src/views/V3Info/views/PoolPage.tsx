import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import {
  AutoColumn,
  Box,
  Breadcrumbs,
  Card,
  Flex,
  Heading,
  LinkExternal,
  NextLinkFromReactRouter,
  Spinner,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { TabToggle, TabToggleGroup } from 'components/TabToggle'
// import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
import { multiChainId, multiChainScan } from 'state/info/constant'
import { useGetChainName, useMultiChainPath, useStableSwapPath } from 'state/info/hooks'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import BarChart from '../components/BarChart/alt'
import { GreyBadge } from '../components/Card'
import DensityChart from '../components/DensityChart'
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
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

enum ChartView {
  VOL,
  PRICE,
  DENSITY,
  FEES,
}

const PoolPage: React.FC<{ address: string }> = ({ address }) => {
  // const { chainId } = useActiveChainId()
  const { isXs, isSm } = useMatchBreakpoints()

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

  const chainName = useGetChainName()
  const chainPath = useMultiChainPath()
  const infoTypeParam = useStableSwapPath()
  const { t } = useTranslation()
  return (
    <Page>
      {poolData ? (
        <AutoColumn gap="32px">
          <Flex justifyContent="space-between" mb="16px" flexDirection={['column', 'column', 'row']}>
            <Breadcrumbs mb="32px">
              <NextLinkFromReactRouter to={`/${v3InfoPath}${chainPath}${infoTypeParam}`}>
                <Text color="primary">{t('Info')}</Text>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/${v3InfoPath}${chainPath}/pools${infoTypeParam}`}>
                <Text color="primary">{t('Pools')}</Text>
              </NextLinkFromReactRouter>
              <Flex>
                <Text mr="8px">
                  {`${poolData.token0.symbol} / ${poolData.token1.symbol} 
                `}
                  <GreyBadge ml="4px" style={{ display: 'inline-block' }}>
                    {feeTierPercent(poolData.feeTier)}
                  </GreyBadge>
                </Text>
              </Flex>
            </Breadcrumbs>

            <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
              <LinkExternal
                isBscScan={multiChainId[chainName] === ChainId.BSC}
                mr="8px"
                href={getBlockExploreLink(address, 'address', multiChainId[chainName])}
              >
                {t('View on %site%', { site: multiChainScan[chainName] })}
              </LinkExternal>
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
                {`${poolData.token0.symbol} / ${poolData.token1.symbol}`}{' '}
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
                      {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
                      })} ${poolData.token1.symbol}`}
                    </Text>
                  </TokenButton>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter
                  to={`/${v3InfoPath}${chainPath}/tokens/${poolData.token1.address}${infoTypeParam}`}
                >
                  <TokenButton ml={[null, null, '10px']}>
                    <CurrencyLogo address={poolData.token1.address} size="24px" chainName={chainName} />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
                      })} ${poolData.token0.symbol}`}
                    </Text>
                  </TokenButton>
                </NextLinkFromReactRouter>
              </Flex>
              {/* <Flex>
                <NextLinkFromReactRouter
                  to={`/add/${poolData.token0.address}/${poolData.token1.address}?chain=${CHAIN_QUERY_NAME[chainId]}`}
                >
                  <Button mr="8px" variant="secondary">
                    {t('Add Liquidity')}
                  </Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter
                  to={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}&chainId=${multiChainId[chainName]}`}
                >
                  <Button>{t('Trade')}</Button>
                </NextLinkFromReactRouter>
              </Flex> */}
            </Flex>
          </Flex>
          <ContentLayout>
            <Card>
              <Box p="24px">
                <Card mb="24px">
                  <AutoColumn padding="16px" gap="md">
                    <Text>Total Tokens Locked</Text>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo address={poolData.token0.address} size="20px" />
                        <Text fontSize="14px" ml="8px">
                          {poolData.token0.symbol}
                        </Text>
                      </RowFixed>
                      <Text fontSize="14px">{formatAmount(poolData.tvlToken0)}</Text>
                    </RowBetween>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo address={poolData.token1.address} size="20px" />
                        <Text fontSize="14px" ml="8px">
                          {poolData.token1.symbol}
                        </Text>
                      </RowFixed>
                      <Text fontSize="14px">{formatAmount(poolData.tvlToken1)}</Text>
                    </RowBetween>
                  </AutoColumn>
                </Card>
                <AutoColumn gap="4px">
                  <Text fontWeight={400}>TVL</Text>
                  <Text fontSize="24px">{formatDollarAmount(poolData.tvlUSD)}</Text>
                  <Percent value={poolData.tvlUSDChange} />
                </AutoColumn>
                <AutoColumn gap="4px">
                  <Text fontWeight={400}>Volume 24h</Text>
                  <Text fontSize="24px">{formatDollarAmount(poolData.volumeUSD)}</Text>
                  <Percent value={poolData.volumeUSDChange} />
                </AutoColumn>
                <AutoColumn gap="4px">
                  <Text fontWeight={400}>24h Fees</Text>
                  <Text fontSize="24px">{formatDollarAmount(poolData.volumeUSD * (poolData.feeTier / 1000000))}</Text>
                </AutoColumn>
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
              </TabToggleGroup>
              <Flex flexDirection="column" px="24px" pt="24px">
                {latestValue
                  ? formatDollarAmount(latestValue)
                  : view === ChartView.VOL
                  ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                  : view === ChartView.DENSITY
                  ? ''
                  : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}
                <Text small color="secondary">
                  {valueLabel ? (
                    `${valueLabel} (UTC)`
                  ) : (
                    <Text small color="secondary" style={{ opacity: 0 }}>
                      0
                    </Text>
                  )}
                </Text>
              </Flex>
              <Box px="24px" height="335px">
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
                ) : (
                  <DensityChart address={address} />
                )}
              </Box>
            </Card>
          </ContentLayout>
          <Heading>Transactions</Heading>
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
