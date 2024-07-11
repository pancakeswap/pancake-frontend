export enum GTMEvent {
  EventTracking = 'eventTracking',
  Swap = 'swap',
  AddLiquidity = 'addLiquidity',
  Farm = 'stakeFarm',
  WalletConnect = 'walletConnect',
  Web3WalletView = 'Web3WalletView',
}

export enum GTMCategory {
  Swap = 'Swap',
  AddLiquidity = 'AddLiquidity',
  Farm = 'Farm',
  WalletConnect = 'WalletConnect',
  Web3WalletView = 'Web3WalletView',
}

export enum GTMAction {
  ClickTradeButton = 'Click Trade Button',
  ClickSwapButton = 'Click Swap Button',
  ClickAddLiquidityButton = 'Click Add Liquidity Button',
  ClickStakeButton = 'Click Stake Button',
  ClickWalletConnectButton = 'Click Wallet Connect and Connected',
  Web3WalletView = 'Web3 Wallet Page View',
}

interface CustomGTMDataLayer {
  event: GTMEvent
  category?: GTMCategory
  action?: GTMAction
  label?: string
}

type WindowWithDataLayer = Window & {
  dataLayer: CustomGTMDataLayer[] | undefined
}

declare const window: WindowWithDataLayer

export const customGTMEvent: WindowWithDataLayer['dataLayer'] =
  typeof window !== 'undefined' ? window?.dataLayer : undefined

export const logGTMClickSwapEvent = () => {
  console.info('---Swap---')
  window?.dataLayer?.push({
    event: GTMEvent.Swap,
    action: GTMAction.ClickSwapButton,
    category: GTMCategory.Swap,
  })
}

export const logGTMClickStakeFarmEvent = () => {
  console.info('---Stake---')
  window?.dataLayer?.push({
    event: GTMEvent.Farm,
    action: GTMAction.ClickStakeButton,
    category: GTMCategory.Farm,
  })
}

export const logGTMClickAddLiquidityEvent = () => {
  console.info('---AddLiquidity---')
  window?.dataLayer?.push({
    event: GTMEvent.AddLiquidity,
    action: GTMAction.ClickAddLiquidityButton,
    category: GTMCategory.AddLiquidity,
  })
}

export const logGTMWalletConnectEvent = (walletTitle?: string) => {
  console.info('---WalletConnect---')
  window?.dataLayer?.push({
    event: GTMEvent.WalletConnect,
    label: walletTitle,
  })
}

export const logWeb3WalletViews = () => {
  console.info('---web3WalletView---')
  window?.dataLayer?.push({
    event: GTMEvent.Web3WalletView,
    action: GTMAction.Web3WalletView,
    category: GTMCategory.Web3WalletView,
  })
}
