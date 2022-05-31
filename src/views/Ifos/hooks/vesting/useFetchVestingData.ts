import { useCallback, useState } from 'react'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { Ifo, PoolIds } from 'config/constants/types'
import { ifosConfig } from 'config/constants'
import { fetchUserWalletIfoData, VestingData } from './fetchUserWalletIfoData'

// Filter Ifo when isActive = true
const allVestingIfo: Ifo[] = ifosConfig.filter((ifo) => ifo.version >= 3.2 && ifo.vestingTitle && !ifo.isActive)

export interface VestingDataState {
  data: VestingData[]
  userDataLoaded: boolean
}

const initialData: VestingDataState = {
  data: [],
  userDataLoaded: false,
}

const useFetchVestingData = (account: string) => {
  const [userVestingData, setUserVestingData] = useState<VestingDataState>(initialData)

  const fetchUserVestingData = useCallback(async () => {
    if (account) {
      const data = await Promise.all(
        await allVestingIfo.map(async (ifo) => {
          const response = await fetchUserWalletIfoData(ifo, account)
          return response
        }),
      )
      const vestingIfoData = data.filter((ifo) =>
        ifo.userVestingData[PoolIds.poolUnlimited].vestingcomputeReleasableAmount.gt(0),
      )

      setUserVestingData({
        data: vestingIfoData,
        userDataLoaded: true,
      })
    }
  }, [account])

  useFastRefreshEffect(() => {
    fetchUserVestingData()
  }, [fetchUserVestingData])

  return {
    data: userVestingData.data,
    userDataLoaded: userVestingData.userDataLoaded,
    fetchUserVestingData,
  }
}

export default useFetchVestingData
