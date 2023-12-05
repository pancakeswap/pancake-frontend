import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'

const useIsRenderLotteryBanner = () => {
  const { data: currentLotteryId, status: currentLotteryIdStatus } = useQuery(
    ['currentLotteryId'],
    fetchCurrentLotteryId,
    {
      refetchInterval: SLOW_INTERVAL,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )

  const { status: currentLotteryStatus } = useQuery(
    ['currentLottery'],
    async () => {
      if (!currentLotteryId) return undefined
      return fetchLottery(currentLotteryId.toString())
    },
    {
      enabled: Boolean(currentLotteryId),
      refetchInterval: FAST_INTERVAL,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )

  return currentLotteryIdStatus === 'success' && currentLotteryStatus === 'success'
}

export default useIsRenderLotteryBanner
