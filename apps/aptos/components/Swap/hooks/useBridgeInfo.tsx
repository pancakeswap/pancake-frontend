import { useMemo } from 'react'
import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { bridgeInfo } from 'components/Swap/BridgeButton'

const useBridgeInfo = ({ currency }: { currency?: Currency }) => {
  const bridgeResult = useMemo(
    () => bridgeInfo.find((bridge) => currency?.symbol.startsWith(bridge.symbol)),
    [currency],
  )

  return bridgeResult
}

export default useBridgeInfo
