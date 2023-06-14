import { Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { CryptoCard } from 'components/Card'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { getRefValue } from 'views/BuyCrypto/hooks/useGetRefValue'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ProviderIcon } from 'views/BuyCrypto/Icons'
import { useTranslation } from '@pancakeswap/localization'

const DropdownWrapper = styled.div`
  width: 100%;
`
const FEE_TYPES = ['Total Fees', 'Provider Fees', 'Networking Fees']

const calculateMoonPayQuoteFromFees = (quote: ProviderQoute, spendAmount: string) => {
  const totalFees = new BigNumber(quote.networkFee).plus(new BigNumber(quote.providerFee))
  const fiatAmountAfterFees = new BigNumber(spendAmount).minus(totalFees)
  const AssetRate = new BigNumber(quote.quote)
  const moonPayQuote = fiatAmountAfterFees.dividedBy(AssetRate)
  return moonPayQuote.toNumber()
}

const calculateBinanceConnectQuoteFromFees = (quote: ProviderQoute) => {
  const binanceConnectQuote = new BigNumber(quote.amount).minus(new BigNumber(quote.networkFee))
  return binanceConnectQuote.toNumber()
}

// const calculateMercuryoQuoteFromFees = (quote: ProviderQoute, spendAmount: string) => {
//   const totalFees = new BigNumber(quote.networkFee).plus(new BigNumber(quote.providerFee))
//   const fiatAmountAfterFees = new BigNumber(spendAmount).minus(totalFees)
//   const AssetRate = new BigNumber(quote.quote)
//   const moonPayQuote = fiatAmountAfterFees.dividedBy(AssetRate)
//   return moonPayQuote.toString()
// }

const FeeItem = ({ feeTitle, feeAmount }: { feeTitle: string; feeAmount: string }) => {
  return (
    <RowBetween>
      <Text fontSize="14px" color="textSubtle">
        {feeTitle}
      </Text>
      <Text ml="4px" fontSize="14px" color="textSubtle">
        {feeAmount}
      </Text>
    </RowBetween>
  )
}

function AccordionItem({
  active,
  btnOnClick,
  buyCryptoState,
  quote,
  fetching,
}: {
  active: boolean
  btnOnClick: any
  buyCryptoState: BuyCryptoState
  quote: ProviderQoute
  fetching: boolean
}) {
  const { t } = useTranslation()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(105)
  const multiple = false
  const [visiblity, setVisiblity] = useState(false)

  const isActive = () => (multiple ? visiblity : active)

  const toogleVisiblity = useCallback(() => {
    setVisiblity((v) => !v)
    btnOnClick()
  }, [setVisiblity, btnOnClick])

  useEffect(() => {
    if (active) {
      const contentEl = getRefValue(contentRef)
      setHeight(contentEl.scrollHeight + 105)
    } else setHeight(105)
  }, [active])

  let finalQuote = quote.amount
  if (quote.provider === 'MoonPay') finalQuote = calculateMoonPayQuoteFromFees(quote, buyCryptoState.typedValue)
  else if (quote.provider === 'BinanceConnect') finalQuote = calculateBinanceConnectQuoteFromFees(quote)

  return (
    <Flex flexDirection="column">
      <CryptoCard
        padding="12px 12px"
        style={{ height }}
        onClick={!isActive() ? toogleVisiblity : () => null}
        position="relative"
        isClicked={active}
      >
        <RowBetween paddingBottom="20px">
          <ProviderIcon provider={quote.provider} width="130px" />
          <Text ml="4px" fontSize="22px" color="secondary">
            {finalQuote.toFixed(5)} {buyCryptoState.INPUT.currencyId}
          </Text>
        </RowBetween>
        <RowBetween pt="8px">
          <Text fontSize="15px">
            {buyCryptoState.INPUT.currencyId} {t('rate')}
          </Text>
          <Text ml="4px" fontSize="16px">
            = {quote.quote?.toFixed(4)} {buyCryptoState.OUTPUT.currencyId}
          </Text>
        </RowBetween>

        <DropdownWrapper ref={contentRef}>
          {FEE_TYPES.map((feeType: string, index: number) => {
            let fee = '0'
            if (index === 0) fee = (quote.networkFee + quote.providerFee).toFixed(3)
            else if (index === 1) fee = quote.networkFee.toFixed(3)
            else fee = quote.providerFee.toFixed(3)
            return <FeeItem feeTitle={feeType} feeAmount={fee} />
          })}
          <FiatOnRampModalButton
            provider={quote.provider}
            inputCurrency={buyCryptoState.INPUT.currencyId}
            outputCurrency={buyCryptoState.OUTPUT.currencyId}
            amount={buyCryptoState.typedValue}
            disabled={fetching}
          />
        </DropdownWrapper>
      </CryptoCard>
    </Flex>
  )
}

export default AccordionItem
