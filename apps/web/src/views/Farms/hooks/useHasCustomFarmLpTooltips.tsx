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
    identifier: '0x6FD5029Ba47BA8dBee130DA71e2546b5c96b4B12',
    tooltips: <TaikoEthTooltips />,
  },
] as const

export function useHasCustomFarmLpTooltips(id?: Address) {
  return useMemo(() => CONTRACTS_LP_WITH_TOOLTIPS.find(({ identifier }) => identifier === id), [id])
}
