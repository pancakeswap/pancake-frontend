import { atom } from 'jotai'

const USER_AUDIO_PLAY_KEY = 'pcs:audio-play'

const userAudioPlayAtom = atom('0')

export const userAtomWithLocalStorage = atom(
  (get) => get(userAudioPlayAtom),
  (_get, set, mode: boolean) => {
    const on = mode ? '1' : '0'
    set(userAudioPlayAtom, on)
    localStorage.setItem(USER_AUDIO_PLAY_KEY, on)
  },
)

userAtomWithLocalStorage.onMount = (set) => {
  const item = localStorage.getItem(USER_AUDIO_PLAY_KEY)
  if (item && (item === '0' || item === '1')) {
    set(item === '1')
  }
}
