import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import stableSwapMap from 'config/constants/stableSwapMap'
import { CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'
import { useContract } from 'hooks/useContract'
import infoStableSwapABI from 'config/abi/infoStableSwap.json'

import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import useSWR from 'swr'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

function useStableBalance(infoStableSwapAddress, swapAddress, token0, token1) {
  const infoStableSwap = useContract(infoStableSwapAddress, infoStableSwapABI, true)

  const getBalances = async () => {
    const response = await infoStableSwap.balances(swapAddress)

    return response
  }

  const { data } = useSWR(['infoStableSwap', infoStableSwapAddress, infoStableSwapABI], getBalances)

  if (!data) return 0

  const [reserve0, reserve1] = data

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
  )

  return pair
}

export default function Pool() {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  // Philip NOTE: get contract
  const stableMap = stableSwapMap[0]

  const lpstableToken = useMemo(
    () => new Token(stableMap.token0.chainId, stableMap.lpAddress, 18, 'Cake-LP', 'Pancake LPs'),
    [stableMap.token0.chainId, stableMap.lpAddress],
  )

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => [
      ...trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
      {
        liquidityToken: lpstableToken,
        tokens: [stableMap.token0, stableMap.token1],
      },
    ],
    [trackedTokenPairs, stableMap.token0, stableMap.token1, lpstableToken],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const stablePair = useStableBalance(
    stableMap.infoStableSwapAddress,
    stableMap.stableSwapAddress,
    stableMap.token0,
    stableMap.token1,
  )

  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }

    if (stablePair) {
      return <FullPositionCard key={stableMap.lpAddress} pair={stablePair} />
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Link href="/find" passHref>
                <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                  {t('Find other LP tokens')}
                </Button>
              </Link>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Link href="/add" passHref>
            <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="white" />}>
              {t('Add Liquidity')}
            </Button>
          </Link>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
