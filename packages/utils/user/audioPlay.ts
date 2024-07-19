import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { isClient } from './isClient'

const userAudioPlayAtom = atomWithStorage(
  'pcs:audio-play-2',
  false,
  undefined,
  isClient ? { unstable_getOnInit: true } : undefined,
)

export function useAudioPlay() {
  return useAtom(userAudioPlayAtom)
}
