import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { createMulticall } from '@pancakeswap/multicall'

import { OnChainProvider, SerializedLockedVaultUser, SerializedVaultUser } from '../types'
import cakeVaultAbi from '../abis/ICakeVaultV2.json'
import { getCakeVaultAddress } from './getAddresses'
import { getCakeFlexibleSideVaultV2Contract } from './getContracts'

interface Params {
  account: string
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchVaultUser = async ({ account, chainId, provider }: Params): Promise<SerializedLockedVaultUser> => {
  try {
    const cakeVaultAddress = getCakeVaultAddress(chainId)
    const calls = ['userInfo', 'calculatePerformanceFee', 'calculateOverdueFee'].map((method) => ({
      address: cakeVaultAddress,
      name: method,
      params: [account],
    }))

    const { multicallv2 } = createMulticall(provider)
    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee]] = await multicallv2({
      abi: cakeVaultAbi,
      calls,
      chainId,
    })
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
      userBoostedShare: new BigNumber(userContractResponse.userBoostedShare.toString()).toJSON(),
      locked: userContractResponse.locked,
      lockEndTime: userContractResponse.lockEndTime.toString(),
      lockStartTime: userContractResponse.lockStartTime.toString(),
      lockedAmount: new BigNumber(userContractResponse.lockedAmount.toString()).toJSON(),
      currentPerformanceFee: new BigNumber(currentPerformanceFee.toString()).toJSON(),
      currentOverdueFee: new BigNumber(currentOverdueFee.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: '',
      lastDepositedTime: '',
      lastUserActionTime: '',
      cakeAtLastUserAction: '',
      userBoostedShare: '',
      lockEndTime: '',
      lockStartTime: '',
      locked: false,
      lockedAmount: '',
      currentPerformanceFee: '',
      currentOverdueFee: '',
    }
  }
}

export const fetchFlexibleSideVaultUser = async ({
  account,
  chainId,
  provider,
}: Params): Promise<SerializedVaultUser> => {
  try {
    const flexibleSideVaultContract = getCakeFlexibleSideVaultV2Contract(chainId, provider)
    const userContractResponse = await flexibleSideVaultContract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: '',
      lastDepositedTime: '',
      lastUserActionTime: '',
      cakeAtLastUserAction: '',
    }
  }
}
