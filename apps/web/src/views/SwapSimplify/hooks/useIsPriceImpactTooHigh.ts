import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo, useRef } from 'react'
import { warningSeverity } from 'utils/exchange'
import { InterfaceOrder, isXOrder } from 'views/Swap/utils'

import { computeTradePriceBreakdown } from '../../Swap/V3Swap/utils/exchange'

export const useIsPriceImpactTooHigh = (bestOrder: InterfaceOrder | undefined, isLoading?: boolean) => {
  const { chainId } = useActiveChainId()
  const chainIdRef = useRef(chainId)

  const { priceImpactWithoutFee } = useMemo(
    () => computeTradePriceBreakdown(isXOrder(bestOrder) ? bestOrder?.ammTrade : bestOrder?.trade),
    [bestOrder],
  )
  const isPriceImpactTooHigh = useMemo(() => {
    const warningLevel = warningSeverity(priceImpactWithoutFee)
    if (chainIdRef?.current === chainId) {
      if (!isLoading) return warningLevel >= 3
      return false
    }
    chainIdRef.current = chainId
    return false
  }, [priceImpactWithoutFee, chainId, isLoading])

  return { isPriceImpactTooHigh }
}
