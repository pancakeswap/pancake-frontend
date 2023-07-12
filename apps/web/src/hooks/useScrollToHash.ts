import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'

const useScrollToHash = (isFetching: boolean, enabled: boolean) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialScrollDone, setInitialScrollDone] = useState(false)

  useEffect(() => {
    if (enabled && !isFetching && router.isReady && !initialScrollDone) {
      const hashFromRouter = searchParams.get('to')
      if (hashFromRouter !== null && hashFromRouter !== '') {
        const elementToScroll = document.getElementById(hashFromRouter)
        if (elementToScroll && window) {
          const scrollAfter = setTimeout(() => {
            window.scrollTo({
              top: elementToScroll.offsetTop,
            })
            setInitialScrollDone(true)
          }, 500)

          return () => {
            clearTimeout(scrollAfter)
            setInitialScrollDone(false)
          }
        }
      }
    }
    return undefined
  }, [router, isFetching, initialScrollDone, enabled])
}

export default useScrollToHash
