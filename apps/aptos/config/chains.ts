export const devnet = {
  id: 25,
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

export const testnet = {
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

export const ait3 = {
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

export const defaultChain = devnet

export const chains = [devnet, ait3, testnet]
