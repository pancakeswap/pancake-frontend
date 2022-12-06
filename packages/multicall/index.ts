import { Interface } from '@ethersproject/abi'
import { CallOverrides, Contract } from '@ethersproject/contracts'
import { Provider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'
import multicallAbi from './Multicall.json'

export const multicallAddresses = {
  56: '0xcA11bde05977b3631167028862bE2a173976CA11',
  32520: '0x2490b172F7de4f518713fB03E6D3f57B558c9964',
  2000: '0x3d2e33eb61677869d87ac92d3c8891ec5c57fa5b',
  61916: '0xb999ea90607a826a3e6e6646b404c3c7d11fa39d',
  122: '0x43891084581fD07Ee1189f3a2f04e51c26a95B77',
  50: '0xf3a3dAf360161B2f10c645EF039C709A3Fd4Ea62',
}

export const getMulticallContract = (chainId: ChainId, provider) => {
  if (multicallAddresses[chainId]) {
    return new Contract(multicallAddresses[chainId], multicallAbi, provider)
  }
  return null
}

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
interface MulticallV2Params {
  abi: any[]
  calls: Call[]
  chainId: ChainId
  options?: MulticallOptions
  provider?: Provider
}

export interface CallV3 extends Call {
  abi: any[]
  allowFailure?: boolean
}

interface MulticallV3Params {
  calls: CallV3[]
  chainId: ChainId
  allowFailure?: boolean
  overrides?: CallOverrides
}

export type MultiCallV2 = <T = any>(params: MulticallV2Params) => Promise<T>
export type MultiCall = <T = any>(abi: any[], calls: Call[], chainId?: ChainId) => Promise<T>

export function createMulticall<TProvider>(provider: ({ chainId }: { chainId?: number | undefined }) => TProvider) {
  const multicall: MultiCall = async (abi: any[], calls: Call[], chainId: ChainId) => {
    const multi = getMulticallContract(chainId, provider({ chainId }))
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`)
    const itf = new Interface(abi)

    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
    const { returnData } = await multi.callStatic.aggregate(calldata)

    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

    return res as any
  }

  const multicallv2: MultiCallV2 = async ({ abi, calls, chainId, options, provider: _provider }) => {
    const { requireSuccess = true, ...overrides } = options || {}
    const multi = getMulticallContract(chainId, _provider || provider({ chainId }))
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`)
    const itf = new Interface(abi)

    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))

    const returnData = await multi.callStatic.tryAggregate(requireSuccess, calldata, overrides)
    const res = returnData.map((call, i) => {
      const [result, data] = call
      return result ? itf.decodeFunctionResult(calls[i].name, data) : null
    })

    return res as any
  }

  const multicallv3 = async ({ calls, chainId, allowFailure, overrides }: MulticallV3Params) => {
    const multi = getMulticallContract(chainId, provider({ chainId }))
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`)
    const _calls = calls.map(({ abi, address, name, params, allowFailure: _allowFailure }) => {
      const contract = new Contract(address, abi)
      const callData = contract.interface.encodeFunctionData(name, params ?? [])
      if (!contract[name]) console.error(`${name} missing on ${address}`)
      return {
        target: address,
        allowFailure: allowFailure || _allowFailure,
        callData,
      }
    })

    const result = await multi.callStatic.aggregate3([...[_calls], ...(overrides ? [overrides] : [])])

    return result.map((call, i) => {
      const { returnData, success } = call
      if (!success || returnData === '0x') return null
      const { address, abi, name } = calls[i]
      const contract = new Contract(address, abi)
      return contract.interface.decodeFunctionResult(name, returnData)
    })
  }

  return {
    multicall,
    multicallv2,
    multicallv3,
  }
}
