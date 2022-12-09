import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

export const avalandche: Chain = {
  id: 43114,
  name: 'Avalanche C-Chain',
  network: 'avalanche',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://snowtrace.io/',
    },
  },
}

export const avalandcheFuji: Chain = {
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche_fuji',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://testnet.snowtrace.io/',
    },
  },
  testnet: true,
}

export const fantomOpera: Chain = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
}

export const fantomTestnet: Chain = {
  id: 4002,
  name: 'Fantom Testnet',
  network: 'fantom-testnet',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.testnet.fantom.network',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
    },
  },
  testnet: true,
}

const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }

export const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  rpcUrls: {
    public: 'https://bsc-dataseed1.binance.org',
    default: 'https://bsc-dataseed1.binance.org',
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 15921452,
  },
}

export const bscTest: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
    default: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 17422483,
  },
  testnet: true,
}

export const bitgert: Chain = {
  id: 32520,
  name: 'Bitgert Mainnet',
  network: 'bitgert',
  rpcUrls: {
    public: 'https://rpc.icecreamswap.com',
    default: 'https://rpc.icecreamswap.com',
  },
  blockExplorers: {
    default: { name: 'Brisescan', url: 'https://brisescan.com' },
  },
  nativeCurrency: {
    name: 'Brise',
    symbol: 'Brise',
    decimals: 18,
  },
  multicall: {
    address: '0x2490b172F7de4f518713fB03E6D3f57B558c9964',
    blockCreated: 1541584,
  },
}

export const dogechain: Chain = {
  id: 2000,
  name: 'Dogechain Mainnet',
  network: 'dogechain',
  rpcUrls: {
    public: 'https://rpc.dogechain.dog',
    default: 'https://rpc.dogechain.dog',
  },
  blockExplorers: {
    default: { name: 'Dogechain Explorer', url: 'https://explorer.dogechain.dog' },
  },
  nativeCurrency: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    decimals: 18,
  },
  multicall: {
    address: '0x3d2e33eb61677869d87ac92d3c8891ec5c57fa5b',
    blockCreated: 4308714,
  },
}

export const dokenchain: Chain = {
  id: 61916,
  name: 'DoKEN Super Chain Mainnet',
  network: 'doken',
  rpcUrls: {
    public: 'https://nyrpc.doken.dev',
    default: 'https://nyrpc.doken.dev',
  },
  blockExplorers: {
    default: { name: 'Doken Explorer', url: 'https://explorer.doken.dev' },
  },
  nativeCurrency: {
    name: 'Doken',
    symbol: 'DKN',
    decimals: 18,
  },
  multicall: {
    address: '0xb999ea90607a826a3e6e6646b404c3c7d11fa39d',
    blockCreated: 451563,
  },
}

export const fuse: Chain = {
  id: 122,
  name: 'Fuse Mainnet',
  network: 'fuse',
  rpcUrls: {
    public: 'https://rpc.fuse.io',
    default: 'https://rpc.fuse.io',
  },
  blockExplorers: {
    default: { name: 'Fuse Explorer', url: 'https://explorer.fuse.io' },
  },
  nativeCurrency: {
    name: 'Fuse',
    symbol: 'FUSE',
    decimals: 18,
  },
  multicall: {
    address: '0x43891084581fD07Ee1189f3a2f04e51c26a95B77',
    blockCreated: 20060779,
  },
}

export const xdc: Chain = {
  id: 50,
  name: 'XinFin XDC Network',
  network: 'xdc',
  rpcUrls: {
    public: 'https://erpc.xinfin.network',
    default: 'https://erpc.xinfin.network',
  },
  blockExplorers: {
    default: { name: 'XDC Explorer', url: 'https://xdcscan.io' },
  },
  nativeCurrency: {
    name: 'XDC',
    symbol: 'XDC',
    decimals: 18,
  },
  multicall: {
    address: '0xf3a3dAf360161B2f10c645EF039C709A3Fd4Ea62',
    blockCreated: 53792616,
  },
}

export { rinkeby, mainnet, goerli }
