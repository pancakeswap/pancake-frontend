import BigNumber from 'bignumber.js'
import { getICakeAddress } from 'utils/addressHelpers'
import iCakeAbi from 'config/abi/iCake.json'
import { multicallv2 } from 'utils/multicall'

export const fetchPublicIfoData = async () => {
  try {
    const calls = [
      {
        address: getICakeAddress(),
        name: 'ceiling',
      },
    ]

    const [ceilingResponse] = await multicallv2(iCakeAbi, calls)
    return new BigNumber(ceilingResponse.toString()).toJSON()
  } catch (error) {
    return null
  }
}

export const fetchUserIfoCredit = async (account: string) => {
  try {
    const calls = [
      {
        address: getICakeAddress(),
        name: 'getUserCredit',
        params: [account],
      },
    ]

    const [creditResponse] = await multicallv2(iCakeAbi, calls)
    return new BigNumber(creditResponse.toString()).toJSON()
  } catch (error) {
    return null
  }
}
