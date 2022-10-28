import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum ViewMode {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

const DEFAULT_MODE = ViewMode.TABLE

const userFarmViewModeAtom = atomWithStorage<ViewMode.CARD | ViewMode.TABLE>('pcs:farms-view-mode', DEFAULT_MODE)
const userPoolsViewModeAtom = atomWithStorage<ViewMode.CARD | ViewMode.TABLE>('pcs:pools-view-mode', DEFAULT_MODE)

const userFarmViewModeLocalStorage = atom(
  (get) => {
    const got = get(userFarmViewModeAtom)
    if (got === ViewMode.TABLE) {
      return ViewMode.TABLE
    }
    return ViewMode.CARD
  },
  (_get, set, mode: ViewMode) => {
    set(userFarmViewModeAtom, mode)
  },
)

export function useFarmViewMode() {
  return useAtom(userFarmViewModeLocalStorage)
}

const userPoolsViewModeLocalStorage = atom(
  (get) => {
    const got = get(userPoolsViewModeAtom)
    if (got === ViewMode.TABLE) {
      return ViewMode.TABLE
    }
    return ViewMode.CARD
  },
  (_get, set, mode: ViewMode) => {
    set(userPoolsViewModeAtom, mode)
  },
)

export function usePoolsViewMode() {
  return useAtom(userPoolsViewModeLocalStorage)
}
