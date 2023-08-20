import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getHashFromRouter } from 'utils/getHashFromRouter'

const useScrollToHash = (isFetching: boolean, enabled: boolean) => {
  const router = useRouter()
  const [initialScrollDone, setInitialScrollDone] = useState(false)

  useEffect(() => {
    if (enabled && !isFetching && router.isReady && !initialScrollDone) {
      const hashFromRouter = getHashFromRouter(router)?.[0].replace('#', '')
      if (hashFromRouter !== null && hashFromRouter !== '') {
        const elementToScroll = document.getElementById(hashFromRouter)
        if (elementToScroll && window) {
          const scrollAfter = setTimeout(() => {
            const currentElementToScroll = document.getElementById(hashFromRouter)
            if (currentElementToScroll) {
              window.scrollTo({
                top: currentElementToScroll.offsetTop,
              })
              setInitialScrollDone(true)
            }
          }, 100)
          return () => {
            clearTimeout(scrollAfter)
          }
        }
      }
    }
    return undefined
  }, [router, isFetching, initialScrollDone, enabled])
}

export default useScrollToHash
