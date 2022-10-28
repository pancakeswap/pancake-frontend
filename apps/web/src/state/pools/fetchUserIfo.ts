import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getIfoCreditAddressContract } from 'utils/contractHelpers'

export const fetchPublicIfoData = async () => {
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract()
    const ceiling = await ifoCreditAddressContract.ceiling()
    return {
      ceiling: new BigNumber(ceiling.toString()).toJSON(),
    }
  } catch (error) {
    return {
      ceiling: BIG_ZERO.toJSON(),
    }
  }
}

export const fetchUserIfoCredit = async (account: string) => {
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract()
    const credit = await ifoCreditAddressContract.getUserCredit(account)
    return new BigNumber(credit.toString()).toJSON()
  } catch (error) {
    return BIG_ZERO.toJSON()
  }
}
