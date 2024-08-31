export enum GTMEvent {
  EventTracking = 'eventTracking',
  Swap = 'swap',
  SwapTxSent = 'swapTxSent',
  SwapConfirmed = 'swapConfirmed',
  AddLiquidity = 'addLiquidity',
  AddLiquidityConfirmed = 'addLiquidityConfirmed',
  AddLiquidityTxSent = 'addLiquidityTxSent',
  RemoveLiquidity = 'removeLiquidity',
  StakeFarm = 'stakeFarm',
  StakeFarmConfirmed = 'stakeFarmConfirmed',
  StakeFarmTxSent = 'stakeFarmTxSent',
  UnStakeFarm = 'unStakeFarm',
  WalletConnect = 'walletConnect',
  Web3WalletView = 'Web3WalletView',
  MenuClick = 'menuClick',
  StakePool = 'stakePool',
  PositionManagerAddLiquidity = 'positionManagerAddLiquidity',
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
  Pool = 'Pool',
  PositionManager = 'PositionManager',
}

export enum GTMAction {
  ClickTradeButton = 'Click Trade Button',
  ClickSwapButton = 'Click Swap Button',
  ClickSwapConfirmButton = 'Click Swap Confirm Button',
  SwapTransactionSent = 'Swap Transaction Sent',
  ClickAddLiquidityConfirmButton = 'Click Add Liquidity Confirm Button',
  AddLiquidityTransactionSent = 'Add Liquidity Transaction Sent',
  ClickAddLiquidityButton = 'Click Add Liquidity Button',
  ClickRemoveLiquidityButton = 'Click Remove Liquidity Button',
  ClickStakeFarmButton = 'Click Stake Farm Button',
  ClickStakeFarmConfirmButton = 'Click Stake Farm Confirm Button',
  StakeFarmTransactionSent = 'Stake Farm Transaction Sent',
  ClickUnStakeFarmButton = 'Click UnStake Farm Button',
  ClickWalletConnectButton = 'Click Wallet Connect and Connected',
  Web3WalletView = 'Web3 Wallet Page View',
  ClickStakePoolButton = 'Click Stake Pool Button',
  ClickEnablePoolButton = 'Click Enable Pool Button',
  ClickUnstakePoolButton = 'Click Unstake Pool Button',
  ClickAddLiquidityPositionManagerButton = 'Click Add Liquidity Position Manager Button',
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

export const logGTMClickSwapConfirmEvent = () => {
  console.info('---SwapClickConfirm---')
  window?.dataLayer?.push({
    event: GTMEvent.SwapConfirmed,
    action: GTMAction.ClickSwapConfirmButton,
    category: GTMCategory.Swap,
  })
}

export const logGTMSwapTxSentEvent = () => {
  console.info('---SwapTxSent---')
  window?.dataLayer?.push({
    event: GTMEvent.SwapTxSent,
    action: GTMAction.SwapTransactionSent,
    category: GTMCategory.Swap,
  })
}

export const logGTMClickStakeFarmEvent = () => {
  console.info('---Stake---')
  window?.dataLayer?.push({
    event: GTMEvent.StakeFarm,
    action: GTMAction.ClickStakeFarmButton,
    category: GTMCategory.Farm,
  })
}

export const logGTMClickStakeFarmConfirmEvent = () => {
  console.info('---StakeFarmConfirmed---')
  window?.dataLayer?.push({
    event: GTMEvent.StakeFarmConfirmed,
    action: GTMAction.ClickStakeFarmConfirmButton,
    category: GTMCategory.Farm,
  })
}

export const logGTMStakeFarmTxSentEvent = () => {
  console.info('---StakeFarmTxSent---')
  window?.dataLayer?.push({
    event: GTMEvent.StakeFarmTxSent,
    action: GTMAction.StakeFarmTransactionSent,
    category: GTMCategory.Farm,
  })
}

export const logGTMClickUnStakeFarmEvent = () => {
  console.info('---UnStake---')
  window?.dataLayer?.push({
    event: GTMEvent.UnStakeFarm,
    action: GTMAction.ClickUnStakeFarmButton,
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

export const logGTMClickAddLiquidityConfirmEvent = () => {
  console.info('---AddLiquidityConfirmed---')
  window?.dataLayer?.push({
    event: GTMEvent.AddLiquidityConfirmed,
    action: GTMAction.ClickAddLiquidityConfirmButton,
    category: GTMCategory.AddLiquidity,
  })
}

export const logGTMAddLiquidityTxSentEvent = () => {
  console.info('---AddLiquidityTxSent---')
  window?.dataLayer?.push({
    event: GTMEvent.AddLiquidityTxSent,
    action: GTMAction.AddLiquidityTransactionSent,
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

export const logGTMClickStakePoolEvent = (poolName?: string) => {
  console.info('---StakePool---')
  window?.dataLayer?.push({
    event: GTMEvent.StakePool,
    action: GTMAction.ClickStakePoolButton,
    category: GTMCategory.Pool,
    label: poolName,
  })
}

export const logGTMClickEnablePoolEvent = (poolName?: string) => {
  console.info('---EnablePool---')
  window?.dataLayer?.push({
    event: GTMEvent.StakePool,
    action: GTMAction.ClickEnablePoolButton,
    category: GTMCategory.Pool,
    label: poolName,
  })
}

export const logGTMClickUnstakePoolEvent = (poolName?: string) => {
  console.info('---UnstakePool---')
  window?.dataLayer?.push({
    event: GTMEvent.StakePool,
    action: GTMAction.ClickUnstakePoolButton,
    category: GTMCategory.Pool,
    label: poolName,
  })
}

export const logGTMClickPositionManagerAddLiquidityEvent = (tokenPairAndVault?: string) => {
  console.info('---PositionManagerAddLiquidity---')
  window?.dataLayer?.push({
    event: GTMEvent.PositionManagerAddLiquidity,
    action: GTMAction.ClickAddLiquidityPositionManagerButton,
    category: GTMCategory.PositionManager,
    label: tokenPairAndVault,
  })
}
