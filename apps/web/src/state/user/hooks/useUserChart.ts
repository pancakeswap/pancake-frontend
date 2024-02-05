import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userChartAtom = atomWithStorage('pcs:user-chart', false)
const mobileUserChartAtom = atom(false)

export function useUserChart(isMobile: boolean) {
  return useAtom(isMobile ? mobileUserChartAtom : userChartAtom)
}
