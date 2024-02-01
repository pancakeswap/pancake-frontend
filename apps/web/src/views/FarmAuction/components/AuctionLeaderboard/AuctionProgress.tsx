import { Progress } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { Auction, AuctionStatus } from 'config/constants/types'
import { SLOW_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'

const AuctionProgress: React.FC<React.PropsWithChildren<{ auction: Auction }>> = ({ auction }) => {
  const { data: progress = 0 } = useQuery({
    queryKey: ['farmAuction', 'auctionProgress'],

    queryFn: async () => {
      if (auction.status === AuctionStatus.ToBeAnnounced || auction.status === AuctionStatus.Pending) {
        return 0
      }
      const auctionDuration = dayjs(auction.endDate).diff(dayjs(auction.startDate), 'seconds')
      const secondsPassed = dayjs().diff(dayjs(auction.startDate), 'seconds')
      const percentagePassed = (secondsPassed * 100) / auctionDuration
      return percentagePassed < 100 ? percentagePassed : 100
    },

    refetchInterval: SLOW_INTERVAL,
  })

  return <Progress variant="flat" primaryStep={progress} />
}

export default AuctionProgress
