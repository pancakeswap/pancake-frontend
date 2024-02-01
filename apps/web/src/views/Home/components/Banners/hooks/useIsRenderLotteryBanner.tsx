import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'

const useIsRenderLotteryBanner = () => {
  const { data: currentLotteryId, status: currentLotteryIdStatus } = useQuery({
    queryKey: ['currentLotteryId'],
    queryFn: fetchCurrentLotteryId,
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const { status: currentLotteryStatus } = useQuery({
    queryKey: ['currentLottery'],

    queryFn: async () => {
      if (!currentLotteryId) return undefined
      return fetchLottery(currentLotteryId.toString())
    },

    enabled: Boolean(currentLotteryId),
    refetchInterval: FAST_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return currentLotteryIdStatus === 'success' && currentLotteryStatus === 'success'
}

export default useIsRenderLotteryBanner
