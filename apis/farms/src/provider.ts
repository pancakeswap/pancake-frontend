import { ChainId } from '@pancakeswap/sdk'
import { createPublicClient, http, PublicClient } from 'viem'
import { bsc, bscTestnet, goerli, mainnet, zkSyncTestnet, polygonZkEvm, zkSync, arbitrum } from 'viem/chains'

const requireCheck = [
  ETH_NODE,
  GOERLI_NODE,
  BSC_NODE,
  BSC_TESTNET_NODE,
  POLYGON_ZKEVM_NODE,
  ZKSYNC_NODE,
  ARBITRUM_ONE_NODE,
]
requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const bscClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const bscTestnetClient: PublicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const zksyncTestnetClient = createPublicClient({
  chain: zkSyncTestnet,
  transport: http(),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const polygonZkEvmClient = createPublicClient({
  chain: {
    ...polygonZkEvm,
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 57746,
      },
    },
  },
  transport: http(POLYGON_ZKEVM_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const zksyncClient = createPublicClient({
  chain: zkSync,
  transport: http(ZKSYNC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const arbitrumOneClient = createPublicClient({
  chain: arbitrum,
  transport: http(ARBITRUM_ONE_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const viemProviders = ({ chainId }: { chainId?: ChainId }): PublicClient => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    case ChainId.ZKSYNC_TESTNET:
      return zksyncTestnetClient
    case ChainId.POLYGON_ZKEVM:
      return polygonZkEvmClient
    case ChainId.ZKSYNC:
      return zksyncClient
    case ChainId.ARBITRUM_ONE:
      return arbitrumOneClient
    default:
      return bscClient
  }
}
