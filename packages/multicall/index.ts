import { Interface } from '@ethersproject/abi'
import { CallOverrides, Contract } from '@ethersproject/contracts'
import { ChainId } from '@pancakeswap/sdk'
import multicallAbi from './Multicall.json'

const multicallAddresses = {
  1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  4: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  5: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  56: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
  97: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
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
  chainId?: ChainId
  options?: MulticallOptions
}

export type MultiCallV2 = <T = any>(params: MulticallV2Params) => Promise<T>
export type MultiCall = <T = any>(abi: any[], calls: Call[], chainId?: ChainId) => Promise<T>

export function createMulticall<TProvider>(provider: ({ chainId }: { chainId?: number | undefined }) => TProvider) {
  const multicall: MultiCall = async (abi: any[], calls: Call[], chainId = ChainId.BSC) => {
    const multi = getMulticallContract(chainId, provider({ chainId }))
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`)
    const itf = new Interface(abi)

    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
    const { returnData } = await multi.aggregate(calldata)

    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

    return res as any
  }

  const multicallv2: MultiCallV2 = async ({ abi, calls, chainId = ChainId.BSC, options }) => {
    const { requireSuccess = true, ...overrides } = options || {}
    const multi = getMulticallContract(chainId, provider({ chainId }))
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`)
    const itf = new Interface(abi)

    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))

    const returnData = await multi.tryAggregate(requireSuccess, calldata, overrides)
    const res = returnData.map((call, i) => {
      const [result, data] = call
      return result ? itf.decodeFunctionResult(calls[i].name, data) : null
    })

    return res as any
  }

  return {
    multicall,
    multicallv2,
  }
}
