export enum GTMEvent {
  EventTracking = 'eventTracking',
  Swap = 'swap',
  AddLiquidity = 'addLiquidity',
  RemoveLiquidity = 'removeLiquidity',
  Farm = 'stakeFarm',
  UnStakeFarm = 'unStakeFarm',
  WalletConnect = 'walletConnect',
  Web3WalletView = 'Web3WalletView',
  MenuClick = 'menuClick',
}

export enum GTMCategory {
  TokenHighlight = 'TokenHighlight',
  Swap = 'Swap',
  AddLiquidity = 'AddLiquidity',
  RemoveLiquidity = 'RemoveLiquidity',
  Farm = 'Farm',
  UnStakeFarm = 'unStakeFarm',
  WalletConnect = 'WalletConnect',
  Web3WalletView = 'Web3WalletView',
}

export enum GTMAction {
  ClickTradeButton = 'Click Trade Button',
  ClickSwapButton = 'Click Swap Button',
  ClickAddLiquidityButton = 'Click Add Liquidity Button',
  ClickRemoveLiquidityButton = 'Click Remove Liquidity Button',
  ClickStakeButton = 'Click Stake Button',
  ClickUnStakeButton = 'Click UnStake Button',
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

export const logGTMClickTokenHighLightTradeEvent = (label?: string) => {
  console.info('---TokenHeightLightTrade---')
  window?.dataLayer?.push({
    event: GTMEvent.EventTracking,
    action: GTMAction.ClickTradeButton,
    category: GTMCategory.TokenHighlight,
    label,
  })
}

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

export const logGTMClickUnStakeFarmEvent = () => {
  console.info('---UnStake---')
  window?.dataLayer?.push({
    event: GTMEvent.UnStakeFarm,
    action: GTMAction.ClickUnStakeButton,
    category: GTMCategory.UnStakeFarm,
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

export const logGTMClickRemoveLiquidityEvent = () => {
  console.info('---RemoveLiquidity---')
  window?.dataLayer?.push({
    event: GTMEvent.RemoveLiquidity,
    action: GTMAction.ClickRemoveLiquidityButton,
    category: GTMCategory.RemoveLiquidity,
  })
}

export const logGTMWalletConnectEvent = (walletTitle?: string) => {
  console.info('---WalletConnect---')
  window?.dataLayer?.push({
    event: GTMEvent.WalletConnect,
    action: GTMAction.ClickWalletConnectButton,
    category: GTMCategory.WalletConnect,
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

export const logMenuClick = (path: string) => {
  window?.dataLayer?.push({
    event: GTMEvent.MenuClick,
    label: path,
  })
}
