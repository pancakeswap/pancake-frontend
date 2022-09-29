import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getNonBscVaultContract, getCrossFarmingSenderContract } from 'utils/contractHelpers'

export enum MessageTypes {
  Deposit = 0,
  Withdraw = 1,
  EmergencyWithdraw = 2,
  Claim = 3,
}

enum Chains {
  EVM = 0,
  BSC = 1,
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

const COMPENSATION_PRECISION = 1e5
const ORACLE_PRECISION = 1e18
const BNB_CHANGE = 5000000000000000

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
    const nonBscVaultContract = getNonBscVaultContract(null, chainId)
    const crossFarmingAddress = getCrossFarmingSenderContract(null, chainId)
    const exchangeRate = new BigNumber(oraclePrice)

    const getNonce = await crossFarmingAddress.nonces(userAddress, pid)
    const nonce = new BigNumber(getNonce.toString()).toJSON()
    const [encodeMessage, isFirstTime, estimateGaslimit] = await Promise.all([
      nonBscVaultContract.encodeMessage(userAddress, pid, amount, messageType, nonce),
      crossFarmingAddress.is1st(userAddress),
      crossFarmingAddress.estimateGaslimit(Chains.BSC, userAddress, messageType),
    ])
    const calcFee = await nonBscVaultContract.calcFee(encodeMessage)

    const fee1 = new BigNumber(calcFee.toString())
    const fee2 = new BigNumber(gasPrice)
      .times(estimateGaslimit.toString())
      .times(exchangeRate)
      .times(COMPENSATION_PRECISION)
    const totalFee = new BigNumber(fee1).plus(fee2).div(ORACLE_PRECISION * COMPENSATION_PRECISION)

    if (!isFirstTime) {
      const depositFee = new BigNumber(BNB_CHANGE).times(exchangeRate).div(ORACLE_PRECISION)
      return totalFee.plus(depositFee).toFixed(0)
    }

    if (messageType >= MessageTypes.Withdraw) {
      const estimateEvmGaslimit = await crossFarmingAddress.estimateGaslimit(Chains.EVM, userAddress, messageType)
      const fee = fee1.times(exchangeRate).div(ORACLE_PRECISION)
      const total = new BigNumber(gasPrice).times(estimateEvmGaslimit.toString()).plus(fee)
      return totalFee.plus(total).toFixed(0)
    }

    return totalFee.toFixed(0)
  } catch (error) {
    console.error('Failed to fetch non BscVault fee', error)
    return BIG_ZERO.toJSON()
  }
}
