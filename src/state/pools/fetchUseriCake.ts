import BigNumber from 'bignumber.js'
import { getICakeddress } from 'utils/addressHelpers'
import iCakeAbi from 'config/abi/iCake.json'
import { multicallv2 } from 'utils/multicall'

const fetchIfoUserCredit = async (account: string): Promise<string> => {
  try {
    const calls = [
      {
        address: getICakeddress(),
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

export default fetchIfoUserCredit
