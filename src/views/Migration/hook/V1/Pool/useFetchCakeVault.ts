import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from 'utils/providers'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import { fetchPublicVaultData, fetchVaultFees } from 'state/pools/fetchVaultPublic'
import fetchVaultUser from 'state/pools/fetchVaultUser'
import { initialPoolVaultState } from 'state/pools/index'
import { CakeVault } from 'state/types'

const cakeVaultAddress = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC'

const getCakeVaultContract = (signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new Contract(cakeVaultAddress, cakeVaultAbi, signerOrProvider) as any
}

export const useFetchCakeVault = () => {
  const { account } = useWeb3React()
  const [cakeVault, setCakeVault] = useState<CakeVault>(initialPoolVaultState)

  useFastRefreshEffect(() => {
    fetchPublicVaultData(cakeVaultAddress).then((data) => {
      setCakeVault({ ...cakeVault, ...data })
    })
  }, [])

  useFastRefreshEffect(() => {
    fetchVaultUser(account, getCakeVaultContract()).then((data) => {
      const userData = data
      userData.isLoading = false
      setCakeVault({ ...cakeVault, userData })
    })
  }, [account])

  useEffect(() => {
    fetchVaultFees(cakeVaultAddress).then((data) => {
      const fees = data
      setCakeVault({ ...cakeVault, fees })
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
  } = cakeVault

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
