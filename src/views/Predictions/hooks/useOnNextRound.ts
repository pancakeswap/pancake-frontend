import { useLayoutEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import usePreviousValue from 'hooks/usePreviousValue'
import { useAppDispatch } from 'state'
import { useGetSortedRoundsCurrentEpoch } from 'state/predictions/hooks'
import useSwiper from './useSwiper'

/**
 * Hooks for actions to be performed when the round changes
 */
const useOnNextRound = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { swiper } = useSwiper()
  const { currentEpoch, rounds } = useGetSortedRoundsCurrentEpoch()
  const roundsEpochsString = JSON.stringify(Object.keys(rounds))
  const previousEpoch = usePreviousValue(currentEpoch)
  const previousRoundsEpochsString = usePreviousValue(roundsEpochsString)
  const previousActiveRoundIndex = useRef(0)

  useLayoutEffect(() => {
    if (
      swiper &&
      currentEpoch &&
      previousEpoch &&
      (currentEpoch !== previousEpoch || roundsEpochsString !== previousRoundsEpochsString)
    ) {
      const currentEpochIndex = rounds.findIndex((round) => round.epoch === currentEpoch)

      // Slide to the current LIVE round which is always the one before the current round
      if (currentEpoch !== previousEpoch) {
        swiper.slideTo(currentEpochIndex - 1)
        previousActiveRoundIndex.current = currentEpochIndex - 1
      } else if (swiper.activeIndex === previousActiveRoundIndex.current) {
        // The check above is not to slide after the removal of earliest round if user goes to another slide than active round meanwhile
        swiper.slideTo(currentEpochIndex - 1, 0)
      }
    }
  }, [previousEpoch, currentEpoch, previousRoundsEpochsString, roundsEpochsString, rounds, swiper, account, dispatch])
}

export default useOnNextRound
