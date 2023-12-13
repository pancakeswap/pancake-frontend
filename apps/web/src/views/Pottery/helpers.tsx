import BigNumber from 'bignumber.js'
import { PotteryDepositStatus } from 'state/types'

interface CalculateCakeAmount {
  status: PotteryDepositStatus
  previewRedeem: string
  shares: string
  totalSupply: BigNumber
  totalLockCake: BigNumber
}

export const calculateCakeAmount = ({
  status,
  previewRedeem,
  shares,
  totalSupply,
  totalLockCake,
}: CalculateCakeAmount): BigNumber => {
  if (status === PotteryDepositStatus.LOCK) {
    return new BigNumber(shares).div(totalSupply).times(totalLockCake)
  }

  return new BigNumber(previewRedeem)
}
