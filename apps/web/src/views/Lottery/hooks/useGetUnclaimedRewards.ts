import { FetchStatus, LotteryTicketClaimData, TFetchStatus } from 'config/constants/types'
import { useEffect, useState } from 'react'
import fetchUnclaimedUserRewards from 'state/lottery/fetchUnclaimedUserRewards'
import { useGetLotteriesGraphData, useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { useAccount } from 'wagmi'

const useGetUnclaimedRewards = () => {
  const { address: account } = useAccount()
  const { isTransitioning, currentLotteryId } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const lotteriesData = useGetLotteriesGraphData()
  const [unclaimedRewards, setUnclaimedRewards] = useState<LotteryTicketClaimData[]>([])
  const [fetchStatus, setFetchStatus] = useState<TFetchStatus>(FetchStatus.Idle)

  useEffect(() => {
    // Reset on account change and round transition
    setFetchStatus(FetchStatus.Idle)
  }, [account, isTransitioning])

  const fetchAllRewards = async () => {
    if (!account) return
    setFetchStatus(FetchStatus.Fetching)
    const unclaimedRewardsResponse = await fetchUnclaimedUserRewards(
      account,
      userLotteryData,
      lotteriesData ?? [],
      currentLotteryId,
    )
    setUnclaimedRewards(unclaimedRewardsResponse)
    setFetchStatus(FetchStatus.Fetched)
  }

  return { fetchAllRewards, unclaimedRewards, fetchStatus }
}

export default useGetUnclaimedRewards
