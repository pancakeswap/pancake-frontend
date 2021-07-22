import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { differenceInSeconds } from 'date-fns'
import { Auction, AuctionStatus } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'

const ProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
`

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => `${progress}%`};
  height: 16px;
  background-color: ${({ theme }) => theme.colors.secondary};
`

const AuctionProgress: React.FC<{ auction: Auction }> = ({ auction }) => {
  const [progress, setProgress] = useState<number>(0)
  const { slowRefresh } = useRefresh()

  // Note: opted to base it on date rather than block number to reduce the amount of calls and async handling
  useEffect(() => {
    if (auction.status === AuctionStatus.ToBeAnnounced || auction.status === AuctionStatus.Pending) {
      setProgress(0)
    } else {
      const now = new Date()
      const auctionDuration = differenceInSeconds(auction.endDate, auction.startDate)
      const secondsPassed = differenceInSeconds(now, auction.startDate)
      const percentagePassed = (secondsPassed * 100) / auctionDuration
      setProgress(percentagePassed < 100 ? percentagePassed : 100)
    }
  }, [slowRefresh, auction])

  return (
    <ProgressContainer>
      <ProgressBar progress={progress} />
    </ProgressContainer>
  )
}

export default AuctionProgress
