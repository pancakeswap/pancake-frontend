import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getNonBscVaultContract, getCrossFarmingContract } from 'utils/contractHelpers'

export enum MessageTypes {
  'Deposit' = 0,
  'Withdraw' = 1,
  'EmergencyWithdraw' = 2,
  'Claim' = 3,
}

interface CalculateTotalFeeProps {
  pid: number
  amount: string
  chainId: number
  userAddress: string
  messageType: MessageTypes
  gasPrice: number
  oraclePrice: string
}

const EXCHANGE_RATE_PRECISION = 1e5
const COMPENSATION_PRECISION = 1e5

export const getNonBscVaultContractFee = async ({
  pid,
  amount,
  chainId,
  userAddress,
  messageType,
  oraclePrice,
  gasPrice,
}: CalculateTotalFeeProps) => {
  try {
    const masterChefContract = getNonBscVaultContract(null, chainId)
    const crossFarmingAddress = getCrossFarmingContract(null, chainId)
    const exchangeRate = new BigNumber(oraclePrice).times(EXCHANGE_RATE_PRECISION).div(BIG_TEN.pow(18))

    const [encodeMessage, estimateDestGaslimit] = await Promise.all([
      masterChefContract.encodeMessage(userAddress, pid, amount, messageType),
      crossFarmingAddress.estimateDestGaslimit(userAddress, messageType),
    ])

    const fee1 = new BigNumber(encodeMessage)
    const fee2 = new BigNumber(gasPrice)
      .times(estimateDestGaslimit)
      .times(exchangeRate)
      .times(COMPENSATION_PRECISION)
      .div(EXCHANGE_RATE_PRECISION * COMPENSATION_PRECISION)

    const totalFee = new BigNumber(fee1).plus(fee2).toString()
    return totalFee
  } catch (error) {
    console.error('Failed to fetch non BscVault fee', error)
    return BIG_ZERO.toJSON()
  }
}
