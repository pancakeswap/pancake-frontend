import { ChainId } from '@pancakeswap/sdk'
import { Address, Chain, FallbackTransport, PublicClient } from 'viem'

import multicallAbi from './Multicall.json'

export const multicallAddresses = {
  1: '0xcA11bde05977b3631167028862bE2a173976CA11',
  4: '0xcA11bde05977b3631167028862bE2a173976CA11',
  5: '0xcA11bde05977b3631167028862bE2a173976CA11',
  56: '0xcA11bde05977b3631167028862bE2a173976CA11',
  97: '0xcA11bde05977b3631167028862bE2a173976CA11',
} as const

// export const getMulticallContract = (chainId: ChainId, provider: Provider) => {
//   if (multicallAddresses[chainId as keyof typeof multicallAddresses]) {
//     return new Contract(multicallAddresses[chainId as keyof typeof multicallAddresses], multicallAbi, provider)
//   }
//   return null
// }

export interface Call {
  address: Address // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

// TODO: wagmi
type CallOverrides = any

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
  abi: any[] | any
  calls: Call[]
  chainId?: ChainId
  options?: MulticallOptions
  provider?: PublicClient
}

export interface CallV3 extends Call {
  abi: any[] | any
  allowFailure?: boolean
}

interface MulticallV3Params {
  calls: CallV3[]
  chainId?: ChainId
  allowFailure?: boolean
  overrides?: CallOverrides
}

export type MultiCallV2 = <T = any>(params: MulticallV2Params) => Promise<T>
export type MultiCall = <T = any>(abi: any[], calls: Call[], chainId?: ChainId) => Promise<T>

export function createMulticall<TProvider extends PublicClient<FallbackTransport, Chain>>(
  provider: ({ chainId }: { chainId?: number | undefined }) => TProvider,
) {
  const multicall: MultiCall = async (abi: any[], calls: Call[], chainId = ChainId.BSC) => {
    const publicClient = provider({ chainId })
    const result = publicClient.multicall({
      contracts: calls.map((c) => ({
        address: c.address,
        abi,
        functionName: c.name,
        args: c.params,
      })),
      multicallAddress: multicallAddresses[chainId],
      allowFailure: false,
    })

    return result as any
  }

  const multicallv2: MultiCallV2 = async ({ abi, calls, chainId = ChainId.BSC, options, provider: _provider }) => {
    const { requireSuccess = true, ...overrides } = options || {}

    const publicClient = provider({ chainId })
    const result = publicClient.multicall({
      contracts: calls.map((c) => ({
        address: c.address,
        abi,
        functionName: c.name,
        args: c.params,
      })),
      multicallAddress: multicallAddresses[chainId],
      allowFailure: !requireSuccess,
    })

    return result as any
  }

  const multicallv3 = async ({ calls, chainId = ChainId.BSC, allowFailure, overrides }: MulticallV3Params) => {
    const publicClient = provider({ chainId })
    const result = publicClient.multicall({
      contracts: calls.map((c) => ({
        address: c.address,
        abi: c.abi,
        functionName: c.name,
        args: c.params,
      })),
      multicallAddress: multicallAddresses[chainId],
      allowFailure,
    })

    return result
  }

  return {
    multicall,
    multicallv2,
    multicallv3,
  }
}
