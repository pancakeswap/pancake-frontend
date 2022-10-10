import { useContract } from 'hooks/useContract'
import stableSwapABI from 'config/abi/stableSwap.json'
import stableSwapInfoABI from 'config/abi/infoStableSwap.json'
import stableLPABI from 'config/abi/stableLP.json'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { createContext, useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWRImmutable from 'swr/immutable'
import { getStableConfig } from '@pancakeswap/farms/constants'
import { deserializeToken } from '@pancakeswap/tokens'

export function useStableFarms() {
  const { chainId } = useActiveWeb3React()

  const { data: stableFarms = [] } = useSWRImmutable(chainId && ['stable-farms', chainId], async () => {
    const farms = await getStableConfig(chainId)

    return farms.map(({ token, quoteToken, lpAddress, ...rest }) => ({
      ...rest,
      liquidityToken: new Token(chainId, lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs'),
      token0: deserializeToken(token),
      token1: deserializeToken(quoteToken),
    }))
  })

  return stableFarms
}

function useFindStablePair({ tokenA, tokenB }) {
  const stableFarms = useStableFarms()

  return useMemo(
    () =>
      stableFarms.find((stablePair) => {
        return (
          tokenA &&
          tokenB &&
          ((stablePair?.token0?.equals(tokenA) && stablePair?.token1?.equals(tokenB)) ||
            (stablePair?.token1?.equals(tokenA) && stablePair?.token0?.equals(tokenB)))
        )
      }),
    [tokenA, tokenB, stableFarms],
  )
}

export function useLPTokensWithBalanceByAccount(account) {
  const lpTokens = useStableFarms()

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
