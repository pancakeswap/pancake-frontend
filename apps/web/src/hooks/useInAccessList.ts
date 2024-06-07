import { useEffect, useState } from 'react'

import { type Serializable, type AccessList, createAccessList } from 'utils/accessList'

export function createUseInAccessListHook(list: Serializable[]) {
  return function useInAccessList(item?: Serializable) {
    const [accessList, setAccessList] = useState<AccessList | undefined>()
    const [inList, setInList] = useState(false)

    useEffect(() => {
      let unmounted = false
      createAccessList(list)
        .then((al) => {
          if (unmounted) {
            return
          }
          setAccessList(al)
        })
        .catch((e) => console.error(e))
      return () => {
        unmounted = true
      }
    }, [])

    useEffect(() => {
      if (!accessList || !item) {
        return
      }

      accessList
        .isInList(item)
        .then(setInList)
        .catch((e) => {
          console.error('Failed to check access status of', item, e)
        })
    }, [accessList, item])

    return inList
  }
}
