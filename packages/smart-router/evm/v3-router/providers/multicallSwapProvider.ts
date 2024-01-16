/* eslint-disable camelcase, @typescript-eslint/no-non-null-assertion */
import { ChainId } from '@pancakeswap/chains'
import { multicallByGasLimit } from '@pancakeswap/multicall'
import { BigintIsh } from '@pancakeswap/sdk'
import stats from 'stats-lite'
import { PublicClient, decodeFunctionResult, encodeFunctionData } from 'viem'
import { AbortControl } from '@pancakeswap/utils/abortControl'

import IMulticallABI from '../../abis/InterfaceMulticall'
import {
  CallMultipleFunctionsOnSameContractParams,
  CallSameFunctionOnContractWithMultipleParams,
  CallSameFunctionOnMultipleContractsParams,
  IMulticallProvider,
  Result,
} from './multicallProvider'

export type PancakeMulticallConfig = {
  gasLimitPerCall?: BigintIsh

  // Total gas limit of the multicall happens in a single rpc call
  gasLimit?: BigintIsh

  gasBuffer?: BigintIsh

  dropUnexecutedCalls?: boolean
} & AbortControl

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

  constructor(
    protected chainId: ChainId,
    protected provider: PublicClient | undefined,
    protected gasLimitPerCall = 1_000_000,
  ) {
    super()
    this.provider = provider
  }

  public async callSameFunctionOnMultipleContracts<TFunctionParams extends any[] | undefined, TReturn = any>(
    params: CallSameFunctionOnMultipleContractsParams<TFunctionParams>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
    approxGasUsedPerFailCall: number
  }> {
    const { addresses, functionName, functionParams, abi, additionalConfig } = params
    const gasLimitPerCall = additionalConfig?.gasLimitPerCall ?? this.gasLimitPerCall

    const callData = encodeFunctionData({
      abi,
      functionName,
      args: functionParams,
    })

    const calls = addresses.map((address) => {
      return {
        target: address,
        callData,
        gasLimit: BigInt(gasLimitPerCall),
      }
    })

    // console.log({ calls }, `About to multicall for ${functionName} across ${addresses.length} addresses`)

    const { results: result, blockNumber } = await multicallByGasLimit(calls, {
      gasLimit: additionalConfig?.gasLimit,
      gasBuffer: additionalConfig?.gasBuffer,
      dropUnexecutedCalls: additionalConfig?.dropUnexecutedCalls,
      chainId: this.chainId,
      client: this.provider,
      signal: additionalConfig?.signal,
    })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    const gasUsedForFail: number[] = []
    for (const { result: callResult, success, gasUsed } of result) {
      if (callResult === '0x' || !success) {
        results.push({
          success: false,
          returnData: callResult,
        })
        gasUsedForFail.push(Number(gasUsed))
        continue
      }
      try {
        results.push({
          success: true,
          result: decodeFunctionResult({
            abi,
            functionName,
            data: callResult as `0x${string}`,
          }) as TReturn,
        })
        gasUsedForSuccess.push(Number(gasUsed))
      } catch (e) {
        results.push({
          success: false,
          returnData: callResult,
        })
      }
    }

    // console.log(
    //   { results },
    //   `Results for multicall on ${functionName} across ${addresses.length} addresses as of block ${blockNumber}`,
    // )
    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
      approxGasUsedPerFailCall: stats.percentile(gasUsedForFail, 99),
    }
  }

  public async callSameFunctionOnContractWithMultipleParams<TFunctionParams extends any[] | undefined, TReturn>(
    params: CallSameFunctionOnContractWithMultipleParams<TFunctionParams, PancakeMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
    approxGasUsedPerFailCall: number
  }> {
    const { address, functionName, functionParams, abi, additionalConfig } = params
    const gasLimitPerCall = additionalConfig?.gasLimitPerCall ?? this.gasLimitPerCall
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

    const { results: result, blockNumber } = await multicallByGasLimit(calls, {
      gasLimit: additionalConfig?.gasLimit,
      gasBuffer: additionalConfig?.gasBuffer,
      dropUnexecutedCalls: additionalConfig?.dropUnexecutedCalls,
      chainId: this.chainId,
      client: this.provider,
      signal: additionalConfig?.signal,
    })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    const gasUsedForFail: number[] = []
    for (const { result: callResult, success, gasUsed } of result) {
      if (callResult === '0x' || !success) {
        results.push({
          success: false,
          returnData: callResult,
        })
        gasUsedForFail.push(Number(gasUsed))
        continue
      }
      try {
        results.push({
          success: true,
          result: decodeFunctionResult({
            abi,
            functionName,
            data: callResult as `0x${string}`,
          }) as TReturn,
        })
        gasUsedForSuccess.push(Number(gasUsed))
      } catch (e) {
        results.push({
          success: false,
          returnData: callResult,
        })
      }
    }

    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
      approxGasUsedPerFailCall: stats.percentile(gasUsedForFail, 99),
    }
  }

  public async callMultipleFunctionsOnSameContract<TFunctionParams extends any[] | undefined, TReturn>(
    params: CallMultipleFunctionsOnSameContractParams<TFunctionParams, PancakeMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
    approxGasUsedPerFailCall: number
  }> {
    const { address, functionNames, functionParams, additionalConfig, abi } = params

    const gasLimitPerCall = additionalConfig?.gasLimitPerCall ?? this.gasLimitPerCall

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

    const { results: result, blockNumber } = await multicallByGasLimit(calls, {
      gasLimit: additionalConfig?.gasLimit,
      gasBuffer: additionalConfig?.gasBuffer,
      dropUnexecutedCalls: additionalConfig?.dropUnexecutedCalls,
      chainId: this.chainId,
      client: this.provider,
      signal: additionalConfig?.signal,
    })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    const gasUsedForFail: number[] = []
    for (const [i, { result: callResult, success, gasUsed }] of result.entries()) {
      if (callResult === '0x' || !success) {
        results.push({
          success: false,
          returnData: callResult,
        })
        gasUsedForFail.push(Number(gasUsed))
        continue
      }
      try {
        results.push({
          success: true,
          result: decodeFunctionResult({
            abi,
            functionName: functionNames[i],
            data: callResult as `0x${string}`,
          }) as TReturn,
        })
        gasUsedForSuccess.push(Number(gasUsed))
      } catch (e) {
        results.push({
          success: false,
          returnData: callResult,
        })
      }
    }

    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
      approxGasUsedPerFailCall: stats.percentile(gasUsedForFail, 99),
    }
  }
}
