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
  },
  {
    title: 'Martian Wallet',
    icon: BinanceChainIcon,
    installed: typeof window !== 'undefined' && Boolean(window.martian),
    connectorId: ConnectorNames.Martian,
    priority: 2,
  },
]
