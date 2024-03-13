import { MainnetChainName, TestnetChainName } from '@wormhole-foundation/wormhole-connect'
import { arbitrum, arbitrumGoerli, base, baseGoerli, bscTestnet, mainnet as ethereum, goerli } from 'wagmi/chains'
import { getNodeRealUrl } from '../../utils/nodes/nodereal'
import { getGroveUrl } from '../../utils/nodes/pokt'
import { WormholeChainIds } from './chains'
import { Env, WidgetEnvs } from './types'

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
  APTOS = 'aptos',
}

export const NETWORK_CONFIG: { [network in NETWORKS]: Network } = {
  [NETWORKS.SOLANA]: {
    name: 'Solana',
    testnet: 'solana',
    mainnet: 'solana',
    mainnetRpc:
      getGroveUrl(WormholeChainIds.SOLANA, process.env.NEXT_PUBLIC_GROVE_API_KEY) ||
      getNodeRealUrl(WormholeChainIds.SOLANA, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
      'https://solana-mainnet.rpc.extrnode.com',
    testnetRpc: 'https://api.devnet.solana.com',
  },
  [NETWORKS.ETHEREUM]: {
    name: 'Ethereum',
    testnet: 'goerli',
    mainnet: 'ethereum',
    mainnetRpc:
      getGroveUrl(WormholeChainIds.ETHEREUM, process.env.NEXT_PUBLIC_GROVE_API_KEY) ||
      getNodeRealUrl(WormholeChainIds.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
      ethereum.rpcUrls.public.http[0],
    testnetRpc:
      getNodeRealUrl(WormholeChainIds.GOERLI, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
      goerli.rpcUrls.public.http[0],
  },
  [NETWORKS.BSC]: {
    name: 'BSC',
    testnet: 'bsc',
    mainnet: 'bsc',
    mainnetRpc:
      getGroveUrl(WormholeChainIds.BSC, process.env.NEXT_PUBLIC_GROVE_API_KEY) ||
      getNodeRealUrl(WormholeChainIds.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
      'https://bsc-dataseed1.binance.org',
    testnetRpc: bscTestnet.rpcUrls.public.http[0],
  },
  [NETWORKS.ARBITRUM_ONE]: {
    name: 'Arbitrum',
    testnet: 'arbitrumgoerli',
    mainnet: 'arbitrum',
    mainnetRpc:
      getGroveUrl(WormholeChainIds.ARBITRUM_ONE, process.env.NEXT_PUBLIC_GROVE_API_KEY) ||
      getNodeRealUrl(WormholeChainIds.ARBITRUM_ONE, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
      arbitrum.rpcUrls.public.http[0],
    testnetRpc: arbitrumGoerli.rpcUrls.public.http[0],
  },
  [NETWORKS.BASE]: {
    name: 'Base',
    testnet: 'basegoerli',
    mainnet: 'base',
    mainnetRpc:
      getGroveUrl(WormholeChainIds.BASE, process.env.NEXT_PUBLIC_GROVE_API_KEY) ||
      getNodeRealUrl(WormholeChainIds.BASE, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
      base.rpcUrls.public.http[0],
    testnetRpc: baseGoerli.rpcUrls.public.http[0],
  },
  [NETWORKS.APTOS]: {
    name: 'Aptos',
    testnet: 'aptos',
    mainnet: 'aptos',
    mainnetRpc: 'https://aptos-mainnet.nodereal.io/v1',
    testnetRpc: 'https://fullnode.devnet.aptoslabs.com/v1',
  },
}

export const WORMHOLE_NETWORKS = Object.values(NETWORK_CONFIG)

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
  'tBTC',
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
].sort()

export const MAINNET_RPCS: { [mainnet: string]: string } = Object.entries(NETWORK_CONFIG).reduce((acc, [, config]) => {
  const { mainnet, mainnetRpc } = config
  return { ...acc, [mainnet]: mainnetRpc }
}, {})

export const TESTNET_RPCS: { [testnet: string]: string } = Object.entries(NETWORK_CONFIG).reduce((acc, [, config]) => {
  const { testnet, testnetRpc } = config
  return { ...acc, [testnet]: testnetRpc }
}, {})

export const getRpcUrls = (env: Omit<Env, 'devnet'>) => (env === WidgetEnvs.mainnet ? MAINNET_RPCS : TESTNET_RPCS)

export const getBridgeTokens = (env: Omit<Env, 'devnet'>) =>
  env === WidgetEnvs.mainnet ? MAINNET_TOKEN_KEYS : TESTNET_TOKEN_KEYS

export const pcsLogo = 'https://pancakeswap.finance/logo.png'
export const walletConnectProjectId = 'e542ff314e26ff34de2d4fba98db70bb'
