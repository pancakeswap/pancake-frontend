import { atom, useAtom } from 'jotai'
import { differenceInDays } from 'date-fns'
import { atomWithStorage } from 'jotai/utils'

const phishingBannerAtom = atomWithStorage<number>('pcs:phishing-banner', 0)

const hidePhishingBannerAtom = atom(
  (get) => {
    const now = Date.now()
    const last = get(phishingBannerAtom)
    return last ? differenceInDays(now, last) >= 1 : true
  },
  (_, set) => set(phishingBannerAtom, Date.now()),
)

export function usePhishingBanner() {
  return useAtom(hidePhishingBannerAtom)
}
