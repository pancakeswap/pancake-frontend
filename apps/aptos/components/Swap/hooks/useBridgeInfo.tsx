import { useMemo } from 'react'
import { useAccount, useBalance } from '@pancakeswap/awgmi'
import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { bridgeInfo } from 'components/Swap/BridgeButton'

const useBridgeInfo = ({ currency }: { currency?: Currency }) => {
  const { account } = useAccount()
  const { data, isLoading } = useBalance({
    address: account?.address,
    coin: currency?.wrapped?.address,
    enabled: !!currency,
    watch: true,
  })

  const bridgeResult = useMemo(
    () => bridgeInfo.find((bridge) => currency?.symbol.startsWith(bridge.symbol)),
    [currency],
  )

  const showBridgeWarning = useMemo(
    () => account?.address && bridgeResult && !isLoading && Number(data?.formatted ?? 0) <= 0,
    [account, data, isLoading, bridgeResult],
  )

  return {
    bridgeResult,
    showBridgeWarning,
  }
}

export default useBridgeInfo
