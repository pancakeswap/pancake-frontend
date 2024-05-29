import { ChainId } from '@pancakeswap/chains'
import type { ChainName, WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect'
import { arbitrum, base, bscTestnet, mainnet as ethereum, goerli } from 'viem/chains'
import { getNodeRealUrl } from '../../utils/nodes/nodereal'
import { WidgetEnvs } from './types'

export type Network = {
  name: string
  id: ChainName
  rpc: ChainName
}

enum NETWORKS {
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
  ARBITRUM_ONE = 'arbitrum',
  BASE = 'base',
}

enum TESTNET_NETWORKS {
  ETHEREUM = 'goerli',
  BSC = 'bsc',
}

export const pcsLogo = 'https://pancakeswap.finance/logo.png'
export const walletConnectProjectId = 'e542ff314e26ff34de2d4fba98db70bb'

export const MAINNET_RPCS: { [network in NETWORKS]: string } = {
  [NETWORKS.ETHEREUM]:
    getNodeRealUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) || ethereum.rpcUrls.default.http[0],
  [NETWORKS.BSC]:
    getNodeRealUrl(ChainId.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) || 'https://bsc-dataseed1.binance.org',
  [NETWORKS.ARBITRUM_ONE]:
    arbitrum.rpcUrls.default.http[0] || getNodeRealUrl(ChainId.ARBITRUM_ONE, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY),
  [NETWORKS.BASE]:
    'https://base.publicnode.com' ||
    getNodeRealUrl(ChainId.BASE, process.env.NEXT_PUBLIC_NODE_REAL_API_KEY) ||
    base.rpcUrls.default.http[0],
}

export const TESTNET_RPCS: { [network in TESTNET_NETWORKS]: string } = {
  [TESTNET_NETWORKS.ETHEREUM]: goerli.rpcUrls.default.http[0],
  [TESTNET_NETWORKS.BSC]: bscTestnet.rpcUrls.default.http[0],
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
  'ETHarbitrum',
  'WETHarbitrum',
  'USDCarbitrum',
  'tBTC',
  'WETHbsc',
  'wstETHarbitrum',
]

export const TESTNET_TOKEN_KEYS: string[] = ['ETH', 'WETH', 'BNB', 'WBNB']

const mainnetWidgetConfig: WormholeConnectConfig = {
  env: WidgetEnvs.mainnet,
  rpcs: MAINNET_RPCS,
  networks: Object.keys(MAINNET_RPCS),
  tokens: MAINNET_TOKEN_KEYS,
  bridgeDefaults: {
    fromNetwork: 'ethereum',
    toNetwork: 'bsc',
    token: 'ETH',
  },
  walletConnectProjectId,
}

const testnetWidgetConfig: WormholeConnectConfig = {
  env: WidgetEnvs.testnet,
  rpcs: TESTNET_RPCS,
  networks: Object.keys(TESTNET_RPCS),
  tokens: TESTNET_TOKEN_KEYS,
  bridgeDefaults: {
    fromNetwork: 'goerli',
    toNetwork: 'bsc',
    token: 'ETH',
  },
  walletConnectProjectId,
}

export const getConfigEnv = ({ enableMainnet = true }: { enableMainnet: boolean }) => {
  return process.env.NODE_ENV !== 'development'
    ? WidgetEnvs.mainnet
    : enableMainnet
    ? WidgetEnvs.mainnet
    : WidgetEnvs.testnet
}

export const widgetConfigs: { [env in WidgetEnvs]: WormholeConnectConfig } = {
  [WidgetEnvs.mainnet]: mainnetWidgetConfig,
  [WidgetEnvs.testnet]: testnetWidgetConfig,
  [WidgetEnvs.devnet]: testnetWidgetConfig,
}
