import { useMemo } from 'react'
import { Address, encodePacked } from 'viem'

const DEFAULT_SLIPPAGE = 5n // 0.5%
const BIPS_PRECISION = 100n
const SLIPPAGE_PRECISION = 1000000000000000000n

const SLIPPAGE_MAP = {
  '0x416dC8c34d1A4812dAc2F58fF1f428ccf5Ae8b20': 20n,
}

export function usePMSlippage(address?: Address) {
  return useMemo(() => {
    const defaultSlippage = SLIPPAGE_MAP?.[address ?? ''] ?? DEFAULT_SLIPPAGE
    const slippage = (defaultSlippage * SLIPPAGE_PRECISION) / BIPS_PRECISION
    return encodePacked(['uint256'], [slippage])
  }, [address])
}
