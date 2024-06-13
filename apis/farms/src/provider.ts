import { ChainId } from '@pancakeswap/chains'
import { Chain, createPublicClient, http, PublicClient } from 'viem'
import {
  arbitrum,
  bsc,
  bscTestnet,
  goerli,
  mainnet,
  opBNB,
  opBNBTestnet,
  polygonZkEvm,
  zkSync,
  zkSyncTestnet,
} from 'viem/chains'

const requireCheck = [
  ETH_NODE,
  GOERLI_NODE,
  BSC_NODE,
  BSC_TESTNET_NODE,
  POLYGON_ZKEVM_NODE,
  ZKSYNC_NODE,
  ARBITRUM_ONE_NODE,
  LINEA_NODE,
  BASE_NODE,
  OPBNB_NODE,
  OPBNB_TESTNET_NODE,
  EXPLORER_URL,
  EXPLORER_API_KEY,
]

const base = {
  id: 8453,
  network: 'base',
  name: 'Base',
  nativeCurrency: {
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    blockscout: {
      name: 'Basescout',
      url: 'https://base.blockscout.com',
    },
    default: {
      name: 'Basescan',
      url: 'https://basescan.org',
    },
    etherscan: {
      name: 'Basescan',
      url: 'https://basescan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5022,
    },
  },
} as const

const linea = {
  id: 59_144,
  name: 'Linea Mainnet',
  network: 'linea-mainnet',
  nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    infura: {
      http: ['https://linea-mainnet.infura.io/v3'],
      webSocket: ['wss://linea-mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.linea.build'],
      webSocket: ['wss://rpc.linea.build'],
    },
    public: {
      http: ['https://rpc.linea.build'],
      webSocket: ['wss://rpc.linea.build'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
    etherscan: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
    blockscout: {
      name: 'Blockscout',
      url: 'https://explorer.linea.build',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 42,
    },
  },
  testnet: false,
} as const

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
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

export const bscClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

export const bscTestnetClient: PublicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const zksyncTestnetClient = createPublicClient({
  chain: zkSyncTestnet as Chain,
  transport: http(),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
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
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const zksyncClient = createPublicClient({
  chain: zkSync as Chain,
  transport: http(ZKSYNC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const arbitrumOneClient = createPublicClient({
  chain: arbitrum,
  transport: http(ARBITRUM_ONE_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const lineaClient = createPublicClient({
  chain: linea,
  transport: http(LINEA_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const baseClient = createPublicClient({
  chain: base,
  transport: http(BASE_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const opBNBClient = createPublicClient({
  chain: opBNB,
  transport: http(OPBNB_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
})

const opBNBTestnetClient = createPublicClient({
  chain: opBNBTestnet,
  transport: http(OPBNB_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
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
    case ChainId.LINEA:
      return lineaClient
    case ChainId.BASE:
      return baseClient
    case ChainId.OPBNB:
      return opBNBClient
    case ChainId.OPBNB_TESTNET:
      return opBNBTestnetClient
    default:
      return bscClient
  }
}
