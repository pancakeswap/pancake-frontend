import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userAudioPlayAtom = atomWithStorage('pcs:audio-play-2', false)

export function useAudioPlay() {
  return useAtom(userAudioPlayAtom)
}
