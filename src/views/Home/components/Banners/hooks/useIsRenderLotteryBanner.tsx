import useSWR from 'swr'
import { fetchCurrentLotteryId, fetchLottery } from 'state/lottery/helpers'
import { FetchStatus } from 'config/constants/types'
import { FAST_INTERVAL } from 'config/constants'

const useIsRenderLotteryBanner = () => {
  const { status } = useSWR(
    ['currentLottery'],
    async () => {
      const currentLotteryId = await fetchCurrentLotteryId()
      return fetchLottery(currentLotteryId?.toString())
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return status === FetchStatus.Fetched
}

export default useIsRenderLotteryBanner
