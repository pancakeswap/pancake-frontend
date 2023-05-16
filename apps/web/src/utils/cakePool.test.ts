import BigNumber from 'bignumber.js'
import { UNLOCK_FREE_DURATION, BOOST_WEIGHT, DURATION_FACTOR, MAX_LOCK_DURATION } from '@pancakeswap/pools'
import { addWeeks, addDays } from 'date-fns'
import { vi, describe, it } from 'vitest'
import { VaultPosition, getVaultPosition } from './cakePool'
import { getCakeVaultV2Contract } from './contractHelpers'

describe.concurrent('cakePool', () => {
  it.each([
    ['BOOST_WEIGHT', BOOST_WEIGHT],
    ['UNLOCK_FREE_DURATION', BigInt(UNLOCK_FREE_DURATION)],
    ['DURATION_FACTOR', DURATION_FACTOR],
    ['MAX_LOCK_DURATION', BigInt(MAX_LOCK_DURATION)],
  ])('%s should be equal to SC: %s', async (method, result) => {
    const cakeVault = getCakeVaultV2Contract()
    const got = await cakeVault.read[method]()
    expect(got).toBe(result)
  })
  const NOW = new Date('2022-01-01').getTime()

  it.each([
    // None
    [{}, VaultPosition.None],
    [{ userShares: null }, VaultPosition.None],
    [{ userShares: undefined, lockEndTime: '0', locked: true }, VaultPosition.None],
    [{ userShares: new BigNumber('0') }, VaultPosition.None],
    // Flexible
    [{ userShares: new BigNumber('1') }, VaultPosition.Flexible],
    [{ userShares: new BigNumber('1'), locked: false }, VaultPosition.Flexible],
    [{ userShares: new BigNumber('1'), locked: false, lockEndTime: `${NOW - 1000}` }, VaultPosition.Flexible],
    // Locked
    [{ userShares: new BigNumber('1'), locked: true }, VaultPosition.Locked],
    [
      {
        userShares: new BigNumber('1'),
        locked: true,
        lockEndTime: (addDays(new Date(NOW), 1).getTime() / 1000).toString(),
      },
      VaultPosition.Locked,
    ],
    // LockedEnd
    [
      {
        userShares: new BigNumber('1'),
        locked: true,
        lockEndTime: (addDays(new Date(NOW), -1).getTime() / 1000).toString(),
      },
      VaultPosition.LockedEnd,
    ],
    // after burning
    [
      {
        userShares: new BigNumber('1'),
        locked: true,
        lockEndTime: (addDays(new Date(NOW), -8).getTime() / 1000).toString(),
      },
      VaultPosition.AfterBurning,
    ],
  ])(`%s should be %s`, (params, result) => {
    vi.useFakeTimers().setSystemTime(NOW)
    expect(getVaultPosition(params)).toBe(result)
  })

  it('should be not be Locked if lockEndTime after now ', () => {
    vi.useFakeTimers().setSystemTime(NOW)
    expect(
      getVaultPosition({
        userShares: new BigNumber('1'),
        locked: true,
        lockEndTime: (addWeeks(new Date(NOW), -1).getTime() / 1000).toString(),
      }),
    ).not.toBe(VaultPosition.Locked)
  })
})
