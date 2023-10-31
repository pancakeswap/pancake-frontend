export enum MANAGER {
  PCS = 'pcs-position-manager',
  BRIL = 'bril-position-manager',
  RANGE = 'range-protocol-pr-position-manager',
}

export interface BaseManager {
  id: MANAGER
  name: string
  introLink?: string
}

export const baseManagers: { [manager in MANAGER]: BaseManager } = {
  [MANAGER.PCS]: {
    id: MANAGER.PCS,
    name: 'PCS',
  },
  [MANAGER.BRIL]: {
    id: MANAGER.BRIL,
    name: 'Bril Finance',
    introLink: 'https://www.bril.finance/',
  },
  [MANAGER.RANGE]: {
    id: MANAGER.RANGE,
    name: 'Range Protocol',
    introLink: 'https://www.rangeprotocol.com/',
  },
}

export const VERIFIED_MANAGERS = [MANAGER.PCS]
