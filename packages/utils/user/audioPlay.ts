import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const userAudioPlayAtom = atomWithStorage('pcs:audio-play-2', false, undefined, { unstable_getOnInit: true })

export function useAudioPlay() {
  return useAtom(userAudioPlayAtom)
}
