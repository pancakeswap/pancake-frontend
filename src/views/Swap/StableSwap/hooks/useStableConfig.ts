import stableSwapConfigs from 'config/constants/stableSwapConfigs'
import { useContract } from 'hooks/useContract'
import stableSwapABI from 'config/abi/stableSwap.json'
import stableSwapInfoABI from 'config/abi/infoStableSwap.json'
import stableLPABI from 'config/abi/stableLP.json'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { createContext, useMemo } from 'react'

function findStablePair({ addressA, addressB }) {
  return stableSwapConfigs.find((stablePair) => {
    return (
      (stablePair?.token0?.address === addressA && stablePair?.token1?.address === addressB) ||
      (stablePair?.token1?.address === addressA && stablePair?.token0?.address === addressB)
    )
  })
}

export function useLPTokensWithBalanceByAccount(account) {
  const lpTokens = useMemo(
    () =>
      stableSwapConfigs.map(({ lpAddress, token0, token1 }) => ({
        liquidityToken: new Token(token0?.chainId, lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs'),
        token0,
        token1,
      })),
    [],
  )

  const [stableBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    lpTokens.map(({ liquidityToken }) => liquidityToken),
  )

  // fetch the reserves for all V2 pools in which the user has a balance
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

export default function useStableConfig({ addressA, addressB }) {
  const stablePair = useMemo(() => findStablePair({ addressA, addressB }), [addressA, addressB])
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
