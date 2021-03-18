import React from 'react'
import SwiperCore from 'swiper'
import { useGetCurrentEpoch, useIsNextRound } from 'state/hooks'
import { Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import NextRoundCard from './NextRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
  swiperInstance: SwiperCore
}

const RoundCard: React.FC<RoundCardProps> = ({ round, swiperInstance }) => {
  const currentEpoch = useGetCurrentEpoch()
  const isNextRound = useIsNextRound(round.epoch)

  if (round.epoch === currentEpoch) {
    return <LiveRoundCard round={round} />
  }

  if (isNextRound) {
    return <NextRoundCard round={round} swiperInstance={swiperInstance} />
  }

  if (round.epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  return <ExpiredRoundCard round={round} />
}

export default RoundCard
