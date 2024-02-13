import { MainnetChainName, TestnetChainName } from '@wormhole-foundation/wormhole-connect'

export type Network = {
  name: string
  testnet: TestnetChainName
  mainnet: MainnetChainName
}

export const NETWORKS: Network[] = [
  {
    name: 'Solana',
    testnet: 'solana',
    mainnet: 'solana',
  },
  {
    name: 'Ethereum',
    testnet: 'goerli',
    mainnet: 'ethereum',
  },
  {
    name: 'BSC',
    testnet: 'bsc',
    mainnet: 'bsc',
  },
  {
    name: 'Arbitrum',
    testnet: 'arbitrumgoerli',
    mainnet: 'arbitrum',
  },
  {
    name: 'Base',
    testnet: 'basegoerli',
    mainnet: 'base',
  },
]

export const MAINNET_TOKEN_KEYS: string[] = [
  'ETH',
  'WETH',
  'WBTC',
  'USDT',
  'DAI',
  'BUSD',
  'BNB',
  'WBNB',
  'SOL',
  'WSOL',
  'ETHarbitrum',
  'WETHarbitrum',
  'USDCarbitrum',
  'ETHbase',
  'WETHbase',
  'tBTCarbitrum',
  'tBTCbase',
  'tBTCsol',
  'WETHbsc',
  'wstETHarbitrum',
  'wstETHbase',
].sort()

export const DEFAULT_MAINNET_RPCS = {
  ethereum: 'https://ethereum.publicnode.com',
  solana: 'https://solana-mainnet.g.alchemy.com/v2/6PZrVyh_Obebi8OKb_1DVwsJKHuJ5142',
  bsc: 'https://bsc.publicnode.com',
  arbitrum: 'https://arbitrum-one.publicnode.com',
  base: 'https://base.publicnode.com',
}
