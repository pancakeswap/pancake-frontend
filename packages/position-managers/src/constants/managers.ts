export enum MANAGER {
  PCS = 'pcs-position-manager',
  ICHI = 'ichi-position-manager',
}

export interface BaseManager {
  id: MANAGER
  name: string
  introLink?: string
  doYourOwnResearchTitle?: string
}

export const baseManagers: { [manager in MANAGER]: BaseManager } = {
  [MANAGER.PCS]: {
    id: MANAGER.PCS,
    name: 'PCS',
  },
  [MANAGER.ICHI]: {
    id: MANAGER.ICHI,
    name: 'ICHI',
    introLink: 'https://www.ichi.org/',
    doYourOwnResearchTitle: 'ICHI Finance',
  },
}

export const VERIFIED_MANAGERS = [MANAGER.PCS]
