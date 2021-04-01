import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useGetCurrentEpoch, useGetSortedRounds } from 'state/hooks'
import useSwiper from './useSwiper'

const useOnNextRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  const previousEpoch = useRef(currentEpoch)
  const { swiper } = useSwiper()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentEpoch !== previousEpoch.current) {
      const currentEpochIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

      // After we slide to the new live card, remove the oldest
      swiper.once('slideChangeTransitionEnd', () => {
        // We only remove the round via Swiper (not Redux) as to not affect the rendering.
        swiper.removeSlide(0)
      })

      // Slide to the current LIVE round which is always the one before the current round
      swiper.slideTo(currentEpochIndex - 1)

      previousEpoch.current = currentEpoch
    }
  }, [previousEpoch, currentEpoch, rounds, swiper, dispatch])
}

export default useOnNextRound
