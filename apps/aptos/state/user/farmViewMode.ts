import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum ViewMode {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

const userFarmViewModeAtom = atomWithStorage<ViewMode.CARD | ViewMode.TABLE>('pcs:farms-view-mode', ViewMode.TABLE)

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
