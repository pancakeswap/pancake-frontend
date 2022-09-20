import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import type { ExtendEthereum } from 'global'
import { isFirefox, isMobile, isMobileOnly } from 'react-device-detect'
import { metaMaskConnector, walletConnectConnector, coinbaseConnector } from '../utils/wagmi'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
}

const qrCode = async () => (await walletConnectConnector.getProvider()).connector.uri

export const wallets: WalletConfigV2<ConnectorNames>[] = [
  {
    title: 'Metamask',
    icon: '/images/wallets/metamask.png',
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask) && metaMaskConnector.ready,
    connectorId: ConnectorNames.MetaMask,
    deepLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
    qrCode,
    downloadLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },
  {
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
    title: 'Coinbase Wallet',
    icon: '/images/wallets/coinbase.png',
    connectorId: ConnectorNames.WalletLink,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isCoinbaseWallet),
    deepLink: 'https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fpancakeswap.finance%2F',
  },
  {
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
    qrCode,
  },
  {
    title: 'WalletConnect',
    icon: '/images/wallets/walletconnect.png',
    installed: walletConnectConnector.ready,
    connectorId: ConnectorNames.WalletConnect,
    qrCode,
  },
  {
    title: 'Opera Wallet',
    icon: '/images/wallets/opera.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera),
    downloadLink: 'https://www.opera.com/crypto/next',
  },
  {
    title: 'Brave Wallet',
    icon: '/images/wallets/brave.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet),
  },
  {
    title: 'MathWallet',
    icon: '/images/wallets/mathwallet.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet),
    qrCode,
  },
  {
    title: 'TokenPocket',
    icon: '/images/wallets/tokenpocket.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket),
    qrCode,
  },
  {
    title: 'SafePal',
    icon: '/images/wallets/safepal.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isSafePal),
    qrCode,
  },
  {
    title: 'Coin98',
    icon: '/images/wallets/coin98.png',
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      (Boolean((window.ethereum as ExtendEthereum)?.isCoin98) || Boolean(window.coin98)),
    qrCode,
  },
  {
    title: 'Blocto',
    icon: '/images/wallets/blocto.png',
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto),
    qrCode,
  },
  {
    title: 'Injected',
    icon: '/images/wallets/account_balance_wallet_filled.svg',
    connectorId: ConnectorNames.Injected,
    installed: isMobileOnly && Boolean(window.ethereum),
  },
]
