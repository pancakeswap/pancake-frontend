import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getHashFromRouter } from 'utils/getHashFromRouter'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

const useScrollToHash = (isFetching: boolean, enabled: boolean) => {
  const router = useRouter()
  const { account } = useAccountActiveChain()
  const [initialScrollDone, setInitialScrollDone] = useState(false)

  useEffect(() => {
    if (account && enabled && !isFetching && router.isReady && !initialScrollDone) {
      const hashFromRouter = getHashFromRouter(router)?.[0]
      if (hashFromRouter !== null && hashFromRouter !== '') {
        const elementToScroll = document.getElementById(hashFromRouter)
        if (elementToScroll && window) {
          const scrollAfter = setTimeout(() => {
            const elementToScrollNewPosition = document.getElementById(hashFromRouter)
            if (elementToScrollNewPosition) {
              window.scrollTo({
                top: elementToScrollNewPosition.offsetTop,
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
