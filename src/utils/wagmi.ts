import { bsc, BscConnector, bscTest, CHAINS } from '@pancakeswap/wagmi'
import { configureChains, createClient } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

export const { provider, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      return { http: chain.rpcUrls.default }
    },
  }),
])

export const injectedConnector = new InjectedConnector({
  chains,
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
    rpc: {
      [bsc.id]: bsc.rpcUrls.default,
      [bscTest.id]: bsc.rpcUrls.default,
    },
    qrcode: true,
  },
})

export const bscConnector = new BscConnector({ chains })

export const client = createClient({
  autoConnect: true,
  provider,
  connectors: [injectedConnector, coinbaseConnector, walletConnectConnector, bscConnector],
})

const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = (chainId: number) => CHAIN_IDS.includes(chainId)
