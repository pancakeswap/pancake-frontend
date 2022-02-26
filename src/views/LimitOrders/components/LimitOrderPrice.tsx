import React from 'react'
import { Currency, Percent, Price } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { Input, Flex, Text, ArrowUpDownIcon, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { escapeRegExp } from 'utils'
import { Rate } from 'state/limitOrders/types'
import { getRatePercentageMessage, PercentageDirection } from '../utils/getRatePercentageMessage'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

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
  handleResetToMarketPrice: () => void
}

const DIRECTION_COLORS = {
  [PercentageDirection.ABOVE]: 'success',
  [PercentageDirection.BELOW]: 'failure',
  [PercentageDirection.MARKET]: 'textSubtle',
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
  handleResetToMarketPrice,
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

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextUserInput = event.target.value.replace(/,/g, '.')
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  const isAtMarketPrice = percentageRateDifference?.equalTo(0) ?? true
  const [ratePercentageMessage, direction] = getRatePercentageMessage(percentageRateDifference, t)
  const priceLabelColor = DIRECTION_COLORS[direction]
  return (
    <>
      <Flex justifyContent="space-between" id={id}>
        <Flex alignItems="center">
          <Text mr="8px" color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Price')}
          </Text>
          <Button
            onClick={handleResetToMarketPrice}
            startIcon={<AutoRenewIcon color={isAtMarketPrice ? 'disabled' : 'primary'} />}
            variant="secondary"
            scale="xs"
            disabled={isAtMarketPrice}
          >
            <Text fontSize="12px" bold color={isAtMarketPrice ? 'disabled' : 'primary'} textTransform="uppercase">
              {t('Market')}
            </Text>
          </Button>
        </Flex>
        {ratePercentageMessage && (
          <Text color={priceLabelColor} fontSize="12px">
            {ratePercentageMessage}
          </Text>
        )}
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
