import BigNumber from 'bignumber.js'
import multicallv2 from 'utils/multicall'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import { getPotteryVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { PotteryDepositStatus } from 'state/types'

const potteryContract = getPotteryVaultAddress()

export const fetchPublicPotteryValue = async () => {
  try {
    const calls = ['getStatus', 'totalLockCake', 'totalSupply', 'lockStartTime'].map((method) => ({
      address: potteryContract,
      name: method,
    }))

    const [getStatus, [totalLockCake], [totalSupply], [lockStartTime]] = await multicallv2(potteryVaultAbi, calls)

    return {
      getStatus: getStatus[0],
      totalLockCake: new BigNumber(totalLockCake.toString()).toJSON(),
      totalSupply: new BigNumber(totalSupply.toString()).toJSON(),
      lockStartTime: lockStartTime.toString(),
    }
  } catch {
    return {
      getStatus: PotteryDepositStatus.BEFORE_LOCK,
      totalLockCake: BIG_ZERO.toJSON(),
      totalSupply: BIG_ZERO.toJSON(),
      lockStartTime: 0,
    }
  }
}
