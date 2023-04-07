import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider } from '@pancakeswap/smart-router/evm'
import { createPublicClient, http } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'wagmi/chains'

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e'),
})

const bscClient = createPublicClient({
  chain: bsc,
  transport: http('https://nodes.pancakeswap.info'),
})

const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5'),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http('https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e'),
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
