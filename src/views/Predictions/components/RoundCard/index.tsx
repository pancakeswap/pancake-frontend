import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGetBetByEpoch, useGetCurrentEpoch } from 'state/hooks'
import { BetPosition, NodeRound } from 'state/types'
import { getMultiplierv2 } from '../../helpers'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: NodeRound
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const { epoch, lockPrice, closePrice, totalAmount, bullAmount, bearAmount } = round
  const currentEpoch = useGetCurrentEpoch()
  const { account } = useWeb3React()
  const ledger = useGetBetByEpoch(account, epoch)
  const hasEntered = ledger ? ledger.amount.gt(0) : false
  const hasEnteredUp = hasEntered && ledger.position === BetPosition.BULL
  const hasEnteredDown = hasEntered && ledger.position === BetPosition.BEAR
  const bullMultiplier = getMultiplierv2(totalAmount, bullAmount)
  const bearMultiplier = getMultiplierv2(totalAmount, bearAmount)

  const formattedBullMultiplier = bullMultiplier.toUnsafeFloat().toFixed(bullMultiplier.isZero() ? 0 : 2)
  const formattedbearMultiplier = bearMultiplier.toUnsafeFloat().toFixed(bearMultiplier.isZero() ? 0 : 2)

  // Next (open) round
  if (epoch === currentEpoch && lockPrice === null) {
    return (
      <OpenRoundCard
        round={round}
        hasEnteredDown={hasEnteredDown}
        hasEnteredUp={hasEnteredUp}
        betAmount={ledger?.amount}
        bullMultiplier={formattedBullMultiplier}
        bearMultiplier={formattedbearMultiplier}
      />
    )
  }

  // Live round
  if (closePrice === null && epoch === currentEpoch - 1) {
    return (
      <LiveRoundCard
        betAmount={ledger?.amount}
        hasEnteredDown={hasEnteredDown}
        hasEnteredUp={hasEnteredUp}
        round={round}
        bullMultiplier={formattedBullMultiplier}
        bearMultiplier={formattedbearMultiplier}
      />
    )
  }

  // Fake future rounds
  if (epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  // Past rounds
  return (
    <ExpiredRoundCard
      round={round}
      hasEnteredDown={hasEnteredDown}
      hasEnteredUp={hasEnteredUp}
      betAmount={ledger?.amount}
      bullMultiplier={formattedBullMultiplier}
      bearMultiplier={formattedbearMultiplier}
    />
  )
}

export default RoundCard
