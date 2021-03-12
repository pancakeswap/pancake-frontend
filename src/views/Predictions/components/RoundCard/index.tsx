import React from 'react'
import { useGetCurrentEpoch } from 'state/hooks'
import { Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const currentEpoch = useGetCurrentEpoch()

  if (round.epoch === currentEpoch) {
    return <LiveRoundCard round={round} />
  }

  if (round.epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  return <ExpiredRoundCard round={round} />
}

export default RoundCard
