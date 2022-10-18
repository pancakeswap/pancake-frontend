export type BlockExplorer = { name: string; url: string; params?: Record<string, string> }

export type Chain = {
  /** ID in number form */
  id: number
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Collection of Restful endpoints */
  restUrls: {
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
  restUrls: {
    default: 'https://fullnode.mainnet.aptoslabs.com/v1/',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com',
      params: {
        network: 'mainnet',
      },
    },
  },
}

export const devnet: Chain = {
  id: 34,
  name: 'Devnet',
  network: 'devnet',
  restUrls: {
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
  },
  testnet: true,
  faucetUrl: 'https://faucet.devnet.aptoslabs.com',
}

export const testnet: Chain = {
  id: 2,
  name: 'Testnet',
  network: 'testnet',
  restUrls: {
    default: 'https://testnet.aptoslabs.com/v1',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.aptoslabs.com',
      params: {
        network: 'testnet',
      },
    },
  },
  testnet: true,
  faucetUrl: 'https://faucet.testnet.aptoslabs.com',
}

export const defaultChains = [devnet, testnet]

export const defaultChain = devnet
