import { AutoRow, Box, Button, Card, CardBody, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
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
import useTotalSupply from 'hooks/useTotalSupply'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import currencyId from 'utils/currencyId'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { useGetRemovedTokenAmountsNoContext } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import { useAccount } from 'wagmi'
import { formatAmount } from 'utils/formatInfoNumbers'
import { useLPApr } from 'state/swap/useLPApr'

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

  const selectedLp = lpTokens.find(({ liquidityToken }) => liquidityToken.address === poolAddress)

  const stableSwapInfoContract = useInfoStableSwapContract(selectedLp?.infoStableSwapAddress)

  const { result } = useSingleCallResult({
    contract: stableSwapInfoContract,
    functionName: 'balances',
    // @ts-ignore
    args: useMemo(() => [selectedLp?.stableSwapAddress] as const, [selectedLp?.stableSwapAddress]),
  })

  const reserves = useMemo(() => result || [0n, 0n], [result])

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

  const userPoolBalance = useTokenBalance(account ?? undefined, selectedLp?.liquidityToken)

  const [token0Deposited, token1Deposited] = useGetRemovedTokenAmountsNoContext({
    lpAmount: userPoolBalance?.quotient?.toString(),
    token0: selectedLp?.token0.wrapped,
    token1: selectedLp?.token1.wrapped,
    stableSwapInfoContract,
    stableSwapAddress: selectedLp?.stableSwapAddress,
  })

  const totalUSDValue = useTotalUSDValue({
    currency0: selectedLp?.token0,
    currency1: selectedLp?.token1,
    token0Deposited,
    token1Deposited,
  })

  const totalPoolTokens = useTotalSupply(selectedLp?.liquidityToken)

  const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

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
          backTo="/liquidity"
          noConfig
          buttons={
            !isMobile && (
              <>
                <NextLinkFromReactRouter to={`/stable/add/${currencyIdA}/${currencyIdB}`}>
                  <Button width="100%">{t('Add')}</Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter to={`/stable/remove/${currencyIdA}/${currencyIdB}`}>
                  <Button ml="16px" variant="secondary" width="100%">
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
                <Button mb="8px" variant="secondary" width="100%">
                  {t('Remove')}
                </Button>
              </NextLinkFromReactRouter>
            </>
          )}
          <AutoRow>
            <Flex alignItems="center" justifyContent="space-between" width="100%" flexWrap={['wrap', 'wrap', 'nowrap']}>
              <Box width="100%" mr="4px" mb="16px">
                <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                  {t('Liquidity')}
                </Text>
                <Text fontSize="24px" fontWeight={600}>
                  $
                  {totalUSDValue
                    ? totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'}
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
              <Box width="100%" mr="4px" mb="16px">
                <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
                  {t('Pool reserves')}
                </Text>
                <Text fontSize="24px" fontWeight={600}>
                  $
                  {totalLiquidityUSD
                    ? totalLiquidityUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'}
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
          </AutoRow>
          {poolData && (
            <Text>
              {t('LP reward APR')}: {formatAmount(poolData.lpApr7d)}%
            </Text>
          )}
          <Text color="textSubtle">
            {t('Your share in pool')}: {poolTokenPercentage ? `${poolTokenPercentage.toFixed(8)}%` : '-'}
          </Text>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}

StablePoolPage.chains = CHAIN_IDS
