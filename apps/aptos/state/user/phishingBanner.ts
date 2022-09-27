import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const pishingBannerAtom = atomWithStorage<boolean>('pcs:phishing-banner', true)

const hidePhishingBannerAtom = atom(
  (get) => get(pishingBannerAtom),
  (_, set) => set(pishingBannerAtom, false),
)

export function usePhishingBanner() {
  return useAtom(hidePhishingBannerAtom)
}
