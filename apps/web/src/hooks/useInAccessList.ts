import { useEffect, useState } from 'react'

import { type Serializable, type AccessList, createAccessList } from 'utils/accessList'

export function createUseInAccessListHook(list: Serializable[]) {
  return function useInAccessList(item?: Serializable) {
    const [accessList, setAccessList] = useState<AccessList | undefined>()
    const [inList, setInList] = useState<[Serializable | undefined, boolean]>([undefined, false])

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
      let unmounted = false
      const unmount = () => {
        unmounted = true
      }

      if (!accessList || !item) {
        return unmount
      }

      setInList([undefined, false])
      accessList
        .isInList(item)
        .then((hasAccess) => {
          if (unmounted) return
          setInList([item, hasAccess])
        })
        .catch((e) => {
          console.error('Failed to check access status of', item, e)
          if (unmounted) return
          setInList([item, false])
        })
      return unmount
    }, [accessList, item])

    const [curItem, isInList] = inList
    return curItem === item && isInList
  }
}
