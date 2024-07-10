export type BlockExplorer = { name: string; url: string; params?: Record<string, string> }

export type Chain = {
  /** ID in number form */
  id: number
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Collection of Node url endpoints */
  nodeUrls: {
    [key: string]: string
    default: string
  }
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: BlockExplorer
    default: BlockExplorer
  }
  /** Flag for test networks */
  testnet?: boolean
} & (MainnetChain | TestnetChain)

type MainnetChain = {
  testnet?: false
}

type TestnetChain = {
  testnet: true
  faucetUrl: string
}

export const mainnet: Chain = {
  id: 1,
  name: 'Mainnet',
  network: 'mainnet',
  nodeUrls: {
    default: 'https://fullnode.mainnet.aptoslabs.com/v1',
    nodeReal: 'https://aptos-mainnet.nodereal.io/v1',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com',
      params: {
        network: 'mainnet',
      },
    },
    traceMove: {
      name: 'TraceMove',
      url: 'https://tracemove.io/',
    },
  },
}

export const devnet: Chain = {
  id: 34, // note: devnet id changing constantly
  name: 'Devnet',
  network: 'devnet',
  nodeUrls: {
    default: 'https://fullnode.devnet.aptoslabs.com/v1',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com',
      params: {
        network: 'devnet',
      },
    },
    traceMove: {
      name: 'TraceMove',
      url: 'https://devnet.tracemove.io/',
    },
  },
  testnet: true,
  faucetUrl: 'https://faucet.devnet.aptoslabs.com',
}

export const testnet: Chain = {
  id: 2,
  name: 'Testnet',
  network: 'testnet',
  nodeUrls: {
    default: 'https://testnet.aptoslabs.com/v1',
    nodeReal: 'https://aptos-testnet.nodereal.io/v1',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com',
      params: {
        network: 'testnet',
      },
    },
    traceMove: {
      name: 'TraceMove',
      url: 'https://testnet.tracemove.io/',
    },
  },
  testnet: true,
  faucetUrl: 'https://faucet.testnet.aptoslabs.com',
}

export const defaultChains = [mainnet, devnet, testnet]

export const defaultChain = mainnet
