import { memo, useMemo } from 'react'
import { Button, Text, RowBetween, Row, Flex, MinusIcon, AddIcon, CurrencyLogo } from '@pancakeswap/uikit'
import type { AtomBoxProps } from '@pancakeswap/ui'
import { BaseAssets } from '@pancakeswap/position-managers'
import { useTranslation } from '@pancakeswap/localization'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'
import styled from 'styled-components'

const Title = styled(Text).attrs({
  bold: true,
  fontSize: '12px',
  textTransform: 'uppercase',
})``

const ActionButton = styled(Button)`
  padding: 0.75em;
`

interface StakedAssetsProps {
  currencyA: Currency
  currencyB: Currency
  assets: BaseAssets
  price?: Price<Currency, Currency>
  onAdd?: () => void
  onRemove?: () => void
}

export const StakedAssets = memo(function StakedAssets({
  currencyA,
  currencyB,
  // assets,
  // price,
  onAdd,
  onRemove,
}: StakedAssetsProps) {
  const { t } = useTranslation()

  // TODO: mock
  const totalAssetsInUsd = '909.67'

  return (
    <>
      <RowBetween>
        <Flex flexDirection="column">
          <Row>
            <Title color="secondary">{t('Liquidity')}</Title>
            <Title ml="0.25em" color="textSubtle">
              {t('Staked')}
            </Title>
          </Row>
          <Text color="text" fontSize="1.5em" bold>
            ~${totalAssetsInUsd}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end">
          <ActionButton variant="primary" scale="md" onClick={onRemove}>
            <MinusIcon width="1.5em" />
          </ActionButton>
          <ActionButton variant="primary" scale="md" ml="0.5em" onClick={onAdd}>
            <AddIcon width="1.5em" />
          </ActionButton>
        </Flex>
      </RowBetween>
      <Flex flexDirection="column" mt="1em">
        <CurrencyAmountDisplay currency={currencyA} />
        <CurrencyAmountDisplay mt="8px" currency={currencyB} />
      </Flex>
    </>
  )
})

interface CurrencyAmountDisplayProps extends AtomBoxProps {
  amount?: CurrencyAmount<Currency>
  currency: Currency
}

export const CurrencyAmountDisplay = memo(function CurrencyAmountDisplay({
  amount,
  currency,
  ...rest
}: CurrencyAmountDisplayProps) {
  const currencyDisplay = amount?.currency || currency
  const amountDisplay = useMemo(() => formatAmount(amount) || '0', [amount])
  // TODO: mock
  const amountInUsd = 534.46

  return (
    <RowBetween {...rest}>
      <Flex flexDirection="row" justifyContent="flex-start">
        <CurrencyLogo currency={currencyDisplay} />
        <Text color="textSubtle" ml="0.5em">
          {currencyDisplay.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-end">
        <Text color="text">{amountDisplay}</Text>
        <Text color="textSubtle" fontSize="0.75em">
          (~${amountInUsd})
        </Text>
      </Flex>
    </RowBetween>
  )
})
