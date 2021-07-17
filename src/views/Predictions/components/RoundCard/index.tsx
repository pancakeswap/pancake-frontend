import React, { useEffect } from 'react'
import OutbidRoundCard from './OutbidRoundCard'
import LeaderRoundCard from './LeaederRoundCard'
import IncreaseBidCard from './IncreaseBidCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  bid: any,
  lastBidId: number,
  userInfo: any,
  aid: number
}

const RoundCard: React.FC<RoundCardProps> = ({ bid, lastBidId, userInfo, aid }) => {

  // Live round
  if (bid.id === lastBidId - 1) {
    return (
      <LeaderRoundCard
        bid={bid}
      />
    )
  }

  // Past rounds
  return (
    <OutbidRoundCard
      bid={bid}
    />
  )
}

export default RoundCard
