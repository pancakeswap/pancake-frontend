import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider } from '@pancakeswap/smart-router/evm'
import { createPublicClient, http } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'wagmi/chains'
import { getNodeRealUrl } from './nodeReal'

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(getNodeRealUrl(mainnet.network)?.http || mainnet.rpcUrls.default.http[0]),
})

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(process.env.NEXT_PUBLIC_NODE_PRODUCTION),
})

const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http(),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(getNodeRealUrl(goerli.network)?.http || goerli.rpcUrls.default.http[0]),
})

// @ts-ignore
export const viemProviders: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    default:
      return bscClient
  }
}
