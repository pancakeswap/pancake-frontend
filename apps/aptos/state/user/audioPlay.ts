import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userAudioPlayAtom = atomWithStorage<'0' | '1'>('pcs:audio-play', '0')

const userAudioAtomWithLocalStorage = atom(
  (get) => {
    const got = get(userAudioPlayAtom)
    if (got === '1') {
      return true
    }
    return false
  },
  (_get, set, mode: boolean) => {
    const on = mode ? '1' : '0'
    set(userAudioPlayAtom, on)
  },
)

export function useAudioPlay() {
  return useAtom(userAudioAtomWithLocalStorage)
}
