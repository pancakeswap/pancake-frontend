import { useFetchLottery, useLottery } from 'state/lottery/hooks'

const useIsLotteryLoading = () => {
  useFetchLottery()
  const {
    currentRound: { isLoading },
  } = useLottery()
  return isLoading
}

export default useIsLotteryLoading
