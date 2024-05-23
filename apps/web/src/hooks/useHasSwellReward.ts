import { useMemo } from 'react'
import type { Address } from 'viem'

import { CONTRACTS_WITH_SWELL_REWARD } from 'config/swell'

/**
 * Returns whether a farm or position manager has a swell reward.
 */
export function useHasSwellReward(id?: Address) {
  return useMemo(() => CONTRACTS_WITH_SWELL_REWARD.some(({ identifier }) => identifier === id), [id])
}
