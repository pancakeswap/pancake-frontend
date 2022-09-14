import { MartianWalletIcon, PetraWalletIcon, WalletConfig } from '@pancakeswap/uikit'

export enum ConnectorNames {
  Petra = 'petra',
  Martian = 'martian',
}

export const wallets: WalletConfig<ConnectorNames>[] = [
  {
    title: 'Petra',
    icon: PetraWalletIcon,
    installed: typeof window !== 'undefined' && Boolean(window.aptos),
    connectorId: ConnectorNames.Petra,
    priority: 1,
    downloadLink: {
      desktop: 'https://petra.app/',
    },
  },
  {
    title: 'Martian',
    icon: MartianWalletIcon,
    installed: typeof window !== 'undefined' && Boolean(window.martian),
    connectorId: ConnectorNames.Martian,
    priority: 2,
    downloadLink: {
      desktop: 'https://martianwallet.xyz/',
    },
  },
]
