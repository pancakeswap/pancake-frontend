import { useMemo } from 'react'
import type { Address } from 'viem'

import { POSITION_MANAGERS_WITH_SWELL_REWARD } from 'config/swell'

export function useHasSwellReward(id: Address) {
  return useMemo(() => POSITION_MANAGERS_WITH_SWELL_REWARD.some(({ identifier }) => identifier === id), [id])
}
