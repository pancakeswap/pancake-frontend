import { atom } from 'jotai'
import { PoolInfo } from '../type'

export const farmPoolsAtom = atom<PoolInfo[]>([])
