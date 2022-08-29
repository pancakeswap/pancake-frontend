import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
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
const ORACLE_PRECISION = 1e18
const BNB_CHANGE = 0.005

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
    const exchangeRate = new BigNumber(oraclePrice)

    const [encodeMessage, nonces, estimateDestGaslimit] = await Promise.all([
      masterChefContract.encodeMessage(userAddress, pid, amount, messageType),
      crossFarmingAddress.nonces(userAddress),
      crossFarmingAddress.estimateDestGaslimit(userAddress, messageType),
    ])
    const calcFee = await masterChefContract.calcFee(encodeMessage)

    const fee1 = new BigNumber(calcFee.toString())
    const fee2 = new BigNumber(gasPrice)
      .times(estimateDestGaslimit.toString())
      .times(exchangeRate)
      .times(COMPENSATION_PRECISION)
      .div(EXCHANGE_RATE_PRECISION * COMPENSATION_PRECISION)
    const fee3 = new BigNumber(BNB_CHANGE).times(exchangeRate).div(ORACLE_PRECISION)

    const totalFee = new BigNumber(fee1).plus(fee2)
    if (nonces.eq(0) && messageType === MessageTypes.Deposit) {
      return totalFee.plus(fee3).toString()
    }
    return totalFee.toString()
  } catch (error) {
    console.error('Failed to fetch non BscVault fee', error)
    return BIG_ZERO.toJSON()
  }
}
