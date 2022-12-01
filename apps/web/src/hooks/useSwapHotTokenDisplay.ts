import { atom, useAtom } from 'jotai'

const isSwapHotTokenDisplay = atom(false)

export const useSwapHotTokenDisplay = () => {
  return useAtom(isSwapHotTokenDisplay)
}
