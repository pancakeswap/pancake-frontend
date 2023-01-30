import { useEffect } from 'react'
import { useParticleBurst, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const disableWhenNotCNY = () => {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  if (month === 1 && day > 15) {
    return false
  }

  return true
}

const useChineseNewYearEffect = () => {
  const { pathname } = useRouter()
  const { isMobile } = useMatchBreakpoints()

  const { initialize, teardown } = useParticleBurst({
    imgSrc: '/images/cny-asset/redpocket.png',
    disableWhen: () => disableWhenNotCNY() || isMobile,
    debounceDuration: 1000,
  })

  useEffect(() => {
    initialize()

    return () => teardown()
  }, [pathname, initialize, teardown])
}

export default useChineseNewYearEffect
