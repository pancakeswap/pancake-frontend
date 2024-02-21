import { ChainId } from '@pancakeswap/chains'
import { MainnetChainName, TestnetChainName } from '@wormhole-foundation/wormhole-connect'
import { arbitrum, arbitrumGoerli, base, baseGoerli, bsc, bscTestnet, goerli } from 'wagmi/chains'
import { getNodeRealUrl } from '../../utils/nodereal'
import { Env, WidgetEnvs } from './types'

export enum WormholeChainIds {
  ETHEREUM = ChainId.ETHEREUM,
  GOERLI = ChainId.GOERLI,
  BSC = ChainId.BSC,
  BSC_TESTNET = ChainId.BSC_TESTNET,
  ARBITRUM_ONE = ChainId.ARBITRUM_ONE,
  ARBITRUM_GOERLI = ChainId.ARBITRUM_GOERLI,
  BASE = ChainId.BASE,
  BASE_TESTNET = ChainId.BASE_TESTNET,
  SOLANA = 1399811149,
  SOLANA_TESTNET = 900,
  APTOS = 1,
  APTOS_TESTNET = 34,
}

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
      'https://eth-mainnet.g.alchemy.com/v2/aLeAqgQ1dZmYzL6JMbCLHYwnqxKIYboN',
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

export const getRpcUrls = (env: Omit<Env, 'devnet'>) => (env === WidgetEnvs.mainnet ? MAINNET_RPCS : TESTNET_RPCS)

export const getBridgeTokens = (env: Omit<Env, 'devnet'>) =>
  env === WidgetEnvs.mainnet ? MAINNET_TOKEN_KEYS : TESTNET_TOKEN_KEYS

export const pcsLogo = 'https://pancakeswap.finance/logo.png'
export const walletConnectProjectId = 'e542ff314e26ff34de2d4fba98db70bb'
