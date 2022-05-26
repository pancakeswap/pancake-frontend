import { useCallback, useState } from 'react'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { Ifo, PoolIds } from 'config/constants/types'
import { ifosConfig } from 'config/constants'
import { fetchUserWalletIfoData, VestingData } from './fetchUserWalletIfoData'

// Todo: Revert this
// const allVestingIfo: Ifo[] = ifosConfig.filter((ifo) => ifo.version >= 3.2 && ifo.vestingTitle && !ifo.isActive)
const allVestingIfo: Ifo[] = ifosConfig.filter((ifo) => ifo.version >= 3.2 && ifo.vestingTitle)

interface VestingDataState {
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
    const vestingIfo: VestingData[] = []
    if (account) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const ifo of allVestingIfo) {
        const data = await fetchUserWalletIfoData(ifo, account)
        if (data.userVestingData[PoolIds.poolUnlimited].vestingcomputeReleasableAmount.gt(0)) {
          vestingIfo.push(data)
        }
      }

      setUserVestingData({
        data: vestingIfo,
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
