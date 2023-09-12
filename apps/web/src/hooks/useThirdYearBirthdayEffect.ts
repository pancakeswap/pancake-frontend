import { useEffect } from 'react'
import { useParticleBurst } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const useThirdYearBirthdayEffect = () => {
  const { pathname } = useRouter()
  const { initialize, teardown } = useParticleBurst({
    imgSrc: '/images/third-year-cake-icon.png',
    debounceDuration: 1000,
  })

  useEffect(() => {
    initialize()

    return () => teardown()
  }, [pathname, initialize, teardown])
}

export default useThirdYearBirthdayEffect
