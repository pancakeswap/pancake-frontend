export enum GTMEvent {
  EventTracking = 'eventTracking',
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

export const logGTMClickSwapEvent = () => {
  customGTMEvent?.push({
    event: GTMEvent.EventTracking,
    action: GTMAction.ClickSwapButton,
    category: GTMCategory.Swap,
  })
}
