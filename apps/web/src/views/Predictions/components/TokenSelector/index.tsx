import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { DesktopPredictionTokenSelector } from 'views/Predictions/components/TokenSelector/Desktop'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { usePredictionConfigs } from 'views/Predictions/hooks/usePredictionConfigs'

export const TokenSelector = () => {
  const router = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)
  const config = useConfig()
  const predictionConfigs = usePredictionConfigs()

  const tokenListData = useMemo(() => {
    return predictionConfigs
      ? Object.values(predictionConfigs).filter((i) => i.token.symbol !== config?.token?.symbol)
      : []
  }, [config, predictionConfigs])

  const isTokenListMoreThanOne: boolean = useMemo(() => tokenListData?.length > 0, [tokenListData])

  const onClickSwitchToken = useCallback(
    (tokenSymbol: string) => {
      if (tokenSymbol && isTokenListMoreThanOne) {
        router.query.token = tokenSymbol
        router.replace(router, undefined, { scroll: false })

        setIsOpen(false)
      }
    },
    [router, isTokenListMoreThanOne],
  )

  return (
    <Box>
      {isDesktop ? (
        <DesktopPredictionTokenSelector
          isOpen={isOpen}
          tokenListData={tokenListData}
          isTokenListMoreThanOne={isTokenListMoreThanOne}
          setIsOpen={setIsOpen}
          onClickSwitchToken={onClickSwitchToken}
        />
      ) : null}
    </Box>
  )
}
