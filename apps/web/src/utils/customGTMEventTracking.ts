export enum GTMEvent {
  EventTracking = 'eventTracking',
  Swap = 'swap',
  AddLiquidity = 'addLiquidity',
  Farm = 'stakeFarm',
}

export enum GTMCategory {
  TokenHighlight = 'TokenHighlight',
  Swap = 'Swap',
  AddLiquidity = 'AddLiquidity',
  Farm = 'Farm',
}

export enum GTMAction {
  ClickTradeButton = 'Click Trade Button',
  ClickSwapButton = 'Click Swap Button',
  ClickAddLiquidityButton = 'Click Add Liquidity Button',
  ClickStakeButton = 'Click Stake Button',
}

interface CustomGTMDataLayer {
  event: GTMEvent
  category: GTMCategory
  action: GTMAction
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

export const logGTMClickAddLiquidityEvent = () => {
  console.info('---AddLiquidity---')
  window?.dataLayer?.push({
    event: GTMEvent.AddLiquidity,
    action: GTMAction.ClickAddLiquidityButton,
    category: GTMCategory.AddLiquidity,
  })
}
