import { useAtomValue } from 'jotai'
import { asyncFarmPoolsAtom } from './state/farmPoolsAtom'

export const useFarmPools = () => {
  return useAtomValue(asyncFarmPoolsAtom)
}
