import BigNumber from 'bignumber.js'
import { getIfoPoolContract } from 'utils/contractHelpers'

const ifoPoolContract = getIfoPoolContract()

const fetchIfoPoolUser = async (account: string) => {
  try {
    const userContractResponse = await ifoPoolContract.userInfo(account)
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

export default fetchIfoPoolUser
