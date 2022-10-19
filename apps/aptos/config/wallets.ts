import { WalletConfigV2 } from '@pancakeswap/ui-wallets'

export enum ConnectorNames {
  Petra = 'petra',
  Martian = 'martian',
  Pontem = 'pontem',
  Fewcha = 'fewcha',
}

export const wallets: WalletConfigV2<ConnectorNames>[] = [
  {
    id: 'petra',
    title: 'Petra',
    icon: '/images/wallets/petra.png',
    installed: typeof window !== 'undefined' && Boolean(window.aptos),
    connectorId: ConnectorNames.Petra,
    downloadLink: {
      desktop: 'https://petra.app/',
    },
  },
  {
    id: 'martian',
    title: 'Martian',
    icon: '/images/wallets/martian.png',
    installed: typeof window !== 'undefined' && Boolean(window.martian),
    connectorId: ConnectorNames.Martian,
    downloadLink: {
      desktop: 'https://martianwallet.xyz/',
    },
  },
  {
    id: 'pontem',
    title: 'Pontem',
    icon: '/images/wallets/pontem.png',
    installed: typeof window !== 'undefined' && Boolean(window.pontem),
    connectorId: ConnectorNames.Pontem,
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba',
    },
  },
  {
    id: 'fewcha',
    title: 'Fewcha',
    icon: '/images/wallets/fewcha.png',
    installed: typeof window !== 'undefined' && Boolean(window.fewcha),
    connectorId: ConnectorNames.Fewcha,
    downloadLink: {
      desktop: 'https://fewcha.app/',
    },
  },
]
