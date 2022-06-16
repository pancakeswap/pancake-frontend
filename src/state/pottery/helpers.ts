import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { SerializedPotteryUserData, DeserializedPotteryUserData } from 'state/types'

export const transformPotteryUserData = (userData: SerializedPotteryUserData): DeserializedPotteryUserData => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
  }
}
