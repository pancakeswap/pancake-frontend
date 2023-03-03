import stableSwapInfoABI from 'config/abi/infoStableSwap.json'
import stableLPABI from 'config/abi/stableLP.json'
import stableSwapABI from 'config/abi/stableSwap.json'
import { useContract } from 'hooks/useContract'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'

import { Currency, CurrencyAmount, ERC20Token, Token } from '@pancakeswap/sdk'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { createContext, useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { getStableConfig } from '@pancakeswap/farms/constants'
import { deserializeToken } from '@pancakeswap/token-lists'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Contract } from '@ethersproject/contracts'
import { SerializedStableFarmConfig } from '@pancakeswap/farms/src/types'

interface StableSwapConfigType extends SerializedStableFarmConfig {
  liquidityToken: ERC20Token
  token0: Token
  token1: Token
}

export type StableSwapConfig = Omit<StableSwapConfigType, 'token' | 'quoteToken' | 'lpAddress'>

export function useStableFarms(): StableSwapConfig[] {
  const { chainId } = useActiveChainId()

  const { data: stableFarms = [] } = useSWRImmutable(chainId && ['stable-farms', chainId], async () => {
    const farms = await getStableConfig(chainId)

    return farms.map(({ token, quoteToken, lpAddress, ...rest }) => ({
      ...rest,
      liquidityToken: new ERC20Token(chainId, lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs'),
      token0: deserializeToken(token),
      token1: deserializeToken(quoteToken),
    }))
  })

  return stableFarms
}

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

export interface LPStablePair extends StableSwapConfig {
  reserve0: CurrencyAmount<Token>
  reserve1: CurrencyAmount<Token>
  getLiquidityValue: () => CurrencyAmount<Token>
}

export function useLPTokensWithBalanceByAccount(account) {
  const lpTokens = useStableSwapPairs()
  const { chainId } = useActiveChainId()

  const [stableBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    lpTokens.map(({ lpAddress }) => new ERC20Token(chainId, lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs')),
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

export const StableConfigContext = createContext<{
  stableSwapInfoContract: Contract
  stableSwapContract: Contract
  stableSwapLPContract: Contract
  stableSwapConfig: StableSwapConfig
} | null>(null)

export default function useStableConfig({ tokenA, tokenB }: { tokenA: Currency; tokenB: Currency }) {
  const stablePair = useFindStablePair({ tokenA, tokenB })
  const stableSwapContract = useContract(stablePair?.stableSwapAddress, stableSwapABI)
  const stableSwapInfoContract = useContract(stablePair?.infoStableSwapAddress, stableSwapInfoABI)
  const stableSwapLPContract = useContract(stablePair?.lpAddress, stableLPABI)

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
