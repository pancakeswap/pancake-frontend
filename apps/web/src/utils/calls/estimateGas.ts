import { SendTransactionResult } from 'wagmi/actions'
import { calculateGasMargin } from 'utils'
import { Abi, Account, Address, CallParameters, GetFunctionArgs, InferFunctionName } from 'viem'
import { Chain } from 'wagmi'

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param gasMarginPer10000 The gasMargin per 10000 (i.e. 10% -> 1000)
 * @param args An array of arguments to pass to the method
 */
export const estimateGas = async <
  TAbi extends Abi | unknown[],
  TFunctionName extends string = string,
  _FunctionName = InferFunctionName<TAbi, TFunctionName>,
  Args = TFunctionName extends string
    ? GetFunctionArgs<TAbi, TFunctionName>['args']
    : _FunctionName extends string
    ? GetFunctionArgs<TAbi, _FunctionName>['args']
    : never,
>(
  contract: { abi: TAbi; account: Account; chain: Chain; address: Address; write: any; estimateGas: any },
  methodName: _FunctionName,
  methodArgs: Args,
  overrides: Omit<CallParameters, 'chain' | 'to' | 'data'> = {},
  gasMarginPer10000: bigint,
) => {
  if (!contract.estimateGas[methodName]) {
    throw new Error(`Method ${methodName} doesn't exist on ${contract.address}`)
  }
  const rawGasEstimation = await contract.estimateGas[methodName](methodArgs, {
    value: 0n,
    account: contract.account,
    chain: contract.chain,
    ...overrides,
  })
  // By convention, BigNumber values are multiplied by 1000 to avoid dealing with real numbers
  const gasEstimation = calculateGasMargin(rawGasEstimation, gasMarginPer10000)
  return gasEstimation
}

/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method
 */
export const callWithEstimateGas = async <
  TAbi extends Abi | unknown[],
  TFunctionName extends string = string,
  _FunctionName = InferFunctionName<TAbi, TFunctionName>,
  Args = TFunctionName extends string
    ? GetFunctionArgs<TAbi, TFunctionName>['args']
    : _FunctionName extends string
    ? GetFunctionArgs<TAbi, _FunctionName>['args']
    : never,
>(
  contract: { abi: TAbi; account: Account; chain: Chain; address: Address; write: any; estimateGas: any },
  methodName: InferFunctionName<TAbi, TFunctionName>,
  methodArgs: Args,
  overrides: Omit<CallParameters, 'chain' | 'to' | 'data'> = {},
  gasMarginPer10000 = 1000n,
): Promise<SendTransactionResult> => {
  const gasEstimation = await estimateGas(contract, methodName, methodArgs, overrides, gasMarginPer10000)
  // @ts-ignore
  const tx = await contract.write[methodName](methodArgs, {
    value: 0n,
    gas: gasEstimation,
    account: contract.account,
    chain: contract.chain,
    ...overrides,
  })
  return {
    hash: tx,
  }
}
