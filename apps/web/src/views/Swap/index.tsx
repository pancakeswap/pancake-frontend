import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { BottomDrawer, Flex, Modal, ModalV2, useMatchBreakpoints } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { AppBody } from 'components/App'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { currencyId } from 'utils/currencyId'

import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import HotTokenList from './components/HotTokenList'
import useWarningImport from './hooks/useWarningImport'
import { V3SwapForm } from './V3Swap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import { SwapFeaturesContext } from './SwapFeaturesContext'

export default function Swap() {
  const { query } = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const {
    isChartExpanded,
    isChartDisplayed,
    setIsChartDisplayed,
    setIsChartExpanded,
    isChartSupported,
    isHotTokenSupported,
  } = useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()
  const [firstTime, setFirstTime] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }

  useEffect(() => {
    if (firstTime && query.showTradingReward) {
      setFirstTime(false)
      setIsSwapHotTokenDisplay(true)

      if (!isSwapHotTokenDisplay && isChartDisplayed) {
        toggleChartDisplayed()
      }
    }
  }, [firstTime, isChartDisplayed, isSwapHotTokenDisplay, query, setIsSwapHotTokenDisplay, toggleChartDisplayed])

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)
  const warningSwapHandler = useWarningImport()
  useDefaultsFromURLSearch()
  const { onCurrencySelection } = useSwapActionHandlers()

  const handleOutputSelect = useCallback(
    (newCurrencyOutput: Currency) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)
      warningSwapHandler(newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        {isDesktop && isChartSupported && (
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
        {!isDesktop && isChartSupported && (
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
                isFullWidthContainer
                isMobile
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={setIsChartDisplayed}
          />
        )}
        {isDesktop && isSwapHotTokenDisplay && isHotTokenSupported && (
          <HotTokenList handleOutputSelect={handleOutputSelect} />
        )}
        <ModalV2
          isOpen={!isDesktop && isSwapHotTokenDisplay && isHotTokenSupported}
          onDismiss={() => setIsSwapHotTokenDisplay(false)}
        >
          <Modal
            style={{ padding: 0 }}
            title={t('Top Token')}
            onDismiss={() => setIsSwapHotTokenDisplay(false)}
            bodyPadding="0px"
          >
            <HotTokenList
              handleOutputSelect={(newCurrencyOutput: Currency) => {
                handleOutputSelect(newCurrencyOutput)
                setIsSwapHotTokenDisplay(false)
              }}
            />
          </Modal>
        </ModalV2>
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <V3SwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
