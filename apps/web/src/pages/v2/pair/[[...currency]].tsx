import {
  AutoRow,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Message,
  MessageText,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { AppHeader } from 'components/App'

import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { styled } from 'styled-components'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'

import { getLegacyFarmConfig, Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { useQuery } from '@tanstack/react-query'
import { LightGreyCard } from 'components/Card'
import { usePoolTokenPercentage, useTotalUSDValue } from 'components/PositionCard'
import { useCurrency } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMasterchef } from 'hooks/useContract'
import { useV2Pair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import { useRouter } from 'next/router'
import { useTokenBalance } from 'state/wallet/hooks'
import { formatAmount } from 'utils/formatInfoNumbers'
import { useAccount } from 'wagmi'
import { useAccountPositionDetailByPool } from 'state/farmsV4/state/accountPositions/hooks'
import { usePoolInfo } from 'state/farmsV4/state/extendPools/hooks'
import { useMemo } from 'react'
import { formatFiatNumber } from '@pancakeswap/utils/formatFiatNumber'
import { useTotalPriceUSD } from 'hooks/useTotalPriceUSD'
import { usePoolApr } from 'state/farmsV4/state/poolApr/hooks'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function PoolV2Page() {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  const router = useRouter()
  const { address: account } = useAccount()

  const [currencyIdA, currencyIdB] = router?.query?.currency ? router.query.currency : []

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const [, pair] = useV2Pair(baseCurrency ?? undefined, currencyB ?? undefined)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

  const poolInfo = usePoolInfo({ poolAddress: pair ? pair.liquidityToken.address : null, chainId })

  const { data: positionDetails } = useAccountPositionDetailByPool<Protocol.V2>(
    poolInfo?.chainId ?? chainId,
    account,
    poolInfo ?? undefined,
  )

  const isPoolStaked = useMemo(() => Boolean(positionDetails?.farmingBalance.greaterThan(0)), [positionDetails])

  const isFullyStaked = useMemo(
    () => (isPoolStaked ? Boolean(positionDetails?.nativeBalance.equalTo(0)) : false),
    [isPoolStaked, positionDetails],
  )

  const [token0Deposited, token1Deposited] = useMemo(() => {
    return [
      isPoolStaked
        ? positionDetails?.nativeDeposited0.add(positionDetails?.farmingDeposited0)
        : positionDetails?.nativeDeposited0,
      isPoolStaked
        ? positionDetails?.nativeDeposited1.add(positionDetails?.farmingDeposited1)
        : positionDetails?.nativeDeposited1,
    ]
  }, [positionDetails, isPoolStaked])

  const totalStakedUSDValue = useTotalPriceUSD({
    currency0: pair?.token0,
    currency1: pair?.token1,
    amount0: isPoolStaked ? positionDetails?.farmingDeposited0 : undefined,
    amount1: isPoolStaked ? positionDetails?.farmingDeposited1 : undefined,
  })

  const totalUSDValue = useTotalPriceUSD({
    currency0: pair?.token0,
    currency1: pair?.token1,
    amount0: token0Deposited,
    amount1: token1Deposited,
  })

  const masterchefV2Contract = useMasterchef()

  const { data: isFarmExistActiveForPair } = useQuery({
    queryKey: ['isFarmExistActiveForPair', chainId, pair?.liquidityToken?.address],

    queryFn: async () => {
      const farmsConfig = (await getLegacyFarmConfig(chainId)) || []
      const farmPair = farmsConfig.find(
        (farm) => farm.lpAddress.toLowerCase() === pair?.liquidityToken?.address?.toLowerCase(),
      )
      if (farmPair) {
        const contractPoolInfo = await masterchefV2Contract?.read.poolInfo([BigInt(farmPair.pid)])
        const allocPoint = contractPoolInfo ? (contractPoolInfo[2] as bigint) : 0
        return allocPoint > 0 ? 'exist' : 'notexist'
      }
      return 'exist'
    },

    enabled: Boolean(chainId && pair && masterchefV2Contract),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const { isMobile } = useMatchBreakpoints()

  const key = useMemo(() => (poolInfo ? (`${poolInfo?.chainId}:${poolInfo?.lpAddress}` as const) : null), [poolInfo])

  const { lpApr } = usePoolApr(key, poolInfo ?? null)

  const lpRewardApr = useMemo(() => {
    if (lpApr === '0') return undefined
    return `${((parseFloat(lpApr) ?? 0) * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  }, [lpApr])

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={
            <Flex justifyContent="center" alignItems="center">
              <DoubleCurrencyLogo size={24} currency0={pair?.token0} currency1={pair?.token1} />
              <Heading as="h2" ml="8px">
                {pair?.token0?.symbol}-{pair?.token1?.symbol} LP
              </Heading>
            </Flex>
          }
          backTo="/liquidity/pools"
          noConfig
          buttons={
            !isMobile && (
              <>
                <NextLinkFromReactRouter to={`/v2/add/${pair?.token0.address}/${pair?.token1.address}?increase=1`}>
                  <Button width="100%" disabled={!pair}>
                    {t('Add')}
                  </Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter
                  to={`/v2/remove/${pair?.token0.address}/${pair?.token1.address}`}
                  style={{ margin: '0px 8px' }}
                >
                  <Button variant="secondary" width="100%" disabled={!pair || isFullyStaked}>
                    {t('Remove')}
                  </Button>
                </NextLinkFromReactRouter>
                {isFarmExistActiveForPair === 'notexist' && (
                  <NextLinkFromReactRouter to={`/v2/migrate/${pair?.liquidityToken?.address}`}>
                    <Button variant="secondary" width="100%" disabled={!pair || isFullyStaked}>
                      {t('Migrate')}
                    </Button>
                  </NextLinkFromReactRouter>
                )}
              </>
            )
          }
        />
        <CardBody>
          {isMobile && (
            <>
              <NextLinkFromReactRouter to={`/v2/add/${pair?.token0.address}/${pair?.token1.address}?increase=1`}>
                <Button width="100%" mb="8px" disabled={!pair}>
                  {t('Add')}
                </Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/v2/remove/${pair?.token0.address}/${pair?.token1.address}`}>
                <Button variant="secondary" width="100%" mb="8px" disabled={!pair || isFullyStaked}>
                  {t('Remove')}
                </Button>
              </NextLinkFromReactRouter>
              {isFarmExistActiveForPair === 'notexist' && (
                <NextLinkFromReactRouter to={`/v2/migrate/${pair?.liquidityToken?.address}`}>
                  <Button variant="secondary" width="100%" mb="8px" disabled={!pair || isFullyStaked}>
                    {t('Migrate')}
                  </Button>
                </NextLinkFromReactRouter>
              )}
            </>
          )}
          <AutoRow style={{ gap: 4 }}>
            <Flex alignItems="center" justifyContent="space-between" width="100%" mb="8px">
              <Box width="100%">
                <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                  {t('Liquidity')}
                </Text>
                <Text fontSize="24px" fontWeight={600}>
                  {totalUSDValue ? formatFiatNumber(totalUSDValue) : '-'}
                </Text>
                <LightGreyCard mr="4px">
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={pair?.token0} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {pair?.token0?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{token0Deposited?.toSignificant(4)}</Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={pair?.token1} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {pair?.token1?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{token1Deposited?.toSignificant(4)}</Text>
                    </Flex>
                  </AutoRow>
                </LightGreyCard>
              </Box>
            </Flex>
            <Flex
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent={isPoolStaked ? 'space-between' : 'flex-end'}
              width="100%"
              style={{ gap: 4 }}
            >
              {isPoolStaked && (
                <Box width={isMobile ? '100%' : '50%'}>
                  <Message variant="primary">
                    <MessageText>
                      {t('%amount% of your liquidity is currently staking in farm.', {
                        amount: totalStakedUSDValue ? formatFiatNumber(totalStakedUSDValue) : '-',
                      })}
                    </MessageText>
                  </Message>
                </Box>
              )}
              <Flex
                flexDirection="column"
                alignItems={isMobile ? 'flex-start' : 'flex-end'}
                justifyContent="center"
                mr="4px"
                style={{ gap: 4 }}
              >
                {lpRewardApr && (
                  <Text ml="4px">
                    {t('LP reward APR')}: {lpRewardApr}%
                  </Text>
                )}
                <Text color="textSubtle" ml="4px">
                  {t('Your share in pool')}: {poolTokenPercentage ? `${poolTokenPercentage.toFixed(8)}%` : '-'}
                </Text>
              </Flex>
            </Flex>
          </AutoRow>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

PoolV2Page.chains = CHAIN_IDS
PoolV2Page.screen = true
