export type BlockExplorer = { name: string; url: string }

export type Chain = {
  /** ID in number form */
  id: number
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Collection of RPC endpoints */
  rpcUrls: {
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
}

export const devnet: Chain = {
  id: 31,
  name: 'Devnet',
  network: 'devnet',
  rpcUrls: {
    default: 'https://fullnode.devnet.aptoslabs.com/v1',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.devnet.aptos.dev',
    },
  },
}

export const testnet: Chain = {
  id: 2,
  name: 'Testnet',
  network: 'testnet',
  rpcUrls: {
    default: 'https://testnet.aptoslabs.com/v1',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.devnet.aptos.dev',
    },
  },
}

export const ait3: Chain = {
  id: 47,
  name: 'AIT3',
  network: 'ait3',
  rpcUrls: {
    default: 'https://ait3.aptosdev.com/v1/',
  },
  blockExplorers: {
    default: {
      name: 'Aptos Explorer',
      url: 'https://explorer.devnet.aptos.dev',
    },
  },
}

export const defaultChains = [devnet, ait3, testnet]
