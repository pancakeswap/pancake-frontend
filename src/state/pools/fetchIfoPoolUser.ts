import BigNumber from 'bignumber.js'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import { getIfoPoolAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'

const fetchIfoPoolUser = async (account: string) => {
  try {
    const calls = ['userInfo', 'userIFOInfo'].map((method) => ({
      address: getIfoPoolAddress(),
      name: method,
      params: [account],
    }))
    const [userContractResponse, userIFOInfo] = await multicallv2(ifoPoolAbi, calls)
    return {
      userData: {
        isLoading: false,
        userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
        lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
        lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
        cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
      },
      ifoInfo: {
        lastActionBalance: new BigNumber(userIFOInfo.lastActionBalance.toString()).toJSON(),
        lastValidActionBalance: new BigNumber(userIFOInfo.lastValidActionBalance.toString()).toJSON(),
        lastActionBlock: userIFOInfo.lastActionBlock.toString(),
        lastValidActionBlock: userIFOInfo.lastValidActionBlock.toString(),
        lastAvgBalance: new BigNumber(userIFOInfo.lastAvgBalance.toString()).toJSON(),
      },
    }
  } catch (error) {
    return {
      userData: {
        isLoading: true,
        userShares: null,
        lastDepositedTime: null,
        lastUserActionTime: null,
        cakeAtLastUserAction: null,
      },
      ifoInfo: {
        lastActionBalance: null,
        lastValidActionBalance: null,
        lastActionBlock: null,
        lastValidActionBlock: null,
        lastAvgBalance: null,
      },
    }
  }
}

export default fetchIfoPoolUser
