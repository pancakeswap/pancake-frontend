import { useMemo } from 'react'
import type { Address } from 'viem'

import { FARMS_WITH_SWELL_REWARD, POSITION_MANAGERS_WITH_SWELL_REWARD } from 'config/swell'

/**
 * Returns whether a farm or position manager has a swell reward.
 *
 * Default type is 'POSITION_MANAGER'
 */
export function useHasSwellReward(id: Address, type: 'POSITION_MANAGER' | 'FARM' = 'POSITION_MANAGER') {
  return useMemo(
    () =>
      type === 'FARM'
        ? FARMS_WITH_SWELL_REWARD.some(({ identifier }) => identifier === id)
        : POSITION_MANAGERS_WITH_SWELL_REWARD.some(({ identifier }) => identifier === id),
    [id, type],
  )
}
