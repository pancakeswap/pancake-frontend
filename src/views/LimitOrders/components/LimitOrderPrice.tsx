import React from 'react'
import { Currency, Percent, Price } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { Input, Flex, Text, ArrowUpDownIcon, RefreshIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { escapeRegExp } from 'utils'
import { Rate } from 'state/limitOrders/types'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

// TODO: localize
const getRatePercentageMessage = (percentageRateDifference: Percent, rateType: Rate): [string | null, boolean] => {
  if (percentageRateDifference) {
    if (rateType === Rate.MUL) {
      const direction = percentageRateDifference.lessThan('0') ? 'below' : 'above'
      const percentageAsString = percentageRateDifference.toSignificant(3)
      const formattedPercentage = parseFloat(percentageAsString).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
      return [`${formattedPercentage}% ${direction} market`, direction === 'above']
    }
    const direction = percentageRateDifference.lessThan('0') ? 'above' : 'below'
    const percentageAsString = percentageRateDifference.multiply(-1).toSignificant(3)
    const formattedPercentage = parseFloat(percentageAsString).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })
    return [`${formattedPercentage}% ${direction} market`, direction === 'above']
  }
  return [null, null]
}

const OrderPriceInput = styled(Input)`
  text-align: right;
`

const LabelContainer = styled(Flex)`
  cursor: pointer;
`

interface LimitOrderPriceProps {
  id: string
  value: string
  onUserInput: (value: string) => void
  inputCurrency: Currency
  outputCurrency: Currency
  percentageRateDifference: Percent
  rateType: Rate
  handleRateType: (rateType: Rate, price?: Price) => void
  price: Price
  marketPrice: Price
}

const LimitOrderPrice: React.FC<LimitOrderPriceProps> = ({
  id,
  value,
  onUserInput,
  inputCurrency,
  outputCurrency,
  percentageRateDifference,
  rateType,
  handleRateType,
  price,
  marketPrice,
}) => {
  const { t } = useTranslation()

  const hasCurrencyInfo = inputCurrency && outputCurrency
  const label =
    rateType === Rate.MUL
      ? `${outputCurrency?.symbol} per ${inputCurrency?.symbol}`
      : `${inputCurrency?.symbol} per ${outputCurrency?.symbol}`

  const toggleRateType = () => {
    handleRateType(rateType, price)
  }

  const resetToMarketPrice = () => {
    const currentMarketPrice =
      rateType === Rate.MUL ? marketPrice?.toSignificant(6) : marketPrice?.invert().toSignificant(6)
    onUserInput(currentMarketPrice ?? '')
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextUserInput = event.target.value.replace(/,/g, '.')
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  const isAtMarketPrice = percentageRateDifference?.equalTo(0) ?? true
  const [ratePercentageMessage, isAbove] = getRatePercentageMessage(percentageRateDifference, rateType)
  const priceLabelColor = isAtMarketPrice ? 'textSubtle' : isAbove ? 'success' : 'failure'
  return (
    <>
      <Flex justifyContent="space-between" id={id}>
        <Flex alignItems="center">
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Price')}
          </Text>
          <IconButton variant="text" height="24px" maxWidth="24px" onClick={resetToMarketPrice}>
            <RefreshIcon color="textSubtle" width="24px" />
          </IconButton>
        </Flex>
        <Text color={priceLabelColor} fontSize="12px">
          {ratePercentageMessage}
        </Text>
      </Flex>
      <OrderPriceInput
        value={value}
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        pattern="^[0-9]*[.,]?[0-9]*$"
        minLength={1}
        maxLength={79}
        spellCheck="false"
        type="text"
        inputMode="decimal"
      />
      {hasCurrencyInfo && (
        <LabelContainer justifyContent="flex-end" onClick={toggleRateType}>
          <Text small bold>
            {label}
          </Text>
          {/* TODO: add ArrowLeftRight icon to UIKit. And make it beautiful */}
          <ArrowUpDownIcon color="textSubtle" width="24px" />
        </LabelContainer>
      )}
    </>
  )
}

export default LimitOrderPrice
