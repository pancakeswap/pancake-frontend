import { INFO_BUCKETS_COOKIES } from 'config/constants/info'
import { atom, useAtom } from 'jotai'
import Cookies from 'js-cookie'

const bucketInfoAtom = atom(() => Cookies.get(INFO_BUCKETS_COOKIES))

export function useInfoBucket() {
  return useAtom(bucketInfoAtom)
}
