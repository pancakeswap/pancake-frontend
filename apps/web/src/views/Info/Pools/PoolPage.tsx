/* eslint-disable no-nested-ternary */
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  CopyButton,
  Flex,
  Heading,
  HelpIcon,
  ScanLink,
  Spinner,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { getChainName } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import { CHAIN_QUERY_NAME } from 'config/chains'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { useStableSwapAPR } from 'hooks/useStableSwapAPR'
import { NextSeo } from 'next-seo'
import { useMemo, useState } from 'react'
import { ChainLinkSupportChains, checkIsStableSwap, multiChainId, multiChainScan } from 'state/info/constant'
import {
  useChainIdByQuery,
  useChainNameByQuery,
  useMultiChainPath,
  usePoolChartDataQuery,
  usePoolDatasQuery,
  usePoolTransactionsQuery,
  useStableSwapPath,
} from 'state/info/hooks'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;
  margin-top: 16px;
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

const LockedTokensContainer = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  border-radius: 16px;
  max-width: 280px;
`

const getFarmConfig = async (chainId: number) => {
  const config = await import(`@pancakeswap/farms/constants/${getChainName(chainId)}`)
  return config
}

const PoolPage: React.FC<React.PropsWithChildren<{ address: string }>> = ({ address: routeAddress }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [showWeeklyData, setShowWeeklyData] = useState(0)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {},
  )

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const poolData = usePoolDatasQuery(useMemo(() => [address], [address]))[0]
  const chartData = usePoolChartDataQuery(address)
  const transactions = usePoolTransactionsQuery(address)
  const chainId = useChainIdByQuery()
  const [poolSymbol, symbol0, symbol1] = useMemo(() => {
    const s0 = getTokenSymbolAlias(poolData?.token0.address, chainId, poolData?.token0.symbol)
    const s1 = getTokenSymbolAlias(poolData?.token1.address, chainId, poolData?.token1.symbol)
    return [`${s0} / ${s1}`, s0, s1]
  }, [chainId, poolData?.token0.address, poolData?.token0.symbol, poolData?.token1.address, poolData?.token1.symbol])
  const { savedPools, addPool } = useInfoUserSavedTokensAndPools(chainId)
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const infoTypeParam = useStableSwapPath()
  const isStableSwap = checkIsStableSwap()
  const stableAPR = useStableSwapAPR(isStableSwap ? address : undefined)
  const { data: farmConfig } = useQuery({
    queryKey: [`info/getFarmConfig/${chainId}`],
    queryFn: () => getFarmConfig(chainId),
    enabled: Boolean(isStableSwap && chainId),
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const feeDisplay = useMemo(() => {
    if (isStableSwap && farmConfig) {
      const stableLpFee =
        farmConfig?.default?.find((d: any) => d.stableSwapAddress?.toLowerCase() === address)?.stableLpFee ?? 0
      return new BigNumber(stableLpFee)
        .times((showWeeklyData ? poolData?.volumeOutUSDWeek : poolData?.volumeOutUSD) ?? 0)
        .toNumber()
    }
    return showWeeklyData ? poolData?.lpFees7d : poolData?.lpFees24h
  }, [poolData, isStableSwap, farmConfig, showWeeklyData, address])
  const stableTotalFee = useMemo(
    () => (isStableSwap && feeDisplay ? new BigNumber(feeDisplay).times(2).toNumber() : 0),
    [isStableSwap, feeDisplay],
  )

  const hasSmallDifference = useMemo(() => {
    return poolData ? Math.abs(poolData.token1Price - poolData.token0Price) < 1 : false
  }, [poolData])

  return (
    <Page>
      <NextSeo title={poolData ? poolSymbol : undefined} />
      {poolData ? (
        <>
          <Flex justifyContent="space-between" mb="16px" flexDirection={['column', 'column', 'row']}>
            <Breadcrumbs mb="32px">
              <NextLinkFromReactRouter to={`/info${chainPath}${infoTypeParam}`}>
                <Text color="primary">{t('Info')}</Text>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/info${chainPath}/pairs${infoTypeParam}`}>
                <Text color="primary">{t('Pairs')}</Text>
              </NextLinkFromReactRouter>
              <Flex>
                <Text mr="8px">{poolSymbol}</Text>
              </Flex>
            </Breadcrumbs>
            <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
              <ScanLink
                useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
                mr="8px"
                href={getBlockExploreLink(address, 'address', multiChainId[chainName])}
              >
                {t('View on %site%', { site: multiChainScan[chainName] })}
              </ScanLink>
              <SaveIcon fill={savedPools.includes(address)} onClick={() => addPool(address)} />
              <CopyButton ml="4px" text={address} tooltipMessage={t('Token address copied')} />
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
                {poolSymbol}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection={['column', 'column', 'row']} mb={['8px', '8px', null]}>
                <NextLinkFromReactRouter to={`/info${chainPath}/tokens/${poolData.token0.address}${infoTypeParam}`}>
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
                <NextLinkFromReactRouter to={`/info${chainPath}/tokens/${poolData.token1.address}${infoTypeParam}`}>
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
              </Flex>
            </Flex>
          </Flex>
          <ContentLayout>
            <Box>
              <Card>
                <Box p="24px">
                  <Flex justifyContent="space-between">
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
                        {t('Liquidity')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${formatAmount(poolData.liquidityUSD)}
                      </Text>
                      <Percent value={poolData.liquidityUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
                        {t('LP reward APR')}
                      </Text>
                      <Text fontSize="24px" bold>
                        {formatAmount(isStableSwap ? stableAPR : poolData.lpApr7d)}%
                      </Text>
                      <Flex alignItems="center">
                        <Text mr="4px" fontSize="12px" color="textSubtle">
                          {t('7D performance')}
                        </Text>
                        <span ref={targetRef}>
                          <HelpIcon color="textSubtle" />
                        </span>
                        {tooltipVisible && tooltip}
                      </Flex>
                    </Flex>
                  </Flex>
                  <Text color="secondary" bold mt="24px" fontSize="12px" textTransform="uppercase">
                    {t('Total Tokens Locked')}
                  </Text>
                  <LockedTokensContainer>
                    <Flex justifyContent="space-between">
                      <Flex>
                        <CurrencyLogo address={poolData.token0.address} size="24px" chainName={chainName} />
                        <Text small color="textSubtle" ml="8px">
                          {symbol0}
                        </Text>
                      </Flex>
                      <Text small>{formatAmount(poolData.liquidityToken0)}</Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Flex>
                        <CurrencyLogo address={poolData.token1.address} size="24px" chainName={chainName} />
                        <Text small color="textSubtle" ml="8px">
                          {symbol1}
                        </Text>
                      </Flex>
                      <Text small>{formatAmount(poolData.liquidityToken1)}</Text>
                    </Flex>
                  </LockedTokensContainer>
                </Box>
              </Card>
              <Card mt="16px">
                <Flex flexDirection="column" p="24px">
                  <ButtonMenu
                    activeIndex={showWeeklyData}
                    onItemClick={(index) => setShowWeeklyData(index)}
                    scale="sm"
                    variant="subtle"
                  >
                    <ButtonMenuItem width="100%">{t('24H')}</ButtonMenuItem>
                    <ButtonMenuItem width="100%">{t('7D')}</ButtonMenuItem>
                  </ButtonMenu>
                  <Flex mt="24px">
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('Volume 7D') : t('Volume 24H')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.volumeUSDWeek) : formatAmount(poolData.volumeUSD)}
                      </Text>
                      <Percent value={showWeeklyData ? poolData.volumeUSDChangeWeek : poolData.volumeUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('LP reward fees 7D') : t('LP reward fees 24H')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${formatAmount(feeDisplay)}
                      </Text>
                      <Text color="textSubtle" fontSize="12px">
                        {t('out of $%totalFees% total fees', {
                          totalFees:
                            (isStableSwap
                              ? formatAmount(stableTotalFee)
                              : showWeeklyData
                              ? formatAmount(poolData.totalFees7d)
                              : formatAmount(poolData.totalFees24h)) || '',
                        })}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            </Box>
            <ChartCard variant="pool" chartData={chartData || []} />
          </ContentLayout>
          <Heading mb="16px" mt="40px" scale="lg">
            {t('Transactions')}
          </Heading>
          <TransactionTable transactions={transactions} />
        </>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default PoolPage
