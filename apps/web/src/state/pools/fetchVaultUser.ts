import BigNumber from 'bignumber.js'
import { SerializedLockedVaultUser } from 'state/types'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import cakeVaultAbi from 'config/abi/cakeVaultV2.json'
import { multicallv2 } from 'utils/multicall'

const cakeVaultAddress = getCakeVaultAddress()

const fetchVaultUser = async (account: string): Promise<SerializedLockedVaultUser> => {
  try {
    const calls = ['userInfo', 'calculatePerformanceFee', 'calculateOverdueFee'].map((method) => ({
      address: cakeVaultAddress,
      name: method,
      params: [account],
    }))

    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee]] = await multicallv2(cakeVaultAbi, calls)
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

export default fetchVaultUser
