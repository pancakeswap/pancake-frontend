import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { BottomDrawer, Flex, Modal, ModalV2, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useContext } from 'react'

import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/swap/actions'
import { useSingleTokenSwapInfo, useSwapState } from '../../state/swap/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import HotTokenList from './components/HotTokenList'
import { SmartSwapForm } from './SmartSwap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import { SwapFeaturesContext } from './SwapFeaturesContext'

export default function Swap() {
  const { isMobile } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()

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

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
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
        {!isMobile && isSwapHotTokenDisplay && isChartSupported && <HotTokenList />}

        <ModalV2
          isOpen={isMobile && isSwapHotTokenDisplay && isChartSupported}
          onDismiss={() => setIsSwapHotTokenDisplay(false)}
        >
          <Modal
            style={{ padding: 0 }}
            title={t('Top Token')}
            onDismiss={() => setIsSwapHotTokenDisplay(false)}
            bodyPadding="0px"
          >
            <HotTokenList />
          </Modal>
        </ModalV2>

        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <SmartSwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
