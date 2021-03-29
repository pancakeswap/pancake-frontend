import { useEffect, useRef } from 'react'
import { useGetCurrentEpoch, useGetSortedRounds } from 'state/hooks'
import useSwiper from './useSwiper'

const useOnNextRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  const previousEpoch = useRef(currentEpoch)
  const { swiper } = useSwiper()

  useEffect(() => {
    if (currentEpoch !== previousEpoch.current) {
      const currentEpochIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

      // Slide to the current LIVE round which is always the one before the current round
      swiper.slideTo(currentEpochIndex - 1)
      previousEpoch.current = currentEpoch
    }
  }, [previousEpoch, currentEpoch, rounds, swiper])
}

export default useOnNextRound
