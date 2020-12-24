import { useEffect } from 'react'
import { useParticleBurst } from '@pancakeswap-libs/uikit'
import { useLocation } from 'react-router-dom'

const disableWhenNotChristmas = () => {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  if (month !== 12) {
    return true
  }

  if (![24, 25].includes(day)) {
    return true
  }

  return false
}

const useMerryChristmas = () => {
  const { pathname } = useLocation()
  const { initialize, teardown } = useParticleBurst({
    imgSrc: '/images/bunny-santa.svg',
    disableWhen: disableWhenNotChristmas,
    debounceDuration: 1000,
  })

  useEffect(() => {
    initialize()

    return () => teardown()
  }, [pathname, initialize, teardown])
}

export default useMerryChristmas
