import { useFetchLottery, useLottery } from 'state/lottery/hooks'

const useIsLotteryRender = () => {
  useFetchLottery()
  const {
    currentRound: { isLoading },
  } = useLottery()
  return !isLoading
}

export default useIsLotteryRender
