import { useState } from 'react'
import { Progress } from '@pancakeswap/uikit'
import { differenceInSeconds } from 'date-fns'
import { Auction, AuctionStatus } from 'config/constants/types'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'

const AuctionProgress: React.FC<{ auction: Auction }> = ({ auction }) => {
  const [progress, setProgress] = useState<number>(0)

  // Note: opted to base it on date rather than block number to reduce the amount of calls and async handling
  useSlowRefreshEffect(() => {
    if (auction.status === AuctionStatus.ToBeAnnounced || auction.status === AuctionStatus.Pending) {
      setProgress(0)
    } else {
      const now = new Date()
      const auctionDuration = differenceInSeconds(auction.endDate, auction.startDate)
      const secondsPassed = differenceInSeconds(now, auction.startDate)
      const percentagePassed = (secondsPassed * 100) / auctionDuration
      setProgress(percentagePassed < 100 ? percentagePassed : 100)
    }
  }, [auction])

  return <Progress variant="flat" primaryStep={progress} />
}

export default AuctionProgress
