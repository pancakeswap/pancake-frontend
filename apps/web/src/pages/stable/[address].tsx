import {
  AutoRow,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Message,
  MessageText,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { AppHeader } from 'components/App'
import { useMemo } from 'react'

import { useRouter } from 'next/router'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'
import { styled } from 'styled-components'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'

import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount } from '@pancakeswap/sdk'
import { LightGreyCard } from 'components/Card'
import { CurrencyLogo } from 'components/Logo'
import { usePoolTokenPercentage, useTotalUSDValue } from 'components/PositionCard'
import { useInfoStableSwapContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import currencyId from 'utils/currencyId'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { useAccount } from 'wagmi'
import { Protocol } from '@pancakeswap/farms'
import { useAccountPositionDetailByPool } from 'state/farmsV4/state/accountPositions/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { usePoolInfo } from 'state/farmsV4/state/extendPools/hooks'
import { formatFiatNumber } from '@pancakeswap/utils/formatFiatNumber'
import { useTotalPriceUSD } from 'hooks/useTotalPriceUSD'
import { useLPApr } from 'state/swap/useLPApr'
import { formatAmount } from 'utils/formatInfoNumbers'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 858px;
  width: 100%;
  z-index: 1;
`

export default function StablePoolPage() {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const router = useRouter()

  const { address: account } = useAccount()

  const { address: poolAddress } = router.query

  const lpTokens = useStableSwapPairs()

  const { chainId } = useActiveChainId()

  const selectedLp = useMemo(
    () => lpTokens.find(({ liquidityToken }) => liquidityToken.address === poolAddress),
    [lpTokens, poolAddress],
  )

  const poolInfo = usePoolInfo({ poolAddress: selectedLp ? selectedLp?.stableSwapAddress : undefined, chainId })

  const stableSwapInfoContract = useInfoStableSwapContract(selectedLp?.infoStableSwapAddress)

  const { data: positionDetails } = useAccountPositionDetailByPool<Protocol.STABLE>(
    poolInfo?.chainId ?? chainId,
    account,
    poolInfo ?? undefined,
  )

  const isPoolStaked = useMemo(() => Boolean(positionDetails?.farmingBalance.greaterThan(0)), [positionDetails])

  const isFullyStaked = useMemo(
    () => (isPoolStaked ? Boolean(positionDetails?.nativeBalance.equalTo(0)) : false),
    [isPoolStaked, positionDetails],
  )

  const { result: reserves = [0n, 0n] } = useSingleCallResult({
    contract: stableSwapInfoContract,
    functionName: 'balances',
    args: useMemo(() => [selectedLp?.stableSwapAddress] as const, [selectedLp?.stableSwapAddress]),
  })

  const stableLp = useMemo(() => {
    return selectedLp
      ? [selectedLp].map((lpToken) => ({
          ...lpToken,
          tokenAmounts: [],
          reserve0: CurrencyAmount.fromRawAmount(lpToken?.token0, reserves[0]),
          reserve1: CurrencyAmount.fromRawAmount(lpToken?.token1, reserves[1]),
          getLiquidityValue: () => CurrencyAmount.fromRawAmount(lpToken?.token0, '0'),
        }))[0]
      : null
  }, [reserves, selectedLp])

  const totalLiquidityUSD = useTotalUSDValue({
    currency0: selectedLp?.token0,
    currency1: selectedLp?.token1,
    token0Deposited: stableLp?.reserve0,
    token1Deposited: stableLp?.reserve1,
  })

  const userPoolBalance = useMemo(() => {
    return isPoolStaked
      ? positionDetails?.nativeBalance.add(positionDetails?.farmingBalance)
      : positionDetails?.nativeBalance
  }, [positionDetails, isPoolStaked])

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
    currency0: selectedLp?.token0,
    currency1: selectedLp?.token1,
    amount0: isPoolStaked ? positionDetails?.farmingDeposited0 : undefined,
    amount1: isPoolStaked ? positionDetails?.farmingDeposited1 : undefined,
  })

  const totalUSDValue = useTotalPriceUSD({
    currency0: selectedLp?.token0,
    currency1: selectedLp?.token1,
    amount0: token0Deposited,
    amount1: token1Deposited,
  })

  const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens: positionDetails?.totalSupply, userPoolBalance })

  const { isMobile } = useMatchBreakpoints()

  const poolData = useLPApr('stable', selectedLp)

  if (!selectedLp) return null

  const currencyIdA = currencyId(selectedLp.token0)
  const currencyIdB = currencyId(selectedLp.token1)

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={`${stableLp?.token0?.symbol}-${stableLp?.token1?.symbol} LP`}
          backTo="/liquidity/pools"
          noConfig
          buttons={
            !isMobile && (
              <>
                <NextLinkFromReactRouter to={`/stable/add/${currencyIdA}/${currencyIdB}`}>
                  <Button width="100%">{t('Add')}</Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter to={`/stable/remove/${currencyIdA}/${currencyIdB}`}>
                  <Button ml="16px" variant="secondary" width="100%" disabled={isFullyStaked}>
                    {t('Remove')}
                  </Button>
                </NextLinkFromReactRouter>
              </>
            )
          }
        />
        <CardBody>
          {isMobile && (
            <>
              <NextLinkFromReactRouter to={`/stable/add/${currencyIdA}/${currencyIdB}`}>
                <Button mb="8px" width="100%">
                  {t('Add')}
                </Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter to={`/stable/remove/${currencyIdA}/${currencyIdB}`}>
                <Button mb="8px" variant="secondary" width="100%" disabled={isFullyStaked}>
                  {t('Remove')}
                </Button>
              </NextLinkFromReactRouter>
            </>
          )}
          <AutoRow style={{ gap: 4 }}>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              style={{ gap: 4 }}
              width="100%"
              flexWrap={['wrap', 'wrap', 'nowrap']}
            >
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
                      <CurrencyLogo currency={stableLp?.token0} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {stableLp?.token0?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{formatCurrencyAmount(token0Deposited, 4, locale)}</Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={stableLp?.token1} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {stableLp?.token1?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{formatCurrencyAmount(token1Deposited, 4, locale)}</Text>
                    </Flex>
                  </AutoRow>
                </LightGreyCard>
              </Box>
              <Box width="100%">
                <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                  {t('Pool reserves')}
                </Text>
                <Text fontSize="24px" fontWeight={600}>
                  {totalLiquidityUSD ? formatFiatNumber(totalLiquidityUSD) : '-'}
                </Text>
                <LightGreyCard mr="4px">
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={stableLp?.token0} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {stableLp?.token0?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{formatCurrencyAmount(stableLp?.reserve0, 4, locale)}</Text>
                    </Flex>
                  </AutoRow>
                  <AutoRow justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={stableLp?.token1} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {stableLp?.token1?.symbol}
                      </Text>
                    </Flex>
                    <Flex justifyContent="center">
                      <Text mr="4px">{formatCurrencyAmount(stableLp?.reserve1, 4, locale)}</Text>
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
                {poolData && (
                  <Text ml="4px">
                    {t('LP reward APR')}: {formatAmount(poolData.lpApr)}%
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

StablePoolPage.chains = CHAIN_IDS
