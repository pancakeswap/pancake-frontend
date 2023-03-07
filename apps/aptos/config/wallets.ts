import { WalletConfigV2 } from '@pancakeswap/ui-wallets'

export enum ConnectorNames {
  Petra = 'petra',
  Martian = 'martian',
  Pontem = 'pontem',
  Fewcha = 'fewcha',
  Blocto = 'blocto',
  TrustWallet = 'trustWallet',
  SafePal = 'safePal',
}

export const wallets: WalletConfigV2<ConnectorNames>[] = [
  {
    id: 'petra',
    title: 'Petra',
    icon: '/images/wallets/petra.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.aptos)
    },
    connectorId: ConnectorNames.Petra,
    downloadLink: {
      desktop: 'https://petra.app/',
    },
  },
  {
    id: 'martian',
    title: 'Martian',
    icon: '/images/wallets/martian.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.martian)
    },
    connectorId: ConnectorNames.Martian,
    downloadLink: {
      desktop: 'https://martianwallet.xyz/',
    },
  },
  {
    id: 'pontem',
    title: 'Pontem',
    icon: '/images/wallets/pontem.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.pontem)
    },
    connectorId: ConnectorNames.Pontem,
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba',
    },
  },
  {
    id: 'fewcha',
    title: 'Fewcha',
    icon: '/images/wallets/fewcha.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.fewcha)
    },
    connectorId: ConnectorNames.Fewcha,
    downloadLink: {
      desktop: 'https://fewcha.app/',
    },
  },
  {
    id: 'blocto',
    title: 'Blocto',
    icon: '/images/wallets/blocto.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.bloctoAptos) ? true : undefined // undefined to show SDK
    },
    connectorId: ConnectorNames.Blocto,
  },
  {
    id: 'trustWallet',
    title: 'Trust Wallet',
    icon: 'https://pancakeswap.finance/images/wallets/trust.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.aptos) && Boolean((window.aptos as any)?.isTrust)
    },
    deepLink: 'https://link.trustwallet.com/open_url?coin_id=637&url=https://aptos.pancakeswap.finance/',
    connectorId: ConnectorNames.TrustWallet,
  },
  {
    id: 'safePal',
    title: 'SafePal',
    icon: 'https://pancakeswap.finance/images/wallets/safepal.png',
    get installed() {
      return typeof window !== 'undefined' && Boolean(window.safePal) && Boolean((window.safePal as any)?.sfpPlatform)
    },
    connectorId: ConnectorNames.SafePal,
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    },
  },
]
