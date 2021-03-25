import React from 'react'
import { useBlock, useGetCurrentEpoch } from 'state/hooks'
import { Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import OpenRoundCard from './OpenRoundCard'
import BettableRoundCard from './BettableRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const { blockNumber } = useBlock()
  const { epoch, lockPrice, closePrice, endBlock } = round
  const currentEpoch = useGetCurrentEpoch()

  if (endBlock && blockNumber > endBlock) {
    return <ExpiredRoundCard round={round} />
  }

  if (epoch === currentEpoch && lockPrice === null) {
    return <BettableRoundCard round={round} />
  }

  if (closePrice === null) {
    return <OpenRoundCard round={round} />
  }

  return <SoonRoundCard round={round} />
}

export default RoundCard
