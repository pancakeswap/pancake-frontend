import BigNumber from 'bignumber.js'
import { SerializedLockedVaultUser, SerializedVaultUser } from 'state/types'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import cakeVaultAbi from 'config/abi/cakeVaultV2.json'
import { multicallv2 } from 'utils/multicall'
import { getCakeFlexibleSideVaultV2Contract } from '../../utils/contractHelpers'

const cakeVaultAddress = getCakeVaultAddress()
const flexibleSideVaultContract = getCakeFlexibleSideVaultV2Contract()

export const fetchVaultUser = async (account: string): Promise<SerializedLockedVaultUser> => {
  try {
    const calls = ['userInfo', 'calculatePerformanceFee', 'calculateOverdueFee'].map((method) => ({
      address: cakeVaultAddress,
      name: method,
      params: [account],
    }))

    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee]] = await multicallv2({
      abi: cakeVaultAbi,
      calls,
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
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
      userBoostedShare: null,
      lockEndTime: null,
      lockStartTime: null,
      locked: null,
      lockedAmount: null,
      currentPerformanceFee: null,
      currentOverdueFee: null,
    }
  }
}

export const fetchFlexibleSideVaultUser = async (account: string): Promise<SerializedVaultUser> => {
  try {
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
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
    }
  }
}
