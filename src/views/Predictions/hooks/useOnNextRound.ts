import usePreviousValue from 'hooks/usePreviousValue'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch, useGetSortedRounds } from 'state/hooks'
import useSwiper from './useSwiper'

const useOnNextRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  const previousEpoch = usePreviousValue(currentEpoch)
  const { swiper } = useSwiper()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (swiper && currentEpoch !== undefined && previousEpoch !== undefined && currentEpoch !== previousEpoch) {
      const currentEpochIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

      // Slide to the current LIVE round which is always the one before the current round
      swiper.slideTo(currentEpochIndex - 1)
      swiper.update()
    }
  }, [previousEpoch, currentEpoch, rounds, swiper, dispatch])
}

export default useOnNextRound
