import { CallOverrides } from '@ethersproject/contracts'
import { createMulticall, Call } from '@pancakeswap/multicall'
import { CHAINS } from 'config/chains'
import { configureChains } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getNodeRealServerUrl } from './nodeReal'

export const { provider, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (!!process.env.NEXT_PUBLIC_NODE_PRODUCTION && chain.id === bsc.id) {
        return { http: process.env.NEXT_PUBLIC_NODE_PRODUCTION }
      }

      return getNodeRealServerUrl(chain.network) || { http: chain.rpcUrls.default.http[0] }
    },
  }),
])

export type { Call }

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

const { multicall, multicallv2, multicallv3 } = createMulticall(provider)

export default multicall

export { multicallv2, multicallv3 }
