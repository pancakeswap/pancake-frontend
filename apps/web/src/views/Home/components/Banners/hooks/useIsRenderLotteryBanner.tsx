import useSWR from 'swr'
import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'
import { FetchStatus } from 'config/constants/types'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'

const useIsRenderLotteryBanner = () => {
  const { data: currentLotteryId, status: currentLotteryIdStatus } = useSWR(
    ['currentLotteryId'],
    fetchCurrentLotteryId,
    { refreshInterval: SLOW_INTERVAL },
  )

  const { status: currentLotteryStatus } = useSWR(
    currentLotteryId ? ['currentLottery'] : null,
    async () => fetchLottery(currentLotteryId.toString()),
    { refreshInterval: FAST_INTERVAL },
  )

  return currentLotteryIdStatus === FetchStatus.Fetched && currentLotteryStatus === FetchStatus.Fetched
}

export default useIsRenderLotteryBanner
