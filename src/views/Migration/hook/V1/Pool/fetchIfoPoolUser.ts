import BigNumber from 'bignumber.js'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import { multicallv2 } from 'utils/multicall'

const fetchIfoPoolUser = async (account: string, ifoPoolAddress: string) => {
  try {
    const calls = ['userInfo', 'getUserCredit'].map((method) => ({
      address: ifoPoolAddress,
      name: method,
      params: [account],
    }))
    const [userContractResponse, creditResponse] = await multicallv2(ifoPoolAbi, calls)

    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
      credit: new BigNumber(creditResponse.avgBalance.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
      credit: null,
    }
  }
}

export default fetchIfoPoolUser
