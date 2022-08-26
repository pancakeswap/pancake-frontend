import React from 'react'
import { Currency, Percent, Price } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { Input, Flex, Text, Button, AutoRenewIcon, SyncAltIcon, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
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
  handleRateType: (rateType: Rate, price?: Price<Currency, Currency>) => void
  price: Price<Currency, Currency>
  handleResetToMarketPrice: () => void
  realExecutionPriceAsString: string
  disabled: boolean
}

const DIRECTION_COLORS = {
  [PercentageDirection.ABOVE]: 'success',
  [PercentageDirection.BELOW]: 'failure',
  [PercentageDirection.MARKET]: 'textSubtle',
}

const LimitOrderPrice: React.FC<React.PropsWithChildren<LimitOrderPriceProps>> = ({
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
  realExecutionPriceAsString,
  disabled,
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

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t(
          'The real execution price includes the gas cost necessary to execute your order and guarantees that your order will be executed at the desired price.',
        )}
      </Text>
      <Text>{t('It fluctuates according to gas prices when the order is getting executed.')}</Text>
      {inputCurrency?.symbol && outputCurrency?.symbol && realExecutionPriceAsString && (
        <Text>
          {realExecutionPriceAsString === 'never executes'
            ? t(
                'Assuming the current gas price, this order will never be executed. Try increasing the number of tokens to swap in your order.',
              )
            : t('Assuming current gas price it should execute when 1 %assetOneSymbol% = %price% %assetTwoSymbol%', {
                assetOneSymbol: rateType === Rate.MUL ? inputCurrency?.symbol : outputCurrency?.symbol,
                assetTwoSymbol: rateType === Rate.MUL ? outputCurrency?.symbol : inputCurrency?.symbol,
                price: realExecutionPriceAsString,
              })}
        </Text>
      )}
    </>,
    { placement: 'top' },
  )

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextUserInput = event.target.value.replace(/,/g, '.')
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  const isAtMarketPrice = percentageRateDifference?.equalTo(0) ?? true
  const [ratePercentageMessage, direction] = getRatePercentageMessage(percentageRateDifference, t)
  const priceLabelColor = DIRECTION_COLORS[direction]
  const _realExecutionPriceAsString =
    realExecutionPriceAsString === 'never executes' ? t('never executes') : realExecutionPriceAsString

  return (
    <>
      <Flex justifyContent="space-between" id={id}>
        <Flex alignItems="center">
          <Text mr="8px" color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Price')}
          </Text>
          <Button
            onClick={handleResetToMarketPrice}
            startIcon={<AutoRenewIcon color={isAtMarketPrice ? 'textDisabled' : 'primary'} />}
            variant="secondary"
            scale="xs"
            disabled={isAtMarketPrice}
          >
            <Text fontSize="12px" bold color={isAtMarketPrice ? 'textDisabled' : 'primary'} textTransform="uppercase">
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
        disabled={disabled}
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
        <LabelContainer justifyContent="flex-end" alignItems="center" onClick={toggleRateType}>
          <Text small bold>
            {label}
          </Text>
          <SyncAltIcon color="textSubtle" width="24px" ml="4px" />
        </LabelContainer>
      )}
      <Flex justifySelf="flex-end" mb="8px" minHeight="16px">
        {realExecutionPriceAsString && (
          <>
            <Text small color="textSubtle" mr="4px">
              {t('Real execution price: %price%', { price: _realExecutionPriceAsString })}
            </Text>
            <span ref={targetRef}>
              <HelpIcon color="textSubtle" />
              {tooltipVisible && tooltip}
            </span>
          </>
        )}
      </Flex>
    </>
  )
}

export default LimitOrderPrice
