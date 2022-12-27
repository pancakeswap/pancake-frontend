import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, Heading } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import { checkIsStableSwap } from 'state/info/constant'
import {
  useAllPoolDataSWR,
  useAllTokenDataSWR,
  useProtocolChartDataSWR,
  useProtocolDataSWR,
  useProtocolTransactionsSWR,
  useStableSwapTopPoolsAPR,
} from 'state/info/hooks'
import styled from 'styled-components'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import HoverableChart from '../components/InfoCharts/HoverableChart'

export const ChartCardsContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

const Overview: React.FC<React.PropsWithChildren> = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const protocolData = useProtocolDataSWR()
  const chartData = useProtocolChartDataSWR()
  const transactions = useProtocolTransactionsSWR()
  const isStableSwap = checkIsStableSwap()

  const currentDate = useMemo(
    () => new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' }),
    [locale],
  )

  const allTokens = useAllTokenDataSWR()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token.name !== 'unknown')
  }, [allTokens])

  const allPoolData = useAllPoolDataSWR()
  const poolAddresses = useMemo(() => {
    return Object.keys(allPoolData)
  }, [allPoolData])

  const stableSwapsAprs = useStableSwapTopPoolsAPR(poolAddresses)
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => {
        return {
          ...pool.data,
          ...(isStableSwap && stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.data.address] }),
        }
      })
      .filter((pool) => pool.token1.name !== 'unknown' && pool.token0.name !== 'unknown')
  }, [allPoolData, isStableSwap, stableSwapsAprs])

  const somePoolsAreLoading = useMemo(() => {
    return poolDatas.some((pool) => !pool?.token0Price)
  }, [poolDatas])

  return (
    <Page>
      <Heading scale="lg" mb="16px" id="info-overview-title">
        {t('PancakeSwap Info & Analytics')}
      </Heading>
      <ChartCardsContainer>
        <Card>
          <HoverableChart
            chartData={chartData}
            protocolData={protocolData}
            currentDate={currentDate}
            valueProperty="liquidityUSD"
            title={t('Liquidity')}
            ChartComponent={LineChart}
          />
        </Card>
        <Card>
          <HoverableChart
            chartData={chartData}
            protocolData={protocolData}
            currentDate={currentDate}
            valueProperty="volumeUSD"
            title={t('Volume 24H')}
            ChartComponent={BarChart}
          />
        </Card>
      </ChartCardsContainer>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Top Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Top Pairs')}
      </Heading>
      <PoolTable poolDatas={poolDatas} loading={somePoolsAreLoading} />
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Transactions')}
      </Heading>
      <TransactionTable transactions={transactions} />
    </Page>
  )
}

export default Overview
