import { Currency, CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'
import { LegacyStableSwapPair } from '@pancakeswap/smart-router/legacy-router'
import { createContext, useContext, useMemo } from 'react'

import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { stableLPABI } from 'config/abi/stableLP'
import { stableSwapABI } from 'config/abi/stableSwapAbi'
import { useContract } from 'hooks/useContract'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { Address } from 'wagmi'

interface StableSwapConfigType extends LegacyStableSwapPair {
  liquidityToken: ERC20Token
  token0: Currency
  token1: Currency
}

export type StableSwapConfig = Omit<StableSwapConfigType, 'token' | 'quoteToken' | 'lpAddress'>

export interface LPStablePair extends StableSwapConfig {
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
  getLiquidityValue: () => CurrencyAmount<Currency>
}

function useFindStablePair({
  tokenA,
  tokenB,
}: {
  tokenA: Currency | undefined | null
  tokenB: Currency | undefined | null
}) {
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

function useStableSwapContract(address?: Address) {
  return useContract(address, stableSwapABI)
}

export type UseStableSwapInfoContract = ReturnType<typeof useStableSwapInfoContract>

function useStableSwapInfoContract(address?: Address) {
  return useContract(address, infoStableSwapABI)
}

function useStableSwapLPContract(address?: Address) {
  return useContract(address, stableLPABI)
}

export const StableConfigContext = createContext<{
  stableSwapInfoContract: UseStableSwapInfoContract
  stableSwapContract: ReturnType<typeof useStableSwapContract>
  stableSwapLPContract: ReturnType<typeof useStableSwapLPContract>
  stableSwapConfig?: StableSwapConfig
} | null>(null)

export const useStableConfigContext = () => {
  const context = useContext(StableConfigContext)
  if (!context) {
    throw new Error('useStableConfigContext must be used within a StableConfigProvider')
  }
  return context
}

export default function useStableConfig({
  tokenA,
  tokenB,
}: {
  tokenA: Currency | undefined | null
  tokenB: Currency | undefined | null
}) {
  const stablePair = useFindStablePair({ tokenA, tokenB })
  const stableSwapContract = useStableSwapContract(stablePair?.stableSwapAddress)
  const stableSwapInfoContract = useStableSwapInfoContract(stablePair?.infoStableSwapAddress)
  const stableSwapLPContract = useStableSwapLPContract(stablePair?.liquidityToken.address)

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
