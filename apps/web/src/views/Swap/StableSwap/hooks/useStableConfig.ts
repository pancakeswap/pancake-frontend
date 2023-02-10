import { Currency, CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'
import { stableSwapPairsByChainId } from '@pancakeswap/smart-router/evm'
import stableSwapInfoABI from 'config/abi/infoStableSwap.json'
import stableLPABI from 'config/abi/stableLP.json'
import stableSwapABI from 'config/abi/stableSwap.json'
import { InfoStableSwap, StableLP, StableSwap } from 'config/abi/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'
import { createContext, useMemo } from 'react'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'

export function useStablePairs() {
  const { chainId } = useActiveChainId()

  const stablePairs = useMemo(() => {
    return (stableSwapPairsByChainId[chainId] || []).map((pair) => ({
      ...pair,
      liquidityToken: new ERC20Token(pair.token0.chainId, pair.lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs'),
    }))
  }, [chainId])

  return stablePairs
}

function useFindStablePair({ tokenA, tokenB }: { tokenA: Currency; tokenB: Currency }) {
  const stablePairs = useStablePairs()

  return useMemo(() => {
    return stablePairs.find((pair) => {
      return tokenA && tokenB && pair.involvesToken(tokenA) && pair.involvesToken(tokenB)
    })
  }, [stablePairs, tokenA, tokenB])
}

export function useLPTokensWithBalanceByAccount(account: string) {
  const lpTokens = useStablePairs()

  const [stableBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    lpTokens.map(
      ({ token0, lpAddress }) => new ERC20Token(token0.chainId, lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs'),
    ),
  )

  const lpTokensWithBalance = useMemo(
    () => lpTokens.filter(({ lpAddress }) => stableBalances[lpAddress]?.greaterThan('0')),
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

export const StableConfigContext = createContext<ReturnType<typeof useStableConfig>>(null)

export default function useStableConfig({ tokenA, tokenB }: { tokenA: Currency; tokenB: Currency }) {
  const stablePair = useFindStablePair({ tokenA, tokenB })
  const stableSwapContract = useContract<StableSwap>(stablePair?.stableSwapAddress, stableSwapABI)
  const stableSwapInfoContract = useContract<InfoStableSwap>(stablePair?.infoStableSwapAddress, stableSwapInfoABI)
  const stableSwapLPContract = useContract<StableLP>(stablePair?.lpAddress, stableLPABI)

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
