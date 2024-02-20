import { blocto } from '@blocto/wagmi-connector'
import memoize from 'lodash/memoize'
import { createClient } from 'viem'
import { createConfig, http } from 'wagmi'
import { bsc, mainnet } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, walletConnect } from 'wagmi/connectors'

export const chains = [mainnet, bsc]

export const coinbaseConnector = coinbaseWallet({
  appName: 'PancakeSwap',
  appLogoUrl: 'https://pancakeswap.com/logo.png',
})

export const walletConnectConnector = walletConnect({
  projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  showQrModal: true,
})

export const walletConnectNoQrCodeConnector = walletConnect({
  projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  showQrModal: false,
})

const bloctoConnector = blocto({
  appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af',
})

export const CONNECTORS_INIT_LENGTH = 5

export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => null,
  removeItem: (_key: any) => null,
}
export const wagmiConfig = createConfig({
  chains: [mainnet, bsc],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  connectors: [
    metaMask(),
    walletConnectConnector,
    walletConnectNoQrCodeConnector,
    injected(),
    coinbaseConnector,
    bloctoConnector,
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)
export const isChainSupported = memoize((chainId: number | undefined) =>
  chainId ? (CHAIN_IDS as number[]).includes(chainId) : false,
)
export const isChainTestnet = memoize((chainId: number) => {
  const found = chains.find((c) => c.id === chainId)
  return found ? 'testnet' in found : false
})
