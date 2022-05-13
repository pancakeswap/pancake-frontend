import BigNumber from 'bignumber.js'
import { getICakeddress } from 'utils/addressHelpers'
import iCakeAbi from 'config/abi/iCake.json'
import { multicallv2 } from 'utils/multicall'

const fetchIfoUserCredit = async (account: string) => {
  try {
    const calls = [
      {
        address: getICakeddress(),
        name: 'getUserCredit',
        params: [account],
      },
      {
        address: getICakeddress(),
        name: 'ceiling',
      },
    ]

    const [creditResponse, ceilingResponse] = await multicallv2(iCakeAbi, calls)
    return {
      credit: new BigNumber(creditResponse.toString()).toJSON(),
      ceiling: new BigNumber(ceilingResponse.toString()).toJSON(),
    }
  } catch (error) {
    return {
      credit: null,
      ceiling: null,
    }
  }
}

export default fetchIfoUserCredit
