import { MainnetChainName, TestnetChainName } from '@wormhole-foundation/wormhole-connect'
import { arbitrum, arbitrumGoerli, base, baseGoerli, bsc, bscTestnet, mainnet as ethereum, goerli } from 'wagmi/chains'
import { getNodeRealUrl } from '../../utils/nodereal'
import { WormholeChainIds } from './chainId'

export type Network = {
  name: string
  testnet: TestnetChainName
  mainnet: MainnetChainName
  mainnetRpc: string
  testnetRpc: string
}

enum NETWORKS {
  SOLANA = 'solana',
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
  ARBITRUM_ONE = 'arbitrum',
  BASE = 'base',
}

export const NETWORK_CONFIG: { [network in NETWORKS]: Network } = {
  [NETWORKS.SOLANA]: {
    name: 'Solana',
    testnet: 'solana',
    mainnet: 'solana',
    mainnetRpc:
      getNodeRealUrl(WormholeChainIds.SOLANA, process.env.NEXT_PUBLIC_NODE_REAL_API_SOLANA) ||
      'https://solana-mainnet.g.alchemy.com/v2/6PZrVyh_Obebi8OKb_1DVwsJKHuJ5142',
    testnetRpc: 'https://solana-devnet.g.alchemy.com/v2/cOwc2pnya8KbOGyED0gAK3KsK5nYgomn',
  },
  [NETWORKS.ETHEREUM]: {
    name: 'Ethereum',
    testnet: 'goerli',
    mainnet: 'ethereum',
    mainnetRpc:
      getNodeRealUrl(WormholeChainIds.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) ||
      ethereum.rpcUrls.public.http[0],
    testnetRpc:
      getNodeRealUrl(WormholeChainIds.GOERLI, process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) ||
      goerli.rpcUrls.public.http[0],
  },
  [NETWORKS.BSC]: {
    name: 'BSC',
    testnet: 'bsc',
    mainnet: 'bsc',
    mainnetRpc:
      getNodeRealUrl(WormholeChainIds.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_BSC) || bsc.rpcUrls.public.http[0],
    testnetRpc: bscTestnet.rpcUrls.public.http[0],
  },
  [NETWORKS.ARBITRUM_ONE]: {
    name: 'Arbitrum',
    testnet: 'arbitrumgoerli',
    mainnet: 'arbitrum',
    mainnetRpc:
      getNodeRealUrl(WormholeChainIds.ARBITRUM_ONE, process.env.NEXT_PUBLIC_NODE_REAL_API_ARBITRUM_ONE) ||
      arbitrum.rpcUrls.public.http[0],
    testnetRpc: arbitrumGoerli.rpcUrls.public.http[0],
  },
  [NETWORKS.BASE]: {
    name: 'Base',
    testnet: 'basegoerli',
    mainnet: 'base',
    mainnetRpc:
      getNodeRealUrl(WormholeChainIds.BASE, process.env.NEXT_PUBLIC_NODE_REAL_API_BASE) || base.rpcUrls.public.http[0],
    testnetRpc: baseGoerli.rpcUrls.public.http[0],
  },
}

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

export const TESTNET_TOKEN_KEYS: string[] = [
  'ETH',
  'WETH',
  'USDCeth',
  'WBTC',
  'USDT',
  'DAI',
  'BNB',
  'WBNB',
  'SOL',
  'WSOL',
  'USDCsol',
  'ETHarbitrum',
  'WETHarbitrum',
  'USDCarbitrum',
  'ETHbase',
  'WETHbase',
  'USDCbase',
  'tBTC',
  'tBTCarbitrum',
  'tBTCbase',
  'tBTCsol',
].sort()

export const MAINNET_RPCS: { [mainnet: string]: string } = Object.entries(NETWORK_CONFIG).reduce((acc, [, config]) => {
  const { mainnet, mainnetRpc } = config
  return { ...acc, [mainnet]: mainnetRpc }
}, {})

export const TESTNET_RPCS: { [testnet: string]: string } = Object.entries(NETWORK_CONFIG).reduce((acc, [, config]) => {
  const { testnet, testnetRpc } = config
  return { ...acc, [testnet]: testnetRpc }
}, {})
