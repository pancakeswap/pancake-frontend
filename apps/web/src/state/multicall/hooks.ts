import { Abi } from 'abitype'
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
  Address,
  ContractFunctionResult,
  decodeFunctionResult,
  encodeFunctionData,
  GetFunctionArgs,
  Hex,
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

export interface CallStateResult extends ReadonlyArray<any> {
  readonly [key: string]: any
}

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any
}

type MethodArg = string | number | bigint
// type MethodArgs = Array<MethodArg | MethodArg[]>

type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined

// function isMethodArg(x: unknown): x is MethodArg {
//   return ['string', 'number'].indexOf(typeof x) !== -1
// }

// function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
//   return (
//     x === undefined ||
//     (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
//   )
// }

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

// Converts CallResult[] to CallState[], only updating if call states have changed.
// Ensures that CallState results remain referentially stable when unchanged, preventing
// spurious re-renders which would otherwise occur because mapping always creates a new object.
// export function useCallStates(
//   results: CallResult[],
//   abi: Abi | undefined,
//   fragment: ((i: number) => FunctionFragment | undefined) | FunctionFragment | undefined,
//   latestBlockNumber: number | undefined,
// ): CallState[] {
//   // Avoid refreshing the results with every changing block number (eg latestBlockNumber).
//   // Instead, only refresh the results if they need to be synced - if there is a result which is stale, for which blockNumber < latestBlockNumber.
//   const syncingBlockNumber = useMemo(() => {
//     const lowestBlockNumber = results.reduce<number | undefined>(
//       (memo, result) => (result.blockNumber ? Math.min(memo ?? result.blockNumber, result.blockNumber) : memo),
//       undefined,
//     )
//     return Math.max(lowestBlockNumber ?? 0, latestBlockNumber ?? 0)
//   }, [results, latestBlockNumber])

//   return useMemo(() => {
//     return results.map((result, i) => {
//       const resultFragment = typeof fragment === 'function' ? fragment(i) : fragment
//       return toCallState(result, contractInterface, resultFragment, syncingBlockNumber)
//     })
//   }, [contractInterface, fragment, results, syncingBlockNumber])
// }

function toCallState(
  callResult: CallResult | undefined,
  abi: Abi | unknown[],
  functionName: string,
  latestBlockNumber: number | undefined,
): CallState {
  if (!callResult) return INVALID_CALL_STATE
  const { valid, data, blockNumber } = callResult
  if (!valid) return INVALID_CALL_STATE
  if (valid && !blockNumber) return LOADING_CALL_STATE
  if (!functionName || !abi || !latestBlockNumber) return LOADING_CALL_STATE
  const success = data && data.length > 2
  const syncing = (blockNumber ?? 0) < latestBlockNumber
  let result: Result | undefined
  if (success && data) {
    try {
      // @ts-ignore FIXME: types
      result = decodeFunctionResult({
        // @ts-ignore FIXME: types
        abi,
        data,
        functionName,
      })
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

export function useSingleContractMultipleData(
  contract:
    | {
        abi?: any
        address?: Address
      }
    | null
    | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: ListenerOptions,
): CallState[] {
  const { chainId } = useActiveChainId()

  const calls = useMemo(
    () =>
      contract && contract.abi && contract.address && callInputs && callInputs.length > 0
        ? callInputs.map<Call>((inputs) => {
            return {
              address: contract.address,
              callData: encodeFunctionData({
                abi: contract.abi,
                functionName: methodName,
                args: inputs,
              }),
            }
          })
        : [],
    [callInputs, contract, methodName],
  )

  const results = useCallsData(calls, options)

  const { cache } = useSWRConfig()

  return useMemo(() => {
    const currentBlockNumber = cache.get(unstable_serialize(['blockNumber', chainId]))?.data
    return results.map((result) => toCallState(result, contract.abi, methodName, currentBlockNumber))
  }, [cache, chainId, results, contract.abi, methodName])
}

const DEFAULT_OPTIONS = {
  blocksPerFetch: undefined as number | undefined,
}

export function useMultipleContractSingleData<TAbi extends Abi | unknown[], TFunctionName extends string = string>(
  addresses: (Address | undefined)[],
  abi: TAbi,
  methodName: TFunctionName,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState<ContractFunctionResult<TAbi, TFunctionName>>[] {
  const { enabled, blocksPerFetch } = options ?? { enabled: true }
  const callData: Hex | undefined = useMemo(
    () =>
      abi && enabled
        ? // @ts-ignore FIXME: types
          encodeFunctionData({
            abi,
            functionName: methodName,
            args: callInputs,
          })
        : undefined,
    [abi, callInputs, enabled, methodName],
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
    return results.map((result) => toCallState(result, abi, methodName, currentBlockNumber))
  }, [cache, chainId, results, abi, methodName])
}

export function useSingleCallResult<TAbi extends Abi | unknown[], TFunctionName extends string = string>(
  contract: {
    abi?: TAbi
    address?: Address
  },
  methodName: TFunctionName,
  inputs?: GetFunctionArgs<TAbi, TFunctionName>['args'],
  options?: ListenerOptionsWithGas,
): CallState<ContractFunctionResult<TAbi, TFunctionName>> {
  const calls = useMemo<Call[]>(() => {
    return contract && contract.abi && contract.address
      ? [
          {
            address: contract.address,
            // @ts-ignore FIXME: types
            callData: encodeFunctionData({
              abi: contract.abi,
              // @ts-ignore FIXME: types
              args: inputs,
              functionName: methodName,
            }),
          },
        ]
      : []
  }, [contract, inputs, methodName])

  const result = useCallsData(calls, options)[0]

  const { cache } = useSWRConfig()
  const { chainId } = useActiveChainId()

  return useMemo(() => {
    const currentBlockNumber = cache.get(unstable_serialize(['blockNumber', chainId]))?.data
    return toCallState(result, contract?.abi, methodName, currentBlockNumber)
  }, [cache, chainId, result, contract?.abi, methodName])
}
