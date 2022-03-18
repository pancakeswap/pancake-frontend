import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import usePreviousValue from 'hooks/usePreviousValue'
import { useAppDispatch } from 'state'
import orderBy from 'lodash/orderBy'
import { useGetCurrentEpoch, useGetRounds } from 'state/predictions/hooks'
import useSwiper from './useSwiper'

/**
 * Hooks for actions to be performed when the round changes
 */
const useOnNextRound = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { swiper } = useSwiper()
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetRounds()
  const roundsEpochsString = JSON.stringify(
    Object.keys(rounds)
      .map((roundKey) => parseInt(roundKey))
      .sort((a, b) => a - b),
  )
  const previousEpoch = usePreviousValue(currentEpoch)
  const previousRoundsEpochsString = usePreviousValue(roundsEpochsString)

  useEffect(() => {
    if (
      swiper &&
      currentEpoch !== undefined &&
      previousEpoch !== undefined &&
      (currentEpoch !== previousEpoch || roundsEpochsString !== previousRoundsEpochsString)
    ) {
      const currentEpochIndex = orderBy(Object.values(rounds), ['epoch'], ['asc']).findIndex(
        (round) => round.epoch === currentEpoch,
      )

      // Slide to the current LIVE round which is always the one before the current round
      swiper.slideTo(currentEpochIndex - 1)
      swiper.update()
    }
  }, [previousEpoch, currentEpoch, previousRoundsEpochsString, roundsEpochsString, rounds, swiper, account, dispatch])
}

export default useOnNextRound
