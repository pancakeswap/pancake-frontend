import { useCallback, useContext } from 'react'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { Box, Flex, BottomDrawer, useMatchBreakpoints, Swap as SwapUI } from '@pancakeswap/uikit'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { AppBody } from 'components/App'

import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/swap/actions'
import { useSwapState, useSingleTokenSwapInfo } from '../../state/swap/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'

import SwapForm from './components/SwapForm'
import StableSwapFormContainer from './StableSwap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import SwapTab, { SwapType } from './components/SwapTab'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import AkkaSwapForm from './AkkaSwap/components/AkkaSwapForm'
import { chainId } from 'wagmi'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useIsAkkaSwap } from 'state/global/hooks'
import { useAkkaBitgertTokenlistHandshake } from './AkkaSwap/hooks/useAkkaRouterApi'
import AkkaSwapFormContainer from './AkkaSwap'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSWR from 'swr'
export default function Swap() {
  const { isMobile } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const isAkkaSwapMode = useIsAkkaSwap()
  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }
  const { chainId: walletChainId } = useWeb3React()
  const { chainId: appChainId } = useActiveChainId()

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)
  const tokenlistHandshake = useAkkaBitgertTokenlistHandshake()

  const setForm = useCallback(() => {
    if ((walletChainId === ChainId.BITGERT || appChainId === ChainId.BITGERT) && isAkkaSwapMode) {
      return <AkkaSwapFormContainer />
    }
    if ((walletChainId === ChainId.BITGERT || appChainId === ChainId.BITGERT) && !isAkkaSwapMode) {
      return <SwapForm />
    }
    if (!(walletChainId === ChainId.BITGERT || appChainId === ChainId.BITGERT)) {
      return <SwapForm />
    }
  }, [appChainId, walletChainId, isAkkaSwapMode])

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
                    swapTypeState === SwapType.STABLE_SWAP ? <StableSwapFormContainer /> : setForm()
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
