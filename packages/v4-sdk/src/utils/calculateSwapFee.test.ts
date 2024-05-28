import { describe, expect, it } from 'vitest'
import { calculateSwapFee } from './calculateSwapFee'

describe('calculateSwapFee', () => {
  const protocolFee = 1000n // 0.1%
  const lpFee = 3000n // 0.3%

  it('0.1% protocol fee + 0.3% lp fee => 0.3997% swapFee', () => {
    expect(calculateSwapFee(protocolFee, lpFee)).toBe(3997n)
  })
})
