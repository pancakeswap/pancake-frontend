import { useMemo } from 'react'
import { Percent } from '@pancakeswap/sdk'

import StableSwapABI from 'config/abi/stableSwap.json'
import LPTokenABI from 'config/abi/lpToken.json'
import { useContract } from 'hooks/useContract'
import { Address, useContractReads } from 'wagmi'
import { stableSwapABI } from 'config/abi/stableSwapAbi'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { useActiveChainId } from './useActiveChainId'

// function parseCallStates(states: CallState[]) {
//   let balance0: bigint | undefined
//   let balance1: bigint | undefined
//   let amplifier: bigint | undefined
//   let totalSupply: bigint | undefined
//   let feeNumerator: bigint | undefined
//   let feeDenominator: bigint | undefined
//   let loading = false
//   let error = false
//   let valid = true
//   for (const [i, { result, loading: resultLoading, syncing, error: resultError }] of states.entries()) {
//     // Should match info inputs
//     switch (i) {
//       case 0:
//         balance0 = result && BigInt(result[0].toString())
//         break
//       case 1:
//         balance1 = result && BigInt(result[0].toString())
//         break
//       case 2:
//         amplifier = result && BigInt(result[0].toString())
//         break
//       case 3:
//         totalSupply = result && BigInt(result[0].toString())
//         break
//       case 4:
//         feeNumerator = result && BigInt(result[0].toString())
//         break
//       case 5:
//         feeDenominator = result && BigInt(result[0].toString())
//         break
//       default:
//         break
//     }
//     valid = valid && result?.resultValid
//     loading = loading || resultLoading || syncing
//     error = error || resultError
//   }
//   return {
//     balances: [balance0, balance1],
//     amplifier,
//     totalSupply,
//     fee: feeNumerator && feeDenominator && new Percent(feeNumerator, feeDenominator),
//     valid,
//     error,
//     loading,
//   }
// }

export function useStableSwapInfo(stableSwapAddress: Address | undefined, lpAddress: Address | undefined) {
  const { chainId } = useActiveChainId()
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

  const { data: results, isLoading } = useContractReads({
    watch: true,
    enabled: Boolean(stableSwapAddress && lpAddress),
    contracts: [
      {
        chainId,
        abi: stableSwapABI,
        address: stableSwapAddress,
        functionName: 'balances',
        args: [0n],
      },
      {
        chainId,
        abi: stableSwapABI,
        address: stableSwapAddress,
        functionName: 'balances',
        args: [1n],
      },
      {
        chainId,
        abi: stableSwapABI,
        address: stableSwapAddress,
        functionName: 'A',
      },
      {
        chainId,
        abi: lpTokenABI,
        address: lpAddress,
        functionName: 'totalSupply',
      },
      {
        chainId,
        abi: stableSwapABI,
        address: stableSwapAddress,
        functionName: 'fee',
      },
      {
        chainId,
        abi: stableSwapABI,
        address: stableSwapAddress,
        functionName: 'FEE_DENOMINATOR',
      },
    ],
  })

  const feeNumerator = results[4]?.result
  const feeDenominator = results[5]?.result

  return {
    balances: [results[0].result, results[1].result],
    amplifier: results[2].result,
    totalSupply: results[3].result,
    fee: feeNumerator && feeDenominator && new Percent(feeNumerator, feeDenominator),
    loading: isLoading,
  }
}
