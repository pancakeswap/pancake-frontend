import { ConnectorNames, MetamaskIcon } from '@pancakeswap/uikit'

const wallets = [
  {
    id: ConnectorNames.MetaMask,
    name: 'MetaMask',
    icon: MetamaskIcon,
    deepLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },
  {
    id: 'injected',
    name: 'Injected Wallet',
  },
  {
    id: ConnectorNames.BSC,
    name: 'Binance Wallet',
  },
  {
    id: ConnectorNames.WalletLink,
    name: 'Coinbase Wallet',
  },
]
