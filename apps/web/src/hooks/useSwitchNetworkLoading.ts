import { atom, useAtom } from 'jotai'

const switchNetworkLoadingAtom = atom(false)

export const useSwitchNetworkLoading = () => {
  return useAtom(switchNetworkLoadingAtom)
}
