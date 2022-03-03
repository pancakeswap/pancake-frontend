import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import fetchIfoPoolUser from 'state/pools/fetchIfoPoolUser'
import { fetchPublicIfoPoolData, fetchIfoPoolFeesData } from 'state/pools/fetchIfoPoolPublic'
import { initialPoolVaultState } from 'state/pools/index'
import { IfoCakeVault } from 'state/types'

const ifoPoolV1Contract = '0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8'

export const useFetchIfoPool = () => {
  const { account } = useWeb3React()
  const [ifoData, setIfoData] = useState<IfoCakeVault>(initialPoolVaultState)

  useFastRefreshEffect(() => {
    fetchPublicIfoPoolData().then((data) => {
      setIfoData({ ...ifoData, ...data })
    })
  }, [])

  useFastRefreshEffect(() => {
    if (account) {
      fetchIfoPoolUser(account, ifoPoolV1Contract).then((data) => {
        const userData = data
        userData.isLoading = false
        setIfoData({ ...ifoData, userData })
      })
    }
  }, [account])

  useEffect(() => {
    fetchIfoPoolFeesData(ifoPoolV1Contract).then((data) => {
      const fees = data
      setIfoData({ ...ifoData, fees })
    })
  }, [])

  const {
    totalShares,
    pricePerFullShare,
    totalCakeInVault,
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: { isLoading, userShares, cakeAtLastUserAction, lastDepositedTime, lastUserActionTime },
  } = ifoData

  return {
    totalShares: new BigNumber(totalShares),
    pricePerFullShare: new BigNumber(pricePerFullShare),
    totalCakeInVault: new BigNumber(totalCakeInVault),
    estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward),
    totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest),
    fees: {
      performanceFeeAsDecimal: performanceFee && performanceFee / 100,
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares: new BigNumber(userShares),
      cakeAtLastUserAction: new BigNumber(cakeAtLastUserAction),
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}
