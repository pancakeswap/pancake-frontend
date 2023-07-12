import { memo, useMemo, useState, useCallback } from 'react'
import { ModalV2, RowBetween, Text, Flex, CurrencyInput, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { formatPercent } from '@pancakeswap/utils/formatFractions'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import styled from 'styled-components'

import { StyledModal } from './StyledModal'
import { FeeTag } from './Tags'

interface Props {
  isOpen?: boolean
  onDismiss?: () => void

  vaultName: string
  feeTier: FeeAmount
  currencyA: Currency
  currencyB: Currency

  onAmountChange?: (info: { value: string; currency: Currency; otherAmount: CurrencyAmount<Currency> }) => {
    otherAmount: CurrencyAmount<Currency>
  }

  // TODO: return data
  onAdd?: (params: { amountA: CurrencyAmount<Currency>; amountB: CurrencyAmount<Currency> }) => Promise<void>
}

const StyledCurrencyInput = styled(CurrencyInput)`
  flex: 1;
`

export const AddLiquidity = memo(function AddLiquidity({
  isOpen,
  vaultName,
  onDismiss,
  currencyA,
  currencyB,
  feeTier,
  onAmountChange,
}: Props) {
  const [valueA, setValueA] = useState('')
  const [valueB, setValueB] = useState('')
  const { t } = useTranslation()
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])

  const onInputChange = useCallback(
    ({
      value,
      currency,
      otherValue,
      otherCurrency,
      setValue,
      setOtherValue,
    }: {
      value: string
      currency: Currency
      otherValue: string
      otherCurrency: Currency
      setValue: (value: string) => void
      setOtherValue: (value: string) => void
    }) => {
      setValue(value)
      const otherAmount = tryParseAmount(otherValue, otherCurrency)
      if (!otherAmount) {
        return
      }
      const result = onAmountChange?.({ value, currency, otherAmount })
      if (result) {
        setOtherValue(result.otherAmount.toExact())
      }
    },
    [onAmountChange],
  )

  const onCurrencyAChange = useCallback(
    (value: string) =>
      onInputChange({
        value,
        currency: currencyA,
        otherValue: valueB,
        otherCurrency: currencyB,
        setValue: setValueA,
        setOtherValue: setValueB,
      }),
    [currencyA, currencyB, valueB, onInputChange],
  )

  const onCurrencyBChange = useCallback(
    (value: string) =>
      onInputChange({
        value,
        currency: currencyB,
        otherValue: valueA,
        otherCurrency: currencyA,
        setValue: setValueB,
        setOtherValue: setValueA,
      }),
    [currencyA, currencyB, valueA, onInputChange],
  )

  const amountA = useMemo(
    () => tryParseAmount(valueA, currencyA) || CurrencyAmount.fromRawAmount(currencyA, '0'),
    [valueA, currencyA],
  )
  const amountB = useMemo(
    () => tryParseAmount(valueB, currencyB) || CurrencyAmount.fromRawAmount(currencyB, '0'),
    [valueB, currencyB],
  )

  // TODO: mock
  const share = new Percent(158, 10000)
  const apr = new Percent(4366, 10000)

  return (
    <ModalV2 onDismiss={onDismiss} isOpen={isOpen}>
      <StyledModal title={t('Add Liquidity')}>
        <RowBetween>
          <Text color="textSubtle">{t('Adding')}:</Text>
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Text color="text" bold>
              {tokenPairName}
            </Text>
            <Text color="text" ml="0.25em">
              {vaultName}
            </Text>
            <FeeTag feeAmount={feeTier} ml="0.25em" />
          </Flex>
        </RowBetween>
        <Flex mt="1em">
          <StyledCurrencyInput currency={currencyA} value={valueA} onChange={onCurrencyAChange} />
        </Flex>
        <Flex mt="1em">
          <StyledCurrencyInput currency={currencyB} value={valueB} onChange={onCurrencyBChange} />
        </Flex>
        <Flex mt="1.5em" flexDirection="column">
          <RowBetween>
            <Text color="text">{t('Your share in the vault')}:</Text>
            <Text color="text">{formatPercent(share)}%</Text>
          </RowBetween>
          <RowBetween>
            <Text color="text">{t('APR')}:</Text>
            <Text color="text">{formatPercent(apr)}%</Text>
          </RowBetween>
        </Flex>
        <Flex mt="1.5em" flexDirection="column">
          <AddLiquidityButton amountA={amountA} amountB={amountB} />
        </Flex>
      </StyledModal>
    </ModalV2>
  )
})

interface AddLiquidityButtonProps {
  amountA: CurrencyAmount<Currency>
  amountB: CurrencyAmount<Currency>
  onClick?: () => void
}

export const AddLiquidityButton = memo(function AddLiquidityButton({
  amountA,
  amountB,
  onClick,
}: AddLiquidityButtonProps) {
  const { t } = useTranslation()
  return (
    <>
      <Button variant="primary" width="100%">
        {t('Approve %symbol%', {
          symbol: amountA.currency.symbol,
        })}
      </Button>
      <Button variant="primary" width="100%" mt="0.5em">
        {t('Approve %symbol%', {
          symbol: amountB.currency.symbol,
        })}
      </Button>
      <Button mt="0.5em" variant="primary" width="100%" onClick={onClick}>
        {t('Confirm')}
      </Button>
    </>
  )
})
