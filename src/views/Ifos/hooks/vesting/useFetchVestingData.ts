import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { Ifo, PoolIds } from 'config/constants/types'
import { ifosConfig, FAST_INTERVAL } from 'config/constants'
import BigNumber from 'bignumber.js'
import { fetchUserWalletIfoData } from './fetchUserWalletIfoData'

// Filter Ifo when isActive = true
const allVestingIfo: Ifo[] = ifosConfig.filter((ifo) => ifo.version >= 3.2 && ifo.vestingTitle && !ifo.isActive)

const useFetchVestingData = () => {
  const { account } = useWeb3React()

  const { data, mutate } = useSWR(
    account ? ['vestingData'] : null,
    async () => {
      const allData = await Promise.all(
        allVestingIfo.map(async (ifo) => {
          const response = await fetchUserWalletIfoData(ifo, account)
          return response
        }),
      )

      return allData.filter(
        // eslint-disable-next-line array-callback-return, consistent-return
        (ifo) => {
          const { userVestingData } = ifo
          const currentTimeStamp = new Date().getTime()
          const vestingStartTime = new BigNumber(userVestingData.vestingStartTime)
          if (
            userVestingData[PoolIds.poolUnlimited].vestingComputeReleasableAmount.gt(0) ||
            userVestingData[PoolIds.poolBasic].vestingComputeReleasableAmount.gt(0) ||
            vestingStartTime
              .plus(userVestingData[PoolIds.poolUnlimited].vestingInformationDuration)
              .times(1000)
              .gte(currentTimeStamp) ||
            vestingStartTime
              .plus(userVestingData[PoolIds.poolBasic].vestingInformationDuration)
              .times(1000)
              .gte(currentTimeStamp)
          ) {
            return ifo
          }
        },
      )
    },
    {
      revalidateOnFocus: false,
      refreshInterval: FAST_INTERVAL,
      dedupingInterval: FAST_INTERVAL,
    },
  )

  return {
    data: data || [],
    fetchUserVestingData: mutate,
  }
}

export default useFetchVestingData
