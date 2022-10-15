import { WalletConfigV2 } from '@pancakeswap/ui-wallets'

export enum ConnectorNames {
  Petra = 'petra',
  Martian = 'martian',
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
]
