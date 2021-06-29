import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGetLotteriesGraphData, useGetUserLotteriesGraphData, useLottery } from 'state/hooks'
import fetchUnclaimedUserRewards from 'state/lottery/fetchUnclaimedUserRewards'

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
}

const useGetUnclaimedRewards = () => {
  const { account } = useWeb3React()
  const { currentLotteryId } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const lotteriesData = useGetLotteriesGraphData()
  const [unclaimedRewards, setUnclaimedRewards] = useState([])
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)

  useEffect(() => {
    // Reset on account change
    setFetchStatus(FetchStatus.NOT_FETCHED)
  }, [account])

  const fetchAllRewards = useCallback(async () => {
    setFetchStatus(FetchStatus.IN_PROGRESS)
    const unclaimedRewardsResponse = await fetchUnclaimedUserRewards(
      account,
      currentLotteryId,
      userLotteryData,
      lotteriesData,
    )
    setUnclaimedRewards(unclaimedRewardsResponse)
    setFetchStatus(FetchStatus.SUCCESS)
  }, [account, userLotteryData, currentLotteryId, lotteriesData])

  return { fetchAllRewards, unclaimedRewards, fetchStatus }
}

export default useGetUnclaimedRewards
