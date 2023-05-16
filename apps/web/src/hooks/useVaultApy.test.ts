import { renderHook } from '@testing-library/react-hooks'
import BigNumber from 'bignumber.js'
import { createSWRWrapper } from 'testUtils'
import { vi } from 'vitest'
import * as PoolHooks from '../state/pools/hooks'
import { useVaultApy } from './useVaultApy'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

vi.mock('../state/pools/hooks', () => ({
  // @ts-ignore
  ...vi.importActual('state/pools/hooks'),
  useCakeVault: vi.fn(),
}))

describe('useVaultApy', () => {
  it.each([
    [
      {
        totalShares: new BigNumber('125327628384770000000000000'),
        pricePerFullShare: new BigNumber('1736860000000000000'),
        emission: new BigNumber('105000000000000000000000000'),
      },
      {
        flexibleApy: '47.27197419083177422912342574911778768415518041557562859141344639548082923631460208',
        lockedApy: '1012.970875517823733481216266052524021803325294619477755530288137046017769349598616',
      },
    ],
  ])('should get correct vault apy', (cases, want) => {
    // @ts-ignore
    PoolHooks.useCakeVault.mockReturnValue({
      totalShares: cases.totalShares,
      pricePerFullShare: cases.pricePerFullShare,
    })
    const { result } = renderHook(
      () => {
        const { flexibleApy, getLockedApy, lockedApy } = useVaultApy()
        return {
          flexibleApy,
          getLockedApy,
          lockedApy,
        }
      },
      {
        wrapper: createSWRWrapper({
          'masterChef-total-cake-pool-emission': cases.emission,
        }),
      },
    )

    expect(result.current.flexibleApy).toEqual(want.flexibleApy)
    expect(result.current.lockedApy).toEqual(want.lockedApy)
  })
})
