import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGetBetByRoundId, useGetCurrentEpoch } from 'state/hooks'
import { BetPosition, Round } from 'state/types'
import { fetchRoundBet } from 'state/predictions'
import { useAppDispatch } from 'state'
import { getMultiplier } from '../../helpers'
import OutbidRoundCard from './OutbidRoundCard'
import LeaederRoundCard from './LeaederRoundCard'
import IncreaseBidCard from './IncreaseBidCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  bid: any,
  lastBidId: number
}

const RoundCard: React.FC<RoundCardProps> = ({ bid, lastBidId }) => {
  // Next (open) round
  if (bid.id === lastBidId) {
    return (
      <IncreaseBidCard
        bid={bid}
      />
    )
  }

  // Live round
  if (bid.id === lastBidId - 1) {
    return (
      <LeaederRoundCard

        bid={bid}
      />
    )
  }

  // Fake future rounds

  if (bid.id === lastBidId + 1) {
    return <SoonRoundCard bid={bid} />
  }

  // Past rounds
  return (
    <OutbidRoundCard
      bid={bid}
    />
  )
}

export default RoundCard
