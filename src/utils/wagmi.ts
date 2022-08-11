import { bsc, BscConnector, CHAINS } from '@pancakeswap/wagmi'
import { configureChains, createClient } from 'wagmi'
import memoize from 'lodash/memoize'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'

const getNodeRealUrl = (networkName: string) => {
  const formatHost = (apiKey?: string) => {
    if (!apiKey) return null
    return `eth-mainnet.nodereal.io/v1/${apiKey}`
  }

  let host = null
  switch (networkName) {
    case 'homestead':
      host = formatHost(process.env.NEXT_PUBLIC_NODE_REAL_API_ETH)
      break
    case 'rinkeby':
      host = formatHost(process.env.NEXT_PUBLIC_NODE_REAL_API_RINKEBY)
      break
    case 'goerli':
      host = formatHost(process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI)
      break
    default:
      host = null
  }

  if (!host) {
    return null
  }

  const url = `https://${host}`
  return {
    http: url,
    webSocket: url.replace(/^http/i, 'wss').replace('.nodereal.io/v1', '.nodereal.io/ws/v1'),
  }
}

export const { provider, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (!!process.env.NEXT_PUBLIC_NODE_PRODUCTION && chain.id === bsc.id) {
        return { http: process.env.NEXT_PUBLIC_NODE_PRODUCTION }
      }
      if (chain.rpcUrls.nodeReal) {
        return (
          getNodeRealUrl(chain.network) || {
            http: chain.rpcUrls.nodeReal,
          }
        )
      }
      return { http: chain.rpcUrls.default }
    },
  }),
])

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'PancakeSwap',
    appLogoUrl: 'https://pancakeswap.com/logo.png',
    chainId: bsc.id,
    jsonRpcUrl: bsc.rpcUrls.default,
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const bscConnector = new BscConnector({ chains })

export const client = createClient({
  autoConnect: false, // disable default autoConnect, try safe first
  provider,
  connectors: [
    new SafeConnector({ chains }),
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    bscConnector,
  ],
})

const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId))
