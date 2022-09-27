import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import { WalletFilledIcon } from '@pancakeswap/uikit'
import type { ExtendEthereum } from 'global'
import { isFirefox } from 'react-device-detect'
import { metaMaskConnector, walletConnectConnector, walletConnectNoQrCodeConnector } from '../utils/wagmi'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
}

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

const createQrCode = (chainId: number) => async () => {
  const provider = await walletConnectNoQrCodeConnector.getProvider({ chainId, create: true })
  const uri = await Promise.race([
    provider.enable().then(() => provider.connector.uri),
    delay(50).then(() => provider.connector.uri),
  ])
  return uri
}

const walletsConfig = (chainId: number): WalletConfigV2<ConnectorNames>[] => [
  {
    id: 'metamask',
    title: 'Metamask',
    icon: '/images/wallets/metamask.png',
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask) && metaMaskConnector.ready,
    connectorId: ConnectorNames.MetaMask,
    deepLink: 'metamask://dapp/pancakeswap.finance/',
    qrCode: createQrCode(chainId),
    downloadLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },
  {
    id: 'binance',
    title: 'Binance Wallet',
    icon: '/images/wallets/binance.png',
    installed: typeof window !== 'undefined' && Boolean(window.BinanceChain),
    connectorId: ConnectorNames.BSC,
    guide: {
      desktop: 'https://www.bnbchain.org/en/binance-wallet',
    },
    downloadLink: {
      desktop: isFirefox
        ? 'https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search'
        : 'https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
    },
  },
  {
    id: 'coinbase',
    title: 'Coinbase Wallet',
    icon: '/images/wallets/coinbase.png',
    connectorId: ConnectorNames.WalletLink,
    installed: true,
    deepLink: 'https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fpancakeswap.finance%2F',
  },
  {
    id: 'trust',
    title: 'Trust Wallet',
    icon: '/images/wallets/trust.png',
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      (Boolean(window.ethereum?.isTrust) ||
        // @ts-ignore
        Boolean(window.ethereum?.isTrustWallet)),
    deepLink: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://pancakeswap.finance/',
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related',
    },
    qrCode: createQrCode(chainId),
  },
  {
    id: 'walletconnect',
    title: 'WalletConnect',
    icon: '/images/wallets/walletconnect.png',
    installed: walletConnectConnector.ready,
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    id: 'opera',
    title: 'Opera Wallet',
    icon: '/images/wallets/opera.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera),
    downloadLink: 'https://www.opera.com/crypto/next',
  },
  {
    id: 'brave',
    title: 'Brave Wallet',
    icon: '/images/wallets/brave.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet),
  },
  {
    id: 'math',
    title: 'MathWallet',
    icon: '/images/wallets/mathwallet.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet),
    qrCode: createQrCode(chainId),
  },
  {
    id: 'tokenpocket',
    title: 'TokenPocket',
    icon: '/images/wallets/tokenpocket.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket),
    qrCode: createQrCode(chainId),
  },
  {
    id: 'safepal',
    title: 'SafePal',
    icon: '/images/wallets/safepal.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isSafePal),
    qrCode: createQrCode(chainId),
  },
  {
    id: 'coin98',
    title: 'Coin98',
    icon: '/images/wallets/coin98.png',
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      (Boolean((window.ethereum as ExtendEthereum)?.isCoin98) || Boolean(window.coin98)),
    qrCode: createQrCode(chainId),
  },
  {
    id: 'blocto',
    title: 'Blocto',
    icon: '/images/wallets/blocto.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto),
    qrCode: createQrCode(chainId),
  },
]

export const createWallets = (chainId: number) =>
  (typeof window !== 'undefined' && !window.ethereum) ||
  walletsConfig(chainId).some((c) => c.installed && c.connectorId === ConnectorNames.Injected)
    ? walletsConfig(chainId)
    : // add injected icon if none of injected type wallets installed
      [
        ...walletsConfig(chainId),
        {
          id: 'injected',
          title: 'Injected',
          icon: WalletFilledIcon,
          connectorId: ConnectorNames.Injected,
          installed: typeof window !== 'undefined' && Boolean(window.ethereum),
        },
      ]
