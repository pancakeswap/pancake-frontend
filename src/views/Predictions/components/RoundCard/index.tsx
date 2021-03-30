import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { useGetCurrentEpoch, useGetUserBetByRound } from 'state/hooks'
import { BetPosition, Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const { epoch, lockPrice, closePrice } = round
  const currentEpoch = useGetCurrentEpoch()
  const { account } = useWeb3React()
  const bet = useGetUserBetByRound(round.id, account)
  const hasEnteredUp = bet && bet.position === BetPosition.BULL
  const hasEnteredDown = bet && bet.position === BetPosition.BEAR

  if (epoch === currentEpoch && lockPrice === null) {
    return <OpenRoundCard round={round} hasEnteredUp={hasEnteredUp} hasEnteredDown={hasEnteredDown} />
  }

  if (closePrice === null && epoch === currentEpoch - 1) {
    return <LiveRoundCard round={round} hasEnteredUp={hasEnteredUp} hasEnteredDown={hasEnteredDown} />
  }

  if (epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  return <ExpiredRoundCard round={round} hasEnteredUp={hasEnteredUp} hasEnteredDown={hasEnteredDown} />
}

export default RoundCard
