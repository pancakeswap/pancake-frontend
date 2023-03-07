import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import stableSwapInfoABI from 'config/abi/infoStableSwap.json'
import stableLPABI from 'config/abi/stableLP.json'
import stableSwapABI from 'config/abi/stableSwap.json'
import { useContract } from 'hooks/useContract'
import { createContext, useMemo } from 'react'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'

function useFindStablePair({ tokenA, tokenB }: { tokenA: Currency | undefined; tokenB: Currency | undefined }) {
  const stablePairs = useStableSwapPairs()

  return useMemo(
    () =>
      stablePairs.find((stablePair) => {
        return (
          tokenA &&
          tokenB &&
          ((stablePair?.token0?.equals(tokenA.wrapped) && stablePair?.token1?.equals(tokenB.wrapped)) ||
            (stablePair?.token1?.equals(tokenA.wrapped) && stablePair?.token0?.equals(tokenB.wrapped)))
        )
      }),
    [tokenA, tokenB, stablePairs],
  )
}

export function useLPTokensWithBalanceByAccount(account) {
  const lpTokens = useStableSwapPairs()

  const [stableBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    lpTokens.map(({ liquidityToken }) => liquidityToken),
  )

  const lpTokensWithBalance = useMemo(
    () => lpTokens.filter(({ liquidityToken }) => stableBalances[liquidityToken.address]?.greaterThan('0')),
    [lpTokens, stableBalances],
  )

  return lpTokensWithBalance.map((lpToken) => ({
    ...lpToken,
    tokenAmounts: [],
    reserve0: CurrencyAmount.fromRawAmount(lpToken?.token0, '0'),
    reserve1: CurrencyAmount.fromRawAmount(lpToken?.token1, '0'),
    getLiquidityValue: () => CurrencyAmount.fromRawAmount(lpToken?.token0, '0'),
  }))
}

export const StableConfigContext = createContext(null)

export default function useStableConfig({ tokenA, tokenB }: { tokenA: Currency; tokenB: Currency }) {
  const stablePair = useFindStablePair({ tokenA, tokenB })
  const stableSwapContract = useContract(stablePair?.stableSwapAddress, stableSwapABI)
  const stableSwapInfoContract = useContract(stablePair?.infoStableSwapAddress, stableSwapInfoABI)
  const stableSwapLPContract = useContract(stablePair?.liquidityToken.address, stableLPABI)

  return useMemo(
    () => ({
      stableSwapConfig: stablePair,
      stableSwapContract,
      stableSwapInfoContract,
      stableSwapLPContract,
    }),
    [stablePair, stableSwapContract, stableSwapInfoContract, stableSwapLPContract],
  )
}
