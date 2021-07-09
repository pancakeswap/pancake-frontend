import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import usePreviousValue from 'hooks/usePreviousValue'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch, useGetSortedRounds } from 'state/hooks'
import useSwiper from './useSwiper'

/**
 * Hooks for actions to be performed when the round changes
 */
const useOnNextRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  const { account } = useWeb3React()
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
  }, [previousEpoch, currentEpoch, rounds, swiper, account, dispatch])
}

export default useOnNextRound
