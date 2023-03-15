type WindowWithDataLayer = Window & {
  customDataLayer: Record<string, any>[] | undefined
}

declare const window: WindowWithDataLayer

export const customGTMEvent: WindowWithDataLayer['customDataLayer'] = window?.customDataLayer
