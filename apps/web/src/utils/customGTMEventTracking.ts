export type dataLayerKeys = 'event' | 'category' | 'action' | 'label'
type WindowWithDataLayer = Window & {
  customDataLayer: Record<dataLayerKeys, string>[] | undefined
}

declare const window: WindowWithDataLayer

export const customGTMEvent: WindowWithDataLayer['customDataLayer'] = window?.customDataLayer
