export enum GTMEvent {
  EventTracking = 'eventTracking',
}

export enum GTMCategory {
  TokenHighlight = 'TokenHighlight',
}

export enum GTMAction {
  ClickTradeButton = 'Click Trade Button',
}

interface CustomGTMDataLayer {
  event: GTMEvent
  category: GTMCategory
  action: GTMAction
  label: string
}

type WindowWithDataLayer = Window & {
  dataLayer: CustomGTMDataLayer[] | undefined
}

declare const window: WindowWithDataLayer

export const customGTMEvent: WindowWithDataLayer['dataLayer'] =
  typeof window !== 'undefined' ? window?.dataLayer : undefined
