import { useMemo } from 'react'
import type { Address } from 'viem'
import { TaikoEthTooltips } from 'views/Farms/components/CustomTooltips/TaikoEthTooltips'

/**
 * List Farm LPs custom tooltips
 */
interface CustomTooltipsType {
  identifier: Address
  tooltips: JSX.Element
}

const CONTRACTS_LP_WITH_TOOLTIPS: CustomTooltipsType[] = [
  {
    // Taiko-ETH LP
    identifier: '0x05dF8F9fCFf0b6a6FDE7166706a52693906C9936',
    tooltips: <TaikoEthTooltips />,
  },
]

export function useHasCustomFarmLpTooltips(id?: Address) {
  return useMemo(() => CONTRACTS_LP_WITH_TOOLTIPS.find(({ identifier }) => identifier === id), [id])
}
