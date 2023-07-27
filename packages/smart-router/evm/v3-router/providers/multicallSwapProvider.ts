/* eslint-disable no-console, camelcase, @typescript-eslint/no-non-null-assertion */
import { ChainId } from '@pancakeswap/sdk'
import { encodeFunctionData, PublicClient, decodeFunctionResult, Address } from 'viem'
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
  [ChainId.ARBITRUM_ONE]: '0xac1cE734566f390A94b00eb9bf561c2625BF44ea',
  [ChainId.ARBITRUM_GOERLI]: '0x7a7e95c0b4d0Be710648C6f773ad0499923560bA',
  [ChainId.POLYGON_ZKEVM]: '0xac1cE734566f390A94b00eb9bf561c2625BF44ea',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x5DCC00121b4a481D8EDF9782Df6c6CF398AF20B8',
  [ChainId.ZKSYNC]: '0x2a76b93B9Cd441AE8aDA529e0e95826e00556351',
  [ChainId.ZKSYNC_TESTNET]: '0xA47DDFb5D068bFaa8ceb7476A60d5C3Fb87E58D9',
  [ChainId.LINEA_TESTNET]: '0x32226588378236Fd0c7c4053999F88aC0e5cAc77',
} as const satisfies Record<ChainId, Address>

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
