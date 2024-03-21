import { getWagmiConnector } from '@binance/w3w-wagmi-connector'
import { CyberWalletConnector, isCyberWallet } from '@cyberlab/cyber-app-sdk'
import { ChainId } from '@pancakeswap/chains'
import { BloctoConnector } from '@pancakeswap/wagmi/connectors/blocto'
import { TrustWalletConnector } from '@pancakeswap/wagmi/connectors/trustWallet'
import { CHAINS } from 'config/chains'
import { PUBLIC_NODES } from 'config/nodes'
import first from 'lodash/first'
import memoize from 'lodash/memoize'
import { Transport, createPublicClient } from 'viem'
import { createConfig, createStorage, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const chains = CHAINS

export const injectedConnector = injected({
  shimDisconnect: false,
})

export const coinbaseConnector = coinbaseWallet({
  appName: 'PancakeSwap',
  appLogoUrl: 'https://pancakeswap.com/logo.png',
})

export const walletConnectConnector = walletConnect({
  // ignore the error in test environment
  // Error: To use QR modal, please install @walletconnect/modal package
  showQrModal: process.env.NODE_ENV !== 'test',
  projectId: 'e542ff314e26ff34de2d4fba98db70bb',
})

export const walletConnectNoQrCodeConnector = walletConnect({
  showQrModal: false,
  projectId: 'e542ff314e26ff34de2d4fba98db70bb',
})

export const metaMaskConnector = injected({ target: 'metaMask', shimDisconnect: false })

const bloctoConnector = new BloctoConnector({
  chains,
  options: {
    defaultChainId: 56,
    appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af',
  },
})

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const cyberWalletConnector = isCyberWallet()
  ? new CyberWalletConnector({
      chains: chains as any,
      options: {
        name: 'PancakeSwap',
        appId: 'b825cd87-2db3-456d-b108-d61e74d89771',
      },
    })
  : undefined

const BinanceW3WConnector = getWagmiConnector()
export const binanceWeb3WalletConnector = new BinanceW3WConnector({
  chains,
  options: {
    chainId: ChainId.BSC,
  },
})

export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => {},
  removeItem: (_key: any) => {},
}

const PUBLIC_MAINNET = 'https://ethereum.publicnode.com'

const transports: Record<number, Transport> = chains.reduce((ts, chain) => {
  let httpStrings: string[] = []

  if (process.env.NODE_ENV === 'test' && chain.id === mainnet.id) {
    httpStrings = [PUBLIC_MAINNET]
  } else {
    httpStrings = PUBLIC_NODES[chain.id] ? PUBLIC_NODES[chain.id] : undefined
  }

  if (ts) {
    return {
      ...ts,
      [chain.id]: httpStrings.map((t) => http(t)),
    }
  }

  return {
    [chain.id]: httpStrings.map((t) => http(t)),
  }
}, {})

const CLIENT_CONFIG = {
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
}

export const publicClient = ({ chainId }: { chainId?: ChainId }) => {
  let httpString: string | undefined

  if (process.env.NODE_ENV === 'test' && chainId === mainnet.id) {
    httpString = PUBLIC_MAINNET
  } else {
    httpString = chainId && first(PUBLIC_NODES[chainId]) ? first(PUBLIC_NODES[chainId]) : undefined
  }

  const chain = chains.find((c) => c.id === chainId)

  return createPublicClient({ chain, transport: http(httpString), ...CLIENT_CONFIG })
}

export const wagmiConfig = createConfig({
  chains,

  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'wagmi_v1.1',
  }),
  syncConnectedChain: false,
  transports,
  ...CLIENT_CONFIG,

  connectors: [
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    // @ts-ignore FIXME: wagmi
    bloctoConnector,
    // ledgerConnector,
    trustWalletConnector,
    binanceWeb3WalletConnector,
    ...(cyberWalletConnector ? [cyberWalletConnector as any] : []),
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))
export const isChainTestnet = memoize((chainId: number) => {
  const found = chains.find((c) => c.id === chainId)
  return found ? 'testnet' in found : false
})
