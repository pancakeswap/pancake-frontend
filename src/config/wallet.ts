import {
  MetamaskIcon,
  WalletConnectIcon,
  TrustWalletIcon,
  MathWalletIcon,
  TokenPocketIcon,
  BinanceChainIcon,
  SafePalIcon,
  Coin98Icon,
  BraveIcon,
  BloctoIcon,
  CoinbaseWalletIcon,
  OperaIcon,
} from '@pancakeswap/uikit'
import { isFirefox } from 'react-device-detect'
import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import { bscConnector, coinbaseConnector, injectedConnector, metaMaskConnector } from '../utils/wagmi'

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
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask) && metaMaskConnector.ready,
    connectorId: ConnectorNames.MetaMask,
    href: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },
  {
    title: 'Binance Wallet',
    icon: BinanceChainIcon,
    installed: typeof window !== 'undefined' && Boolean(window.BinanceChain) && bscConnector.ready,
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
    installed: coinbaseConnector.ready,
  },
  {
    title: 'Trust Wallet',
    icon: TrustWalletIcon,
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      (Boolean(window.ethereum?.isTrust) ||
        // @ts-ignore
        Boolean(window.ethereum?.isTrustWallet)) &&
      injectedConnector.ready,
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
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera) && injectedConnector.ready,
    href: 'https://www.opera.com/crypto/next',
  },
  {
    title: 'Brave Wallet',
    icon: BraveIcon,
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet) && injectedConnector.ready,
  },
  {
    title: 'MathWallet',
    icon: MathWalletIcon,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet) && injectedConnector.ready,
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
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isSafePal),
  },
  {
    title: 'Coin98',
    icon: Coin98Icon,
    connectorId: ConnectorNames.Injected,
    installed:
      typeof window !== 'undefined' &&
      // @ts-ignore
      (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98)) &&
      injectedConnector.ready,
  },
  {
    title: 'Blocto',
    icon: BloctoIcon,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBlocto) && injectedConnector.ready,
  },
]
