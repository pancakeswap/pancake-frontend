import { useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'

const useIsRenderLotteryBanner = () => {
  const {
    currentRound: { status },
  } = useLottery()
  return status === LotteryStatus.OPEN
}

export default useIsRenderLotteryBanner
