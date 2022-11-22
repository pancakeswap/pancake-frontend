import Cookies from 'js-cookie'

import { atom, useAtom } from 'jotai'
import { INFO_BUCKETS_COOKIES } from 'config/constants'

const bucketInfoAtom = atom(() => Cookies.get(INFO_BUCKETS_COOKIES))

export function useInfoBucket() {
  return useAtom(bucketInfoAtom)
}
