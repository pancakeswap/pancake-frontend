import { usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from './useTickets'

const useLotteryTotalPrizesUsd = () => {
  const totalRewards = useTotalRewards()
  const totalCake = getBalanceNumber(totalRewards)
  const cakePriceBusd = usePriceCakeBusd()

  return totalCake * cakePriceBusd.toNumber()
}

export default useLotteryTotalPrizesUsd
