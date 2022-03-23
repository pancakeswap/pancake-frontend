import { useFetchLottery, useLottery } from 'state/lottery/hooks'

const useIsRenderLotteryBanner = () => {
  useFetchLottery(true)
  const {
    currentRound: { isLoading },
  } = useLottery()
  return !isLoading
}

export default useIsRenderLotteryBanner
