import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import {
  BinanceChainIcon,
  BloctoIcon,
  BraveIcon,
  Coin98Icon,
  CoinbaseWalletIcon,
  MathWalletIcon,
  MetamaskIcon,
  OperaIcon,
  SafePalIcon,
  TokenPocketIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@pancakeswap/uikit'
import type { ExtendEthereum } from 'global'
import { isFirefox } from 'react-device-detect'
import { injectedConnector } from '../utils/wagmi'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
}

export const wallets: WalletConfigV2<ConnectorNames>[] = [
  {
    title: 'Metamask',
    icon: MetamaskIcon,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask),
    connectorId: ConnectorNames.MetaMask,
    href: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },
  {
    title: 'Binance Wallet',
    icon: BinanceChainIcon,
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
    icon: CoinbaseWalletIcon,
    connectorId: ConnectorNames.WalletLink,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isCoinbaseWallet),
    noMobile: true,
  },
  {
    title: 'Trust Wallet',
    icon: TrustWalletIcon,
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      (Boolean(window.ethereum?.isTrust) ||
        // @ts-ignore
        Boolean(window.ethereum?.isTrustWallet)),
    href: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://pancakeswap.finance/',
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related',
    },
  },
  {
    title: 'WalletConnect',
    icon: WalletConnectIcon,
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    title: 'Opera Wallet',
    icon: OperaIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera),
    href: 'https://www.opera.com/crypto/next',
  },
  {
    title: 'Brave Wallet',
    icon: BraveIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet),
  },
  {
    title: 'MathWallet',
    icon: MathWalletIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet),
  },
  {
    title: 'TokenPocket',
    icon: TokenPocketIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket),
  },
  {
    title: 'SafePal',
    icon: SafePalIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isSafePal),
  },
  {
    title: 'Coin98',
    icon: Coin98Icon,
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      (Boolean((window.ethereum as ExtendEthereum)?.isCoin98) || Boolean(window.coin98)) &&
      injectedConnector.ready,
  },
  {
    title: 'Blocto',
    icon: BloctoIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto),
  },
]
