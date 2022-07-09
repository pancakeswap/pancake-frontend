import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { Ifo, PoolIds } from 'config/constants/types'
import { ifosConfig, FAST_INTERVAL } from 'config/constants'
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
        (ifo) =>
          ifo.userVestingData[PoolIds.poolUnlimited].vestingComputeReleasableAmount.gt(0) ||
          ifo.userVestingData[PoolIds.poolBasic].vestingComputeReleasableAmount.gt(0),
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
