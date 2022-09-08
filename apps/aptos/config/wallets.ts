import { BinanceChainIcon, MetamaskIcon, WalletConfig } from '@pancakeswap/uikit'

export enum ConnectorNames {
  Petra = 'petra',
  Martian = 'martian',
}

export const wallets: WalletConfig<ConnectorNames>[] = [
  {
    title: 'Petra',
    icon: MetamaskIcon,
    installed: typeof window !== 'undefined' && Boolean(window.aptos),
    connectorId: ConnectorNames.Petra,
    priority: 1,
    downloadLink: {
      desktop: 'https://petra.app/',
    },
  },
  {
    title: 'Martian Wallet',
    icon: BinanceChainIcon,
    installed: typeof window !== 'undefined' && Boolean(window.martian),
    connectorId: ConnectorNames.Martian,
    priority: 2,
    downloadLink: {
      desktop: 'https://martianwallet.xyz/',
    },
  },
]
