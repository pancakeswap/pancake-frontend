import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Ifo, PoolIds } from '@pancakeswap/ifos'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'

import { useIfoConfigsAcrossChains } from 'hooks/useIfoConfig'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { fetchUserWalletIfoData } from './fetchUserWalletIfoData'

const useFetchVestingData = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const configs = useIfoConfigsAcrossChains()
  const allVestingIfo = useMemo<Ifo[]>(
    () => configs?.filter((ifo) => ifo.version >= 3.2 && ifo.vestingTitle) || [],
    [configs],
  )

  const { data: vestingData, refetch } = useQuery({
    queryKey: ['vestingData', account],

    queryFn: async () => {
      const allData = await Promise.all(
        allVestingIfo.map(async (ifo) => {
          const response = await fetchUserWalletIfoData(ifo, account)
          return response
        }),
      )

      const currentTimeStamp = Date.now()

      return allData.filter(
        // eslint-disable-next-line array-callback-return, consistent-return
        (ifo) => {
          const { userVestingData } = ifo
          if (
            userVestingData[PoolIds.poolBasic].offeringAmountInToken.gt(0) ||
            userVestingData[PoolIds.poolUnlimited].offeringAmountInToken.gt(0)
          ) {
            if (
              userVestingData[PoolIds.poolBasic].vestingComputeReleasableAmount.gt(0) ||
              userVestingData[PoolIds.poolUnlimited].vestingComputeReleasableAmount.gt(0)
            ) {
              return ifo
            }
            const vestingStartTime = new BigNumber(userVestingData.vestingStartTime)
            const isPoolUnlimitedLive = vestingStartTime
              .plus(userVestingData[PoolIds.poolUnlimited].vestingInformationDuration)
              .times(1000)
              .gte(currentTimeStamp)
            if (isPoolUnlimitedLive) return ifo
            const isPoolBasicLive = vestingStartTime
              .plus(userVestingData[PoolIds.poolBasic].vestingInformationDuration)
              .times(1000)
              .gte(currentTimeStamp)
            if (isPoolBasicLive) return ifo
            return false
          }
          return false
        },
      )
    },

    enabled: Boolean(account),
    refetchOnWindowFocus: false,
    refetchInterval: FAST_INTERVAL,
    staleTime: FAST_INTERVAL,
  })

  // Sort by active chain
  const data = useMemo(
    () =>
      vestingData &&
      vestingData.toSorted((a, b) => {
        if (a.ifo.chainId === chainId && b.ifo.chainId !== chainId) {
          return -1
        }
        if (a.ifo.chainId !== chainId && b.ifo.chainId === chainId) {
          return 1
        }
        return 0
      }),
    [chainId, vestingData],
  )

  return {
    data: data || [],
    fetchUserVestingData: refetch,
  }
}

export default useFetchVestingData
