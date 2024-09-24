export enum GTMEvent {
  StartQuest = 'startQuest',
}

export enum GTMCategory {
  Quest = 'Quest',
}

export enum GTMAction {
  ClickStartQuestButton = 'Click Start Quest Button',
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

export const logGTMClickStartQuestEvent = (label?: string) => {
  console.info('---StartQuest---')
  window?.dataLayer?.push({
    event: GTMEvent.StartQuest,
    action: GTMAction.ClickStartQuestButton,
    category: GTMCategory.Quest,
    label,
  })
}
