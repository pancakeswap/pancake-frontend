import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { BottomDrawer, Button, Flex, Modal, ModalV2, useMatchBreakpoints } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { AppBody } from 'components/App'
import { useCallback, useContext } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { currencyId } from 'utils/currencyId'
import { useSignTypedData } from 'wagmi'

import { useMMLinkedPoolContract } from 'hooks/useContract'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/swap/actions'
import { useSingleTokenSwapInfo, useSwapState } from '../../state/swap/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import HotTokenList from './components/HotTokenList'
import useWarningImport from './hooks/useWarningImport'
import { SmartSwapForm } from './SmartSwap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import { SwapFeaturesContext } from './SwapFeaturesContext'

export default function Swap() {
  const { isMobile } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()
  const signMMData = pretendToBeMMData()
  const { data, isError, error, signTypedDataAsync } = useSignTypedData(signMMData)
  const contract = useMMLinkedPoolContract()

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
        {!isMobile && isSwapHotTokenDisplay && <HotTokenList handleOutputSelect={handleOutputSelect} />}

        <ModalV2 isOpen={isMobile && isSwapHotTokenDisplay} onDismiss={() => setIsSwapHotTokenDisplay(false)}>
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
                <SmartSwapForm handleOutputSelect={handleOutputSelect} />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          <Button
            style={{ width: 330, marginLeft: 40, marginTop: 20 }}
            onClick={async () => {
              // const nonce = (
              //   await contract.getUserNonce(
              //     '0x3148Ba523363d073dbffBB62b5C18C77F7A705e9',
              //     '0x3148Ba523363d073dbffBB62b5C18C77F7A705e9',
              //   )
              // ).toString()
              signTypedDataAsync().then((result) => {
                console.log(result, 'result data')
              })
            }}
          >
            sign As MM
          </Button>
          <Button
            style={{ width: 330, marginLeft: 40, marginTop: 20 }}
            onClick={async () => {
              const mmSinger = '0x3148Ba523363d073dbffBB62b5C18C77F7A705e9'
              const quoteValue = pretendToBeMMData().value
              const signature =
                '0x96e27c9ea6ca1aa1c3d19f68d7a1c12895392302976d30935f766d2852131e4d70a0fd1122bd46105ce6a0ba7ba38f8dee794471a1adc90bd15dd6dce021eac31b'
              const result = await contract.verifyQuoteSignature(mmSinger, quoteValue, signature)
              console.log(result, 'verifyQuoteSignature')
              contract.swap(mmSinger, quoteValue, signature)
            }}
          >
            trade with MM
          </Button>
        </Flex>
      </Flex>
    </Page>
  )
}

const pretendToBeMMData = () => {
  const domain = {
    name: 'PCS MM Pool',
    version: '1',
    chainId: 5, // GOERLI
    verifyingContract: '0xf61F708e3f094fBD5db66CFc3E4367b3023D6Da2' as any,
  }
  const quoteType = {
    Quote: [
      { name: 'nonce', type: 'uint256' },
      { name: 'user', type: 'address' },
      { name: 'baseToken', type: 'address' },
      { name: 'quoteToken', type: 'address' },
      { name: 'baseTokenAmount', type: 'uint256' },
      { name: 'quoteTokenAmount', type: 'uint256' },
      { name: 'expiryTimestamp', type: 'uint256' },
    ],
  }
  const quoteValue = {
    nonce: '0',
    user: '0x3148Ba523363d073dbffBB62b5C18C77F7A705e9',
    baseToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    quoteToken: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    baseTokenAmount: '1000000000000000', // 0.01 WETH
    quoteTokenAmount: '1000000', // 10 tUsdc
    expiryTimestamp: '1673327860', // Tue Jan 10 2023 13:17:40 GMT+0800
  }
  return {
    domain,
    types: quoteType,
    value: quoteValue,
  }
}
