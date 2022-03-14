import { useFetchLottery, useLottery } from 'state/lottery/hooks'

const useIsRenderLotteryBanner = () => {
  useFetchLottery()
  const {
    currentRound: { isLoading },
  } = useLottery()
  return !isLoading
}

export default useIsRenderLotteryBanner
