import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userChartAtom = atomWithStorage('pcs:user-chart', false)

export function useUserChart() {
  return useAtom(userChartAtom)
}
