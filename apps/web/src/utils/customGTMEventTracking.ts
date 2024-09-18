import { PoolIds } from '@pancakeswap/ifos'
import { BetPosition } from '@pancakeswap/prediction'

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
  LockCake = 'lockCake',
  BuyLotteryTickets = 'buyLotteryTickets',
  FiatOnRampModalOpened = 'fiatOnRampModalOpened',
  PredictionBet = 'predictionBet',
  PredictionBetPlaced = 'predictionBetPlaced',

  // IFO
  IFOGoToCakeStaking = 'ifoGoToCakeStaking',
  IFOCommit = 'ifoCommit',
  IFOCommitTxnSent = 'ifoCommitTxnSent',
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
  CakeStaking = 'CakeStaking',
  Lottery = 'Lottery',
  FiatOnRamp = 'FiatOnRamp',
  Prediction = 'Prediction',
  IFO = 'IFO',
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
  ClickLockCakeButton = 'Click Lock CAKE Button',
  ClickBuyLotteryTicketsButton = 'Click Buy Lottery Tickets Button',
  ClickFiatOnRampModalButton = 'Click Fiat On-Ramp Modal Button',
  ClickBetUpButton = 'Click Bet Up Button',
  ClickBetDownButton = 'Click Bet Down Button',
  PredictionBetPlaced = 'Prediction Bet Placed',

  // IFO
  ClickGoToCakeStakingButton = 'Click Go To Cake Staking Button',
  ClickCommitPublicSale = 'Click Commit Button for Public Sale',
  ClickCommitBasicSale = 'Click Commit Button for Basic Sale',
  CommitTxnSentPublicSale = 'Commit Transaction Sent for Public Sale',
  CommitTxnSentBasicSale = 'Commit Transaction Sent for Basic Sale',
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

export const logGTMClickLockCakeEvent = () => {
  console.info('---LockCake---')
  window?.dataLayer?.push({
    event: GTMEvent.LockCake,
    action: GTMAction.ClickLockCakeButton,
    category: GTMCategory.CakeStaking,
  })
}

export const logGTMBuyLotteryTicketsEvent = (numberOfTickets: string) => {
  console.info('---BuyLotteryTickets---')
  window?.dataLayer?.push({
    event: GTMEvent.BuyLotteryTickets,
    action: GTMAction.ClickBuyLotteryTicketsButton,
    category: GTMCategory.Lottery,
    label: `Number of tickets: ${numberOfTickets}`,
  })
}

export const logGTMFiatOnRampModalEvent = (provider: string | undefined) => {
  console.info('---FiatOnRampModalOpened---')
  window?.dataLayer?.push({
    event: GTMEvent.FiatOnRampModalOpened,
    action: GTMAction.ClickFiatOnRampModalButton,
    category: GTMCategory.FiatOnRamp,
    label: `Provider: ${provider || 'Unknown'}`,
  })
}

export const logGTMPredictionBetEvent = (position: BetPosition) => {
  console.info(`---PredictionBet${position}---`)
  window?.dataLayer?.push({
    event: GTMEvent.PredictionBet,
    action: position === BetPosition.BULL ? GTMAction.ClickBetUpButton : GTMAction.ClickBetDownButton,
    category: GTMCategory.Prediction,
  })
}

export const logGTMPredictionBetPlacedEvent = (position: string) => {
  console.info('---PredictionBetPlaced---')
  window?.dataLayer?.push({
    event: GTMEvent.PredictionBetPlaced,
    action: GTMAction.PredictionBetPlaced,
    category: GTMCategory.Prediction,
    label: `Position: ${position}`,
  })
}

export const logGTMIfoGoToCakeStakingEvent = () => {
  console.info('---IFOGoToCakeStaking---')
  window?.dataLayer?.push({
    event: GTMEvent.IFOGoToCakeStaking,
    action: GTMAction.ClickGoToCakeStakingButton,
    category: GTMCategory.IFO,
  })
}

export const logGTMIfoCommitEvent = (poolId: PoolIds) => {
  console.info('---IFOCommit---')
  window?.dataLayer?.push({
    event: GTMEvent.IFOCommit,
    action: poolId === PoolIds.poolUnlimited ? GTMAction.ClickCommitPublicSale : GTMAction.ClickCommitBasicSale,
    category: GTMCategory.IFO,
  })
}

export const logGTMIfoCommitTxnSentEvent = (poolId: PoolIds) => {
  console.info('---IFOCommitTxnSent---')
  window?.dataLayer?.push({
    event: GTMEvent.IFOCommitTxnSent,
    action: poolId === PoolIds.poolUnlimited ? GTMAction.CommitTxnSentPublicSale : GTMAction.CommitTxnSentBasicSale,
    category: GTMCategory.IFO,
  })
}
