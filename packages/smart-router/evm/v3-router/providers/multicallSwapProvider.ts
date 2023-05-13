/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChainId } from '@pancakeswap/sdk'
import { encodeFunctionData, PublicClient, decodeFunctionResult } from 'viem'
import stats from 'stats-lite'

import IMulticallABI from '../../abis/InterfaceMulticall'
import {
  CallMultipleFunctionsOnSameContractParams,
  CallSameFunctionOnContractWithMultipleParams,
  CallSameFunctionOnMultipleContractsParams,
  IMulticallProvider,
  Result,
} from './multicallProvider'

const PANCAKE_MULTICALL_ADDRESSES = {
  [ChainId.ETHEREUM]: '0xac1cE734566f390A94b00eb9bf561c2625BF44ea',
  [ChainId.GOERLI]: '0x3D00CdB4785F0ef20C903A13596e0b9B2c652227',
  [ChainId.BSC]: '0xac1cE734566f390A94b00eb9bf561c2625BF44ea',
  [ChainId.BSC_TESTNET]: '0x3D00CdB4785F0ef20C903A13596e0b9B2c652227',
} as const

export type PancakeMulticallConfig = {
  gasLimitPerCallOverride?: number
}

function isPromise<T>(p: any): p is Promise<T> {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true
  }

  return false
}

/**
 * The PancakeswapMulticall contract has added functionality for limiting the amount of gas
 * that each call within the multicall can consume. This is useful for operations where
 * a call could consume such a large amount of gas that it causes the node to error out
 * with an out of gas error.
 *
 * @export
 * @class PancakeMulticallProvider
 */
export class PancakeMulticallProvider extends IMulticallProvider<PancakeMulticallConfig> {
  static abi = IMulticallABI

  constructor(protected chainId: ChainId, protected provider: PublicClient, protected gasLimitPerCall = 1_000_000) {
    super()
    const multicallAddress = PANCAKE_MULTICALL_ADDRESSES[this.chainId]

    if (!multicallAddress) {
      throw new Error(`No address for Pancakeswap Multicall Contract on chain id: ${chainId}`)
    }

    this.provider = provider
  }

  public async callSameFunctionOnMultipleContracts<TFunctionParams extends any[] | undefined, TReturn = any>(
    params: CallSameFunctionOnMultipleContractsParams<TFunctionParams>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
  }> {
    const { addresses, functionName, functionParams, providerConfig, abi } = params

    const blockNumberOverride = providerConfig?.blockNumber ?? undefined

    const callData = encodeFunctionData({
      abi,
      functionName,
      args: functionParams,
    })

    const calls = addresses.map((address) => {
      return {
        target: address,
        callData,
        gasLimit: BigInt(this.gasLimitPerCall),
      }
    })

    // console.log({ calls }, `About to multicall for ${functionName} across ${addresses.length} addresses`)

    const {
      result: [blockNumber, aggregateResults],
    } = await this.provider.simulateContract({
      abi: IMulticallABI,
      address: PANCAKE_MULTICALL_ADDRESSES[this.chainId],
      functionName: 'multicall',
      args: [calls],
      blockNumber: blockNumberOverride
        ? isPromise(blockNumberOverride)
          ? BigInt(Number(await blockNumberOverride))
          : BigInt(Number(blockNumberOverride))
        : undefined,
    })

    // const { blockNumber, returnData: aggregateResults } = await this.multicallContract.callStatic.multicall(calls, {
    //   blockTag: blockNumberOverride && JSBI.toNumber(JSBI.BigInt(blockNumberOverride)),
    // })

    const results: Result<TReturn>[] = []

    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData } = aggregateResults[i]!

      // Return data "0x" is sometimes returned for invalid calls.
      if (!success || returnData.length <= 2) {
        // console.log(
        //   { result: aggregateResults[i] },
        //   `Invalid result calling ${functionName} on address ${addresses[i]}`,
        // )
        results.push({
          success: false,
          returnData,
        })
        continue
      }

      results.push({
        success: true,
        result: decodeFunctionResult({
          abi,
          functionName,
          data: returnData,
        }) as TReturn,
      })
    }

    // console.log(
    //   { results },
    //   `Results for multicall on ${functionName} across ${addresses.length} addresses as of block ${blockNumber}`,
    // )

    return { blockNumber, results }
  }

  public async callSameFunctionOnContractWithMultipleParams<TFunctionParams extends any[] | undefined, TReturn>(
    params: CallSameFunctionOnContractWithMultipleParams<TFunctionParams, PancakeMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
  }> {
    const { address, functionName, functionParams, additionalConfig, providerConfig, abi } = params

    const gasLimitPerCall = additionalConfig?.gasLimitPerCallOverride ?? this.gasLimitPerCall
    const blockNumberOverride = providerConfig?.blockNumber ?? undefined

    const calls = functionParams.map((functionParam) => {
      const callData = encodeFunctionData({
        abi,
        functionName,
        args: functionParam,
      })

      return {
        target: address,
        callData,
        gasLimit: BigInt(gasLimitPerCall),
      }
    })

    // console.log(
    //   { calls },
    //   `About to multicall for ${functionName} at address ${address} with ${functionParams.length} different sets of params`,
    // )

    const {
      result: [blockNumber, aggregateResults],
    } = await this.provider.simulateContract({
      abi: IMulticallABI,
      address: PANCAKE_MULTICALL_ADDRESSES[this.chainId],
      functionName: 'multicall',
      args: [calls],
      blockNumber: blockNumberOverride ? BigInt(Number(blockNumberOverride)) : undefined,
    })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData, gasUsed } = aggregateResults[i]!

      // Return data "0x" is sometimes returned for invalid pools.
      if (!success || returnData.length <= 2) {
        // console.log(
        //   { result: aggregateResults[i] },
        //   `Invalid result calling ${functionName} with params ${functionParams[i]}`,
        // )
        results.push({
          success: false,
          returnData,
        })
        continue
      }

      gasUsedForSuccess.push(Number(gasUsed))

      results.push({
        success: true,
        result: decodeFunctionResult({
          abi,
          functionName,
          data: returnData,
        }) as TReturn,
      })
    }

    // console.log(
    //   { results, functionName, address },
    //   `Results for multicall for ${functionName} at address ${address} with ${functionParams.length} different sets of params. Results as of block ${blockNumber}`,
    // )
    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
    }
  }

  public async callMultipleFunctionsOnSameContract<TFunctionParams extends any[] | undefined, TReturn>(
    params: CallMultipleFunctionsOnSameContractParams<TFunctionParams, PancakeMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
  }> {
    const { address, functionNames, functionParams, additionalConfig, providerConfig, abi } = params

    const gasLimitPerCall = additionalConfig?.gasLimitPerCallOverride ?? this.gasLimitPerCall
    const blockNumberOverride = providerConfig?.blockNumber ?? undefined

    const calls = functionNames.map((functionName, i) => {
      const callData = encodeFunctionData({
        abi,
        functionName,
        args: functionParams ? functionParams[i] : [],
      })

      return {
        target: address,
        callData,
        gasLimit: BigInt(gasLimitPerCall),
      }
    })

    // console.log(
    //   { calls },
    //   `About to multicall for ${functionNames.length} functions at address ${address} with ${functionParams?.length} different sets of params`,
    // )

    const {
      result: [blockNumber, aggregateResults],
    } = await this.provider.simulateContract({
      abi: IMulticallABI,
      address: PANCAKE_MULTICALL_ADDRESSES[this.chainId],
      functionName: 'multicall',
      args: [calls],
      blockNumber: blockNumberOverride ? BigInt(Number(blockNumberOverride)) : undefined,
    })
    // const { blockNumber, returnData: aggregateResults } = await this.multicallContract.callStatic.multicall(calls, {
    //   blockTag: blockNumberOverride && JSBI.toNumber(JSBI.BigInt(blockNumberOverride)),
    // })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData, gasUsed } = aggregateResults[i]!

      // Return data "0x" is sometimes returned for invalid pools.
      if (!success || returnData.length <= 2) {
        // console.log(
        //   { result: aggregateResults[i] },
        //   `Invalid result calling ${functionNames[i]} with ${functionParams ? functionParams[i] : '0'} params`,
        // )
        results.push({
          success: false,
          returnData,
        })
        continue
      }

      gasUsedForSuccess.push(Number(gasUsed))

      results.push({
        success: true,
        result: decodeFunctionResult({
          abi,
          data: returnData,
          functionName: functionNames[i]!,
        }) as TReturn,
      })
    }

    // console.log(
    //   { results, functionNames, address },
    //   `Results for multicall for ${functionNames.length} functions at address ${address} with ${functionParams ? functionParams.length : ' 0'
    //   } different sets of params. Results as of block ${blockNumber}`,
    // )
    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
    }
  }
}
