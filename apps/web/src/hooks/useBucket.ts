import Cookies from 'js-cookie'

import { atom, useAtom } from 'jotai'

const bucketInfoAtom = atom(Cookies.get('bucket-info'))

export function useInfoBucket() {
  return useAtom(bucketInfoAtom)
}
