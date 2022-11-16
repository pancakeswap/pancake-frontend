import { useAccount } from 'wagmi'
import { useIsomorphicEffect } from '@pancakeswap/uikit'
import { usePreviousValue } from '@pancakeswap/hooks'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useGetSortedRoundsCurrentEpoch } from 'state/predictions/hooks'
import useSwiper from './useSwiper'

/**
 * Hooks for actions to be performed when the round changes
 */
const useOnNextRound = () => {
  const { address: account } = useAccount()
  const dispatch = useLocalDispatch()
  const { swiper } = useSwiper()
  const { currentEpoch, rounds } = useGetSortedRoundsCurrentEpoch()
  const roundsEpochsString = JSON.stringify(Object.keys(rounds))
  const previousEpoch = usePreviousValue(currentEpoch)
  const previousRoundsEpochsString = usePreviousValue(roundsEpochsString)

  useIsomorphicEffect(() => {
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
      } else if (!swiper.isBeginning && !swiper.isEnd) {
        swiper.slideTo(swiper.activeIndex - 1, 0)
      }
    }
  }, [previousEpoch, currentEpoch, previousRoundsEpochsString, roundsEpochsString, rounds, swiper, account, dispatch])
}

export default useOnNextRound
