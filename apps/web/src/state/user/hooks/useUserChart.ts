import { atom, useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userChartAtom = atomWithStorageWithErrorCatch('pcs:user-chart', false)
const mobileUserChartAtom = atom(false)

export function useUserChart(isMobile: boolean) {
  return useAtom(isMobile ? mobileUserChartAtom : userChartAtom)
}
