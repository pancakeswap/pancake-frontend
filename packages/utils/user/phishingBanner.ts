import dayjs from 'dayjs'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const phishingBannerAtom = atomWithStorage<number>('pcs:phishing-banner', 0)

const hidePhishingBannerAtom = atom(
  (get) => {
    const now = dayjs()
    const last = dayjs(get(phishingBannerAtom)).add(1, 'day')
    return last && now.unix() > last.unix()
  },
  (_, set) => set(phishingBannerAtom, Date.now()),
)

export function usePhishingBanner() {
  return useAtom(hidePhishingBannerAtom)
}
