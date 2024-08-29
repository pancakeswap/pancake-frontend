import { atom, useAtom } from 'jotai'

const chainIdAtom = atom<number>(0)

const sessionChainIdAtom = atom(
  (get) => get(chainIdAtom),
  (_get, set, _chainId: number) => {
    set(chainIdAtom, 0)
  },
)

export const useSessionChainId = () => {
  return useAtom(sessionChainIdAtom)
}
