import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants/exchange'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userSlippageAtom = atomWithStorage('pcs:slippage', INITIAL_ALLOWED_SLIPPAGE)

const userSlippageAtomWithLocalStorage = atom(
  (get) => get(userSlippageAtom),
  (_get, set, slippage: number) => {
    if (typeof slippage === 'number') {
      set(userSlippageAtom, slippage)
    }
  },
)

export const useUserSlippage = () => {
  return useAtom(userSlippageAtomWithLocalStorage)
}
