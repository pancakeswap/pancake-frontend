/* eslint-disable camelcase */
import { keccak256 } from '@ethersproject/keccak256'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'

/**
 * calculate_tax_overflow
 */
export const calculateTaxOverflow = (total_amount: BigNumber, raising_amount: BigNumber): BigNumber => {
  // No tax if raising amount is not overflowed
  if (raising_amount.isGreaterThanOrEqualTo(total_amount)) {
    return BIG_ZERO
  }

  const ratio_overflow = total_amount.div(raising_amount)

  if (ratio_overflow.gte(1500)) {
    return new BigNumber('250000000') // 0.025%
  }
  if (ratio_overflow.gte(1000)) {
    return new BigNumber('500000000') // 0.05%
  }
  if (ratio_overflow.gte(500)) {
    return new BigNumber('1000000000') // 0.1%
  }
  if (ratio_overflow.gte(250)) {
    return new BigNumber('1250000000') // 0.125%
  }
  if (ratio_overflow.gte(100)) {
    return new BigNumber('1500000000') // 0.15%
  }
  if (ratio_overflow.gte(50)) {
    return new BigNumber('2500000000') // 0.25%
  }
  return new BigNumber('5000000000') // 0.5%
}

/**
 * get_user_allocation
 */
export const getUserAllocation = (pool_total_amount: BigNumber, user_amount: BigNumber): BigNumber => {
  if (pool_total_amount.gt(BIG_ZERO)) {
    // 100,000,000,000 means 0.1 (10%) / 1 means 0.0000000000001 (0.0000001%) / 1,000,000,000,000 means 1 (100%)
    return user_amount.times(new BigNumber('1000000000000000000')).div(pool_total_amount.times('1000000'))
  }
  return BIG_ZERO
}

const stripHexPrefix = (address: string) => {
  if (address.startsWith('0x')) {
    return address.slice(2)
  }
  return address
}

/**
 * compute_vesting_schedule_id
 *
 * e.g.
 * Input:
 * compute_vesting_schedule_id(d3eec05e74ab99a4529bc0930056f2adeecbdef195b61b05248008a8c5762984, 0)
 *
 * Output:
 * beneficiary: [211, 238, 192, 94, 116, 171, 153, 164, 82, 155, 192, 147, 0, 86, 242, 173, 238, 203, 222, 241, 149, 182, 27, 5, 36, 128, 8, 168, 197, 118, 41, 132]
 * index: [0, 0, 0, 0, 0, 0, 0, 0]
 * [201, 197, 203, 75, 102, 5, 237, 179, 218, 85, 130, 68, 79, 220, 66, 181, 56, 195, 44, 124, 177, 4, 92, 139, 98, 171, 89, 138, 127, 123, 93, 94]
 *
 * TODO: Add test.
 */
export const computeVestingScheduleId = (beneficiary: string, index: number): string => {
  // The Move function expects no hex prefix.
  const bytesA = Buffer.from(stripHexPrefix(beneficiary), 'hex')

  const bytesB = Buffer.alloc(8)
  bytesB.writeBigInt64LE(BigInt(index))

  const bytes = Buffer.concat([bytesA, bytesB])

  return stripHexPrefix(keccak256(bytes))
}
