import { useMemo } from 'react'
import { JSBI, Percent } from '@pancakeswap/sdk'

import StableSwapABI from 'config/abi/stableSwap.json'
import LPTokenABI from 'config/abi/lpToken.json'
import { useContract } from 'hooks/useContract'
import { useMultiContractsMultiMethods, CallState } from 'state/multicall/hooks'

function parseCallStates(states: CallState[]) {
  let balance0: JSBI | undefined
  let balance1: JSBI | undefined
  let amplifier: JSBI | undefined
  let totalSupply: JSBI | undefined
  let feeNumerator: JSBI | undefined
  let feeDenominator: JSBI | undefined
  let loading = false
  let error = false
  let valid = true
  for (const [i, { result, loading: resultLoading, syncing, error: resultError }] of states.entries()) {
    // Should match info inputs
    switch (i) {
      case 0:
        balance0 = result && JSBI.BigInt(result[0].toString())
        break
      case 1:
        balance1 = result && JSBI.BigInt(result[0].toString())
        break
      case 2:
        amplifier = result && JSBI.BigInt(result[0].toString())
        break
      case 3:
        totalSupply = result && JSBI.BigInt(result[0].toString())
        break
      case 4:
        feeNumerator = result && JSBI.BigInt(result[0].toString())
        break
      case 5:
        feeDenominator = result && JSBI.BigInt(result[0].toString())
        break
      default:
        break
    }
    valid = valid && result?.resultValid
    loading = loading || resultLoading || syncing
    error = error || resultError
  }
  return {
    balances: [balance0, balance1],
    amplifier,
    totalSupply,
    fee: feeNumerator && feeDenominator && new Percent(feeNumerator, feeDenominator),
    valid,
    error,
    loading,
  }
}

export function useStableSwapInfo(stableSwapAddress: string | undefined, lpAddress: string | undefined) {
  const stableSwapContract = useContract(stableSwapAddress, StableSwapABI)
  const lpTokenContract = useContract(lpAddress, LPTokenABI)
  const inputs = useMemo(
    () => [
      {
        contract: stableSwapContract,
        methodName: 'balances',
        inputs: [0],
      },
      {
        contract: stableSwapContract,
        methodName: 'balances',
        inputs: [1],
      },
      {
        contract: stableSwapContract,
        methodName: 'A',
      },
      {
        contract: lpTokenContract,
        methodName: 'totalSupply',
      },
      {
        contract: stableSwapContract,
        methodName: 'fee',
      },
      {
        contract: stableSwapContract,
        methodName: 'FEE_DENOMINATOR',
      },
    ],
    [stableSwapContract, lpTokenContract],
  )

  const results = useMultiContractsMultiMethods(inputs)

  return useMemo(() => parseCallStates(results), [results])
}
