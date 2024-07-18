import { useAtomValue } from 'jotai'
import { ChainIdAddressKey } from '../type'
import { poolAprAtom } from './atom'

export const usePoolApr = (key: ChainIdAddressKey) => {
  return useAtomValue(poolAprAtom)[key]
}

export const usePoolsApr = () => {
  return useAtomValue(poolAprAtom)
}
