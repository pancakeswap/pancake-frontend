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
  WalletConfig,
} from '@pancakeswap/uikit'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
}

export const wallets: WalletConfig<ConnectorNames>[] = [
  {
    title: 'Metamask',
    icon: MetamaskIcon,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask),
    connectorId: ConnectorNames.MetaMask,
    priority: 1,
    href: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },
  {
    title: 'Binance Wallet',
    icon: BinanceChainIcon,
    installed: typeof window !== 'undefined' && Boolean(window.BinanceChain),
    connectorId: ConnectorNames.BSC,
    priority: 2,
  },
  {
    title: 'Coinbase Wallet',
    icon: CoinbaseWalletIcon,
    connectorId: ConnectorNames.WalletLink,
    priority: 3,
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
    priority: 4,
    href: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://pancakeswap.finance/',
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related',
    },
  },
  {
    title: 'WalletConnect',
    icon: WalletConnectIcon,
    connectorId: ConnectorNames.WalletConnect,
    priority: 5,
  },
  {
    title: 'Opera Wallet',
    icon: OperaIcon,
    connectorId: ConnectorNames.Injected,
    priority: () => {
      return typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera) ? 0 : 6
    },
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera),
    href: 'https://www.opera.com/crypto/next',
  },
  {
    title: 'Brave Wallet',
    icon: BraveIcon,
    connectorId: ConnectorNames.Injected,
    priority: () => {
      return typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet) ? 0 : 6
    },
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet),
  },
  {
    title: 'MathWallet',
    icon: MathWalletIcon,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet),
    priority: () => {
      // @ts-ignore
      return typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet) ? 0 : 999
    },
  },
  {
    title: 'TokenPocket',
    icon: TokenPocketIcon,
    connectorId: ConnectorNames.Injected,
    priority: () => {
      return typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket) ? 0 : 999
    },
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket),
  },
  {
    title: 'SafePal',
    icon: SafePalIcon,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isSafePal),
    priority: () => {
      // @ts-ignore
      return typeof window !== 'undefined' && Boolean(window.ethereum?.isSafePal) ? 0 : 999
    },
  },
  {
    title: 'Coin98',
    icon: Coin98Icon,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== 'undefined' && (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98)),
    priority: () => {
      // @ts-ignore
      return typeof window !== 'undefined' && (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98)) ? 0 : 999
    },
  },
  {
    title: 'Blocto',
    icon: BloctoIcon,
    connectorId: ConnectorNames.Injected,
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBlocto),
    priority: () => {
      // @ts-ignore
      return typeof window !== 'undefined' && Boolean(window.ethereum?.isBlocto) ? 0 : 999
    },
  },
]
