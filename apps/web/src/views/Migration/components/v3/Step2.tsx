import { useTranslation } from '@pancakeswap/localization'
import { Dots, Text } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { PairState, usePairs } from 'hooks/usePairs'
import { useMemo } from 'react'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
// import { useLPTokensWithBalanceByAccount } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useAccount } from 'wagmi'

export function Step2() {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // const stablePairs = useLPTokensWithBalanceByAccount(account)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  // const allV2PairsWithLiquidity = v2Pairs
  //   ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
  //   .map(([, pair]) => pair)

  return (
    <AppBody style={{ maxWidth: 'unset' }}>
      <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
      {!account ? (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      ) : v2IsLoading ? (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      ) : (
        <div>TODO placeholder</div>
      )}
    </AppBody>
  )
}
