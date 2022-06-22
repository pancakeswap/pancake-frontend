import BigNumber from 'bignumber.js'
import multicallv2 from 'utils/multicall'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import { getPotteryVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { PotteryDepositStatus } from 'state/types'
import tokens from 'config/constants/tokens'
import { getPotteryDrawContract, getBep20Contract } from 'utils/contractHelpers'

const potteryVaultAddress = getPotteryVaultAddress()
const potteryDrawContract = getPotteryDrawContract()

export const fetchPublicPotteryValue = async () => {
  try {
    const calls = ['getStatus', 'totalLockCake', 'totalSupply', 'lockStartTime'].map((method) => ({
      address: potteryVaultAddress,
      name: method,
    }))

    const [getStatus, [totalLockCake], [totalSupply], [lockStartTime]] = await multicallv2(potteryVaultAbi, calls)
    const [lastDrawId, totalPrize] = await potteryDrawContract.getPot(potteryVaultAddress)

    return {
      lastDrawId: new BigNumber(lastDrawId.toString()).toJSON(),
      totalPrize: new BigNumber(totalPrize.toString()).toJSON(),
      getStatus: getStatus[0],
      totalLockCake: new BigNumber(totalLockCake.toString()).toJSON(),
      totalSupply: new BigNumber(totalSupply.toString()).toJSON(),
      lockStartTime: lockStartTime.toString(),
    }
  } catch {
    return {
      lastDrawId: BIG_ZERO.toJSON(),
      totalPrize: BIG_ZERO.toJSON(),
      getStatus: PotteryDepositStatus.BEFORE_LOCK,
      totalLockCake: BIG_ZERO.toJSON(),
      totalSupply: BIG_ZERO.toJSON(),
      lockStartTime: BIG_ZERO.toJSON(),
    }
  }
}

export const fetchTotalLockedValue = async () => {
  try {
    const contract = getBep20Contract(tokens.cake.address)
    const totalLocked = await contract.balanceOf(potteryVaultAddress)

    return {
      totalLockedValue: new BigNumber(totalLocked.toString()).toJSON(),
    }
  } catch {
    return {
      totalLockedValue: BIG_ZERO.toJSON(),
    }
  }
}
