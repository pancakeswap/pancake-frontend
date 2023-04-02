import { AutoColumn, Box, Button, Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import BarChart from '../components/BarChart/alt'
import { DarkGreyCard, GreyBadge, GreyCard } from '../components/Card'
import DensityChart from '../components/DensityChart'
import Loader, { LocalLoader } from '../components/Loader'
import Percent from '../components/Percent'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import { MonoSpace, PageWrapper, ThemedBackground } from '../components/shared'
import TransactionTable from '../components/TransactionsTable'
import { v3InfoPath } from '../constants'
import { usePoolChartData, usePoolData, usePoolTransactions } from '../hooks'
import { feeTierPercent, getEtherscanLink } from '../utils'
import { unixToDate } from '../utils/date'
import { formatAmount, formatDollarAmount } from '../utils/numbers'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const TokenButton = styled(GreyCard)`
  padding: 8px 12px;
  border-radius: 10px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
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
  VOL,
  PRICE,
  DENSITY,
  FEES,
}

const PoolPage: React.FC<{ address: string }> = ({ address }) => {
  const { chainId } = useActiveChainId()

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

  // //watchlist
  // const [savedPools, addSavedPool] = useSavedPools()

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={backgroundColor} />
      {poolData ? (
        <AutoColumn gap="32px">
          <RowBetween>
            <AutoRow gap="4px">
              <NextLink href={v3InfoPath}>
                <Text>{`Home > `}</Text>
              </NextLink>
              <NextLink href={`${v3InfoPath}/pools`}>
                <Text>{` Pools `}</Text>
              </NextLink>
              <Text>{` > `}</Text>
              <Text>{` ${poolData.token0.symbol} / ${poolData.token1.symbol} ${feeTierPercent(
                poolData.feeTier,
              )} `}</Text>
            </AutoRow>
            <RowFixed gap="10px" align="center">
              {/* <SavedIcon fill={savedPools.includes(address)} onClick={() => addSavedPool(address)} /> */}
              <LinkExternal isBscScan href={getEtherscanLink(chainId, address, 'address')} />
            </RowFixed>
          </RowBetween>
          <ResponsiveRow align="flex-end">
            <AutoColumn gap="lg">
              <RowFixed>
                <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} size={24} />
                <Text
                  ml="8px"
                  mr="8px"
                  fontSize="24px"
                >{` ${poolData.token0.symbol} / ${poolData.token1.symbol} `}</Text>
                <GreyBadge>{feeTierPercent(poolData.feeTier)}</GreyBadge>
                {/* {activeNetwork === EthereumNetworkInfo ? null : (
                  <GenericImageWrapper src={activeNetwork.imageURL} style={{ marginLeft: '8px' }} size={'26px'} />
                )} */}
              </RowFixed>
              <ResponsiveRow>
                <NextLink href={`${v3InfoPath}/tokens/${poolData.token0.address}`}>
                  <TokenButton>
                    <RowFixed>
                      <CurrencyLogo address={poolData.token0.address} size="20px" />
                      <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                        {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, 4)} ${
                          poolData.token1.symbol
                        }`}
                      </Text>
                    </RowFixed>
                  </TokenButton>
                </NextLink>
                <NextLink href={`${v3InfoPath}/tokens/${poolData.token0.address}`}>
                  <TokenButton ml="10px">
                    <RowFixed>
                      <CurrencyLogo address={poolData.token1.address} size="20px" />
                      <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                        {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, 4)} ${
                          poolData.token0.symbol
                        }`}
                      </Text>
                    </RowFixed>
                  </TokenButton>
                </NextLink>
              </ResponsiveRow>
            </AutoColumn>
            <RowFixed>
              <NextLink href={`/add/${poolData.token0.address}/${poolData.token1.address}/${poolData.feeTier}`}>
                <Button width="170px" mr="12px" style={{ height: '44px' }}>
                  <RowBetween>
                    <Text style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</Text>
                  </RowBetween>
                </Button>
              </NextLink>
              <NextLink
                href={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}`}
              >
                <Button width="100px" style={{ height: '44px' }}>
                  Trade
                </Button>
              </NextLink>
            </RowFixed>
          </ResponsiveRow>
          <ContentLayout>
            <DarkGreyCard>
              <AutoColumn gap="lg">
                <GreyCard padding="16px">
                  <AutoColumn gap="md">
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
                </GreyCard>
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
              </AutoColumn>
            </DarkGreyCard>
            <DarkGreyCard>
              <Box>
                <AutoColumn>
                  <Text fontSize="24px" height="30px">
                    <MonoSpace>
                      {latestValue
                        ? formatDollarAmount(latestValue)
                        : view === ChartView.VOL
                        ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                        : view === ChartView.DENSITY
                        ? ''
                        : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}{' '}
                    </MonoSpace>
                  </Text>
                  <Text height="20px" fontSize="12px">
                    {valueLabel ? <MonoSpace>{valueLabel} (UTC)</MonoSpace> : ''}
                  </Text>
                </AutoColumn>
                <Flex width="240px" alignItems="center">
                  <Button
                    // isActive={view === ChartView.VOL}

                    onClick={() => (view === ChartView.VOL ? setView(ChartView.DENSITY) : setView(ChartView.VOL))}
                  >
                    Volume
                  </Button>
                  <Button
                    // isActive={view === ChartView.DENSITY}

                    onClick={() => (view === ChartView.DENSITY ? setView(ChartView.VOL) : setView(ChartView.DENSITY))}
                  >
                    Liquidity
                  </Button>
                  <Button
                    // isActive={view === ChartView.FEES}

                    onClick={() => (view === ChartView.FEES ? setView(ChartView.VOL) : setView(ChartView.FEES))}
                  >
                    Fees
                  </Button>
                </Flex>
              </Box>
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
            </DarkGreyCard>
          </ContentLayout>
          <Text fontSize="24px">Transactions</Text>
          <DarkGreyCard>
            {transactions ? <TransactionTable transactions={transactions} /> : <LocalLoader fill={false} />}
          </DarkGreyCard>
        </AutoColumn>
      ) : (
        <Loader />
      )}
    </PageWrapper>
  )
}

export default PoolPage
