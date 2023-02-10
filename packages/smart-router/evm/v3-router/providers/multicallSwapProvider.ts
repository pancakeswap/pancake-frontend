/* eslint-disable no-console, camelcase, @typescript-eslint/no-non-null-assertion */
import { JSBI, ChainId } from '@pancakeswap/sdk'
import { BaseProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import map from 'lodash/map'
import stats from 'stats-lite'

import { InterfaceMulticall } from '../../abis/types'
import IMulticallABI from '../../abis/InterfaceMulticall.json'
import {
  CallMultipleFunctionsOnSameContractParams,
  CallSameFunctionOnContractWithMultipleParams,
  CallSameFunctionOnMultipleContractsParams,
  IMulticallProvider,
  Result,
} from './multicallProvider'

const UNISWAP_MULTICALL_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.GOERLI]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.BSC]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.BSC_TESTNET]: '0x1F98415757620B543A52E61c46B32eB19261F984',
}

export type UniswapMulticallConfig = {
  gasLimitPerCallOverride?: number
}

/**
 * The UniswapMulticall contract has added functionality for limiting the amount of gas
 * that each call within the multicall can consume. This is useful for operations where
 * a call could consume such a large amount of gas that it causes the node to error out
 * with an out of gas error.
 *
 * @export
 * @class UniswapMulticallProvider
 */
export class UniswapMulticallProvider extends IMulticallProvider<UniswapMulticallConfig> {
  private multicallContract: InterfaceMulticall

  constructor(protected chainId: ChainId, protected provider: BaseProvider, protected gasLimitPerCall = 1_000_000) {
    super()
    const multicallAddress = UNISWAP_MULTICALL_ADDRESSES[this.chainId]

    if (!multicallAddress) {
      throw new Error(`No address for Uniswap Multicall Contract on chain id: ${chainId}`)
    }

    this.multicallContract = new Contract(multicallAddress, IMulticallABI, this.provider) as InterfaceMulticall
  }

  public async callSameFunctionOnMultipleContracts<TFunctionParams extends any[] | undefined, TReturn = any>(
    params: CallSameFunctionOnMultipleContractsParams<TFunctionParams>,
  ): Promise<{
    blockNumber: JSBI
    results: Result<TReturn>[]
  }> {
    const { addresses, contractInterface, functionName, functionParams, providerConfig } = params

    const blockNumberOverride = providerConfig?.blockNumber ?? undefined

    const fragment = contractInterface.getFunction(functionName)
    const callData = contractInterface.encodeFunctionData(fragment, functionParams)

    const calls = map(addresses, (address) => {
      return {
        target: address,
        callData,
        gasLimit: this.gasLimitPerCall,
      }
    })

    console.log({ calls }, `About to multicall for ${functionName} across ${addresses.length} addresses`)

    const { blockNumber, returnData: aggregateResults } = await this.multicallContract.callStatic.multicall(calls, {
      blockTag: blockNumberOverride,
    })

    const results: Result<TReturn>[] = []

    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData } = aggregateResults[i]!

      // Return data "0x" is sometimes returned for invalid calls.
      if (!success || returnData.length <= 2) {
        console.log(
          { result: aggregateResults[i] },
          `Invalid result calling ${functionName} on address ${addresses[i]}`,
        )
        results.push({
          success: false,
          returnData,
        })
        continue
      }

      results.push({
        success: true,
        result: contractInterface.decodeFunctionResult(fragment, returnData) as unknown as TReturn,
      })
    }

    console.log(
      { results },
      `Results for multicall on ${functionName} across ${addresses.length} addresses as of block ${blockNumber}`,
    )

    return { blockNumber: JSBI.BigInt(blockNumber), results }
  }

  public async callSameFunctionOnContractWithMultipleParams<TFunctionParams extends any[] | undefined, TReturn>(
    params: CallSameFunctionOnContractWithMultipleParams<TFunctionParams, UniswapMulticallConfig>,
  ): Promise<{
    blockNumber: JSBI
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
  }> {
    const { address, contractInterface, functionName, functionParams, additionalConfig, providerConfig } = params
    const fragment = contractInterface.getFunction(functionName)

    const gasLimitPerCall = additionalConfig?.gasLimitPerCallOverride ?? this.gasLimitPerCall
    const blockNumberOverride = providerConfig?.blockNumber ?? undefined

    const calls = map(functionParams, (functionParam) => {
      const callData = contractInterface.encodeFunctionData(fragment, functionParam)

      return {
        target: address,
        callData,
        gasLimit: gasLimitPerCall,
      }
    })

    console.log(
      { calls },
      `About to multicall for ${functionName} at address ${address} with ${functionParams.length} different sets of params`,
    )

    const { blockNumber, returnData: aggregateResults } = await this.multicallContract.callStatic.multicall(calls, {
      blockTag: blockNumberOverride,
    })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    for (let i = 0; i < aggregateResults.length; i++) {
      const { success, returnData, gasUsed } = aggregateResults[i]!

      // Return data "0x" is sometimes returned for invalid pools.
      if (!success || returnData.length <= 2) {
        console.log(
          { result: aggregateResults[i] },
          `Invalid result calling ${functionName} with params ${functionParams[i]}`,
        )
        results.push({
          success: false,
          returnData,
        })
        continue
      }

      gasUsedForSuccess.push(gasUsed.toNumber())

      results.push({
        success: true,
        result: contractInterface.decodeFunctionResult(fragment, returnData) as unknown as TReturn,
      })
    }

    console.log(
      { results, functionName, address },
      `Results for multicall for ${functionName} at address ${address} with ${functionParams.length} different sets of params. Results as of block ${blockNumber}`,
    )
    return {
      blockNumber: JSBI.BigInt(blockNumber),
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
    }
  }

  public async callMultipleFunctionsOnSameContract<TFunctionParams extends any[] | undefined, TReturn>(
    params: CallMultipleFunctionsOnSameContractParams<TFunctionParams, UniswapMulticallConfig>,
  ): Promise<{
    blockNumber: JSBI
    results: Result<TReturn>[]
    approxGasUsedPerSuccessCall: number
  }> {
    const { address, contractInterface, functionNames, functionParams, additionalConfig, providerConfig } = params

    const gasLimitPerCall = additionalConfig?.gasLimitPerCallOverride ?? this.gasLimitPerCall
    const blockNumberOverride = providerConfig?.blockNumber ?? undefined

    const calls = map(functionNames, (functionName, i) => {
      const fragment = contractInterface.getFunction(functionName)
      const param = functionParams ? functionParams[i] : []
      const callData = contractInterface.encodeFunctionData(fragment, param)
      return {
        target: address,
        callData,
        gasLimit: gasLimitPerCall,
      }
    })

    console.log(
      { calls },
      `About to multicall for ${functionNames.length} functions at address ${address} with ${functionParams?.length} different sets of params`,
    )

    const { blockNumber, returnData: aggregateResults } = await this.multicallContract.callStatic.multicall(calls, {
      blockTag: blockNumberOverride,
    })

    const results: Result<TReturn>[] = []

    const gasUsedForSuccess: number[] = []
    for (let i = 0; i < aggregateResults.length; i++) {
      const fragment = contractInterface.getFunction(functionNames[i]!)
      const { success, returnData, gasUsed } = aggregateResults[i]!

      // Return data "0x" is sometimes returned for invalid pools.
      if (!success || returnData.length <= 2) {
        console.log(
          { result: aggregateResults[i] },
          `Invalid result calling ${functionNames[i]} with ${functionParams ? functionParams[i] : '0'} params`,
        )
        results.push({
          success: false,
          returnData,
        })
        continue
      }

      gasUsedForSuccess.push(gasUsed.toNumber())

      results.push({
        success: true,
        result: contractInterface.decodeFunctionResult(fragment, returnData) as unknown as TReturn,
      })
    }

    console.log(
      { results, functionNames, address },
      `Results for multicall for ${functionNames.length} functions at address ${address} with ${
        functionParams ? functionParams.length : ' 0'
      } different sets of params. Results as of block ${blockNumber}`,
    )
    return {
      blockNumber: JSBI.BigInt(blockNumber),
      results,
      approxGasUsedPerSuccessCall: stats.percentile(gasUsedForSuccess, 99),
    }
  }
}
