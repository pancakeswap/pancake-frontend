import React, { createContext, useState, useEffect, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { useExchangeChartManager } from 'state/user/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const SwapFeaturesContext = createContext<{
  isChartSupported: boolean
  isStableSupported: boolean
  isAccessTokenSupported: boolean
  isChartExpanded: boolean
  isChartDisplayed: boolean
  setIsChartExpanded: React.Dispatch<React.SetStateAction<boolean>>
  setIsChartDisplayed: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isChartSupported: false,
  isStableSupported: false,
  isAccessTokenSupported: false,
  isChartExpanded: false,
  isChartDisplayed: false,
  setIsChartExpanded: null,
  setIsChartDisplayed: null,
})

const CHART_SUPPORT_CHAIN_IDS = [ChainId.BSC]
const ACCESS_TOKEN_SUPPORT_CHAIN_IDS = [ChainId.BSC]
const STABLE_SUPPORT_CHAIN_IDS = [ChainId.BSC_TESTNET, ChainId.BSC]

export const SwapFeaturesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isMobile } = useMatchBreakpoints()
  const { chainId } = useActiveChainId()
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const [isChartExpanded, setIsChartExpanded] = useState(false)

  const isChartSupported = useMemo(
    () =>
      // avoid layout shift, by default showing
      !chainId || CHART_SUPPORT_CHAIN_IDS.includes(chainId),
    [chainId],
  )

  const isStableSupported = useMemo(() => !chainId || STABLE_SUPPORT_CHAIN_IDS.includes(chainId), [chainId])

  const isAccessTokenSupported = useMemo(() => ACCESS_TOKEN_SUPPORT_CHAIN_IDS.includes(chainId), [chainId])

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  const value = useMemo(() => {
    return {
      isChartSupported,
      isStableSupported,
      isAccessTokenSupported,
      isChartDisplayed,
      setIsChartDisplayed,
      isChartExpanded,
      setIsChartExpanded,
    }
  }, [
    isChartSupported,
    isStableSupported,
    isAccessTokenSupported,
    isChartDisplayed,
    setIsChartDisplayed,
    isChartExpanded,
    setIsChartExpanded,
  ])

  return <SwapFeaturesContext.Provider value={value}>{children}</SwapFeaturesContext.Provider>
}
