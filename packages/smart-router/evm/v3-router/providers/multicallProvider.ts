import { BigintIsh } from '@pancakeswap/sdk'
import { Abi, Address } from 'viem'

export type ProviderConfig = {
  /**
   * The block number to use when getting data on-chain.
   */
  blockNumber?: BigintIsh | Promise<BigintIsh>
}

export type CallSameFunctionOnMultipleContractsParams<TFunctionParams, TAdditionalConfig = any> = {
  addresses: Address[]
  abi: Abi
  functionName: string
  functionParams?: TFunctionParams
  providerConfig?: ProviderConfig
  additionalConfig?: TAdditionalConfig
}

export type CallSameFunctionOnContractWithMultipleParams<TFunctionParams, TAdditionalConfig = any> = {
  address: Address
  abi: Abi
  functionName: string
  functionParams: TFunctionParams[]
  providerConfig?: ProviderConfig
  additionalConfig?: TAdditionalConfig
}

export type CallMultipleFunctionsOnSameContractParams<TFunctionParams, TAdditionalConfig = any> = {
  address: Address
  abi: Abi
  functionNames: string[]
  functionParams?: TFunctionParams[]
  providerConfig?: ProviderConfig
  additionalConfig?: TAdditionalConfig
}

export type SuccessResult<TReturn> = {
  success: true
  result: TReturn
}

export type FailResult = {
  success: false
  returnData: string
}

export type Result<TReturn> = SuccessResult<TReturn> | FailResult

/**
 * Provider for fetching data on chain using multicall contracts.
 *
 * @export
 * @abstract
 * @class IMulticallProvider
 * @template TMulticallConfig
 */
export abstract class IMulticallProvider<TMulticallConfig = any> {
  /**
   * Calls the same function on multiple contracts.
   *
   * For example, if you wanted to get the ERC-20 balance of 10 different tokens
   * this can be used to call balance on the 10 contracts in a single multicall.
   *
   * @abstract
   * @template TFunctionParams
   * @template TReturn
   * @param params
   * @returns {*}
   */
  public abstract callSameFunctionOnMultipleContracts<TFunctionParams extends any[] | undefined, TReturn = any>(
    params: CallSameFunctionOnMultipleContractsParams<TFunctionParams, TMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
  }>

  /**
   * Calls a function on a single contract with different parameters.
   *
   * For example, if you wanted to call the Pancakeswap V3 Quoter with 10 different
   * swap amounts this can be used to make the calls in a single multicall.
   *
   * @abstract
   * @template TFunctionParams
   * @template TReturn
   * @param params
   * @returns {*}
   */
  public abstract callSameFunctionOnContractWithMultipleParams<
    TFunctionParams extends any[] | undefined,
    TReturn = any,
  >(
    params: CallSameFunctionOnContractWithMultipleParams<TFunctionParams, TMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
  }>

  public abstract callMultipleFunctionsOnSameContract<TFunctionParams extends any[] | undefined, TReturn = any>(
    params: CallMultipleFunctionsOnSameContractParams<TFunctionParams, TMulticallConfig>,
  ): Promise<{
    blockNumber: bigint
    results: Result<TReturn>[]
  }>
}
