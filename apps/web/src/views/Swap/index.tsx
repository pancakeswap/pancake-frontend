import { useCallback, useContext, useEffect } from 'react'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { Box, Flex, BottomDrawer, useMatchBreakpoints, Swap as SwapUI } from '@pancakeswap/uikit'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { AppBody } from 'components/App'

import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/swap/actions'
import { useSwapState, useSingleTokenSwapInfo, useDerivedSwapInfo } from '../../state/swap/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'

import SwapForm from './components/SwapForm'
import StableSwapFormContainer from './StableSwap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import SwapTab, { SwapType } from './components/SwapTab'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import { chainId } from 'wagmi'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useIsAkkaSwap, useIsAkkaSwapModeStatus } from 'state/global/hooks'
import { useAkkaBitgertTokenlistHandshake } from './AkkaSwap/hooks/useAkkaRouterApi'
import AkkaSwapFormContainer from './AkkaSwap'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSWR from 'swr'
import { useAkkaSwapInfo } from './AkkaSwap/hooks/useAkkaSwapInfo'
import { useUserSlippageTolerance } from 'state/user/hooks'
export default function Swap() {
  const { isMobile } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)
  const { account } = useWeb3React()
  // swap state & price data
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }
  const { chainId: walletChainId } = useWeb3React()
  const { chainId: appChainId } = useActiveChainId()

  // isAkkaSwapMode checks if this is akka router form or not from redux
  const [isAkkaSwapMode, toggleSetAkkaMode, toggleSetAkkaModeToFalse, toggleSetAkkaModeToTrue] =
    useIsAkkaSwapModeStatus()
  // Get pancakeswap router route
  const { v2Trade } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, account)

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  // Get akka router route
  const { trade: akkaRouterTrade } = useAkkaSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    allowedSlippage,
  )
  useEffect(() => {
    // Check if pancakeswap route is better than akka route
    if (akkaRouterTrade?.route?.return_amount && v2Trade?.outputAmount?.toSignificant(6)) {
      if (Number(v2Trade?.outputAmount?.toSignificant(6)) > Number(akkaRouterTrade?.route?.return_amount)) {
        toggleSetAkkaModeToFalse()
      }
      else if (Number(v2Trade?.outputAmount?.toSignificant(6)) < Number(akkaRouterTrade?.route?.return_amount)) {
        toggleSetAkkaModeToTrue()
      }
    }
  }, [typedValue, akkaRouterTrade, inputCurrencyId, outputCurrencyId])
  // checks if akka router backend is up or not
  const tokenlistHandshake = useAkkaBitgertTokenlistHandshake()

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width={['328px', , '100%']} height="100%" justifyContent="center" position="relative">
        {!isMobile && isChartSupported && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {isChartSupported && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isMobile
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={setIsChartDisplayed}
          />
        )}
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <SwapTab>
                  {(swapTypeState) =>
                    swapTypeState === SwapType.STABLE_SWAP ? <StableSwapFormContainer /> : <SwapForm />
                  }
                </SwapTab>
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {isChartExpanded && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <SwapUI.Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}
