import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { multicallReducerAtom } from 'state/multicall/reducer'
import {
  // eslint-disable-next-line camelcase
  unstable_serialize,
  useSWRConfig,
} from 'swr'
import {
  Abi,
  Address,
  ContractFunctionResult,
  DecodeFunctionDataParameters,
  decodeFunctionResult,
  encodeFunctionData,
  EncodeFunctionDataParameters,
  GetFunctionArgs,
  Hex,
  InferFunctionName,
} from 'viem'
import {
  addMulticallListeners,
  Call,
  ListenerOptions,
  ListenerOptionsWithGas,
  parseCallKey,
  removeMulticallListeners,
  toCallKey,
} from './actions'

type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

interface CallResult {
  readonly valid: boolean
  readonly data: Hex | undefined
  readonly blockNumber: number | undefined
}

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
}

// the lowest level call for subscribing to contract data
function useCallsData(calls: (Call | undefined)[], options?: ListenerOptions): CallResult[] {
  const { chainId } = useActiveChainId()
  const [{ callResults }, dispatch] = useAtom(multicallReducerAtom)

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? [],
      ),
    [calls],
  )

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys)
    if (!chainId || callKeys.length === 0) return undefined
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const calls = callKeys.map((key) => parseCallKey(key))
    dispatch(
      addMulticallListeners({
        chainId,
        calls,
        options,
      }),
    )

    return () => {
      dispatch(
        removeMulticallListeners({
          chainId,
          calls,
          options,
        }),
      )
    }
  }, [chainId, dispatch, options, serializedCallKeys])

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT

        const result = callResults[chainId]?.[toCallKey(call)]
        let data
        if (result?.data && result?.data !== '0x') {
          // eslint-disable-next-line prefer-destructuring
          data = result.data
        }

        return { valid: true, data, blockNumber: result?.blockNumber }
      }),
    [callResults, calls, chainId],
  )
}

export interface CallState<T = any> {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: T | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
  readonly blockNumber?: number
}

const INVALID_CALL_STATE: CallState = { valid: false, result: undefined, loading: false, syncing: false, error: false }
const LOADING_CALL_STATE: CallState = { valid: true, result: undefined, loading: true, syncing: true, error: false }

function toCallState<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
>(
  callResult: CallResult | undefined,
  abi: TAbi,
  functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>,
  latestBlockNumber: number | undefined,
): CallState<ContractFunctionResult<TAbi, TFunctionName>> {
  if (!callResult) return INVALID_CALL_STATE
  const { valid, data, blockNumber } = callResult
  if (!valid) return INVALID_CALL_STATE
  if (valid && !blockNumber) return LOADING_CALL_STATE
  if (!functionName || !abi || !latestBlockNumber) return LOADING_CALL_STATE
  const success = data && data.length > 2
  const syncing = (blockNumber ?? 0) < latestBlockNumber
  let result
  if (success && data) {
    try {
      result = decodeFunctionResult({
        abi,
        data,
        functionName,
      } as unknown as DecodeFunctionDataParameters)
    } catch (error) {
      console.debug('Result data parsing failed', abi, data)
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
        blockNumber,
      }
    }
  }

  return {
    valid: true,
    loading: false,
    syncing,
    result,
    error: !success,
    blockNumber,
  }
}

// export interface MultiContractsMultiMethodsCallInput {
//   contract: Contract | null | undefined
//   methodName: string
//   inputs?: OptionalMethodInputs
// }

// export function useMultiContractsMultiMethods(
//   callInputs: MultiContractsMultiMethodsCallInput[],
//   options?: ListenerOptions,
// ) {
//   const { chainId } = useActiveChainId()

//   const { calls, fragments, contracts } = useMemo(() => {
//     if (!callInputs || !callInputs.length) {
//       return { calls: [], fragments: [], contracts: [] }
//     }
//     const validFragments: FunctionFragment[] = []
//     const validContracts: Contract[] = []
//     const validCalls: Call[] = []
//     for (const { methodName, inputs, contract } of callInputs) {
//       const fragment = contract?.interface.getFunction(methodName)
//       if (!contract || !fragment) {
//         // eslint-disable-next-line no-continue
//         continue
//       }
//       validFragments.push(fragment)
//       validContracts.push(contract)
//       validCalls.push({
//         address: contract.address,
//         callData: contract.interface.encodeFunctionData(fragment, inputs),
//       })
//     }
//     return { calls: validCalls, fragments: validFragments, contracts: validContracts }
//   }, [callInputs])

//   const results = useCallsData(calls, options)

//   const { cache } = useSWRConfig()

//   return useMemo(() => {
//     const currentBlockNumber = cache.get(unstable_serialize(['blockNumber', chainId]))?.data
//     return results.map((result, i) => toCallState(result, contracts[i]?.interface, fragments[i], currentBlockNumber))
//   }, [cache, chainId, results, fragments, contracts])
// }

export type SingleContractMultipleDataCallParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  contract: {
    abi?: TAbi
    address?: Address
  }
  functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>
  options?: ListenerOptionsWithGas
  args: GetFunctionArgs<TAbi, TFunctionName>['args'][]
}

export function useSingleContractMultipleData<TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  contract,
  args,
  functionName,
  options,
}: SingleContractMultipleDataCallParameters<TAbi, TFunctionName>): CallState<
  ContractFunctionResult<TAbi, TFunctionName>
>[] {
  const { chainId } = useActiveChainId()

  const calls = useMemo(
    () =>
      contract && contract.abi && contract.address && args && args.length > 0
        ? args.map<Call>((inputs) => {
            return {
              address: contract.address,
              callData: encodeFunctionData({
                abi: contract.abi,
                functionName,
                args: inputs,
              } as unknown as EncodeFunctionDataParameters),
            }
          })
        : [],
    [args, contract, functionName],
  )

  const results = useCallsData(calls, options)

  const { cache } = useSWRConfig()

  return useMemo(() => {
    const currentBlockNumber = cache.get(unstable_serialize(['blockNumber', chainId]))?.data
    return results.map((result) => toCallState(result, contract.abi, functionName, currentBlockNumber))
  }, [cache, chainId, results, contract.abi, functionName])
}

const DEFAULT_OPTIONS = {
  blocksPerFetch: undefined as number | undefined,
}

export type MultipleSameDataCallParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  addresses: (Address | undefined)[]
  abi: TAbi
  functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>
  options?: ListenerOptionsWithGas
} & GetFunctionArgs<TAbi, TFunctionName>

export function useMultipleContractSingleData<TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  abi,
  addresses,
  functionName,
  args,
  options,
}: MultipleSameDataCallParameters<TAbi, TFunctionName>): CallState<ContractFunctionResult<TAbi, TFunctionName>>[] {
  const { enabled, blocksPerFetch } = options ?? { enabled: true }
  const callData: Hex | undefined = useMemo(
    () =>
      abi && enabled
        ? encodeFunctionData({
            abi,
            functionName,
            args,
          } as unknown as EncodeFunctionDataParameters)
        : undefined,
    [abi, args, enabled, functionName],
  )

  const calls = useMemo(
    () =>
      addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                }
              : undefined
          })
        : [],
    [addresses, callData],
  )

  const results = useCallsData(calls, options?.blocksPerFetch ? { blocksPerFetch } : DEFAULT_OPTIONS)
  const { chainId } = useActiveChainId()

  const { cache } = useSWRConfig()

  return useMemo(() => {
    const currentBlockNumber = cache.get(unstable_serialize(['blockNumber', chainId]))?.data
    return results.map((result) => toCallState(result, abi, functionName, currentBlockNumber))
  }, [cache, chainId, results, abi, functionName])
}

export type SingleCallParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  contract: {
    abi?: TAbi
    address?: Address
  }
  functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>
  options?: ListenerOptionsWithGas
} & GetFunctionArgs<TAbi, TFunctionName>

export function useSingleCallResult<TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  contract,
  functionName,
  args,
  options,
}: SingleCallParameters<TAbi, TFunctionName>): CallState<ContractFunctionResult<TAbi, TFunctionName>> {
  const calls = useMemo<Call[]>(() => {
    return contract && contract.abi && contract.address
      ? [
          {
            address: contract.address,
            callData: encodeFunctionData({
              abi: contract.abi,
              args,
              functionName,
            } as unknown as EncodeFunctionDataParameters),
          },
        ]
      : []
  }, [contract, args, functionName])

  const result = useCallsData(calls, options)[0]

  const { cache } = useSWRConfig()
  const { chainId } = useActiveChainId()

  return useMemo(() => {
    const currentBlockNumber = cache.get(unstable_serialize(['blockNumber', chainId]))?.data
    return toCallState(result, contract?.abi, functionName, currentBlockNumber)
  }, [cache, chainId, result, contract?.abi, functionName])
}
