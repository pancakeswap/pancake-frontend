import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import type { AtomBoxProps } from '@pancakeswap/uikit'
import { AddIcon, Button, Flex, MinusIcon, Row, RowBetween, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { useTotalAssetInSingleDepositTokenAmount, useTotalAssetInUsd } from '../hooks'

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
  staked0Amount?: CurrencyAmount<Currency>
  staked1Amount?: CurrencyAmount<Currency>
  token0PriceUSD?: number
  token1PriceUSD?: number
  isSingleDepositToken?: boolean
  isSingleDepositToken0?: boolean
  onAdd?: () => void
  onRemove?: () => void
}

export const StakedAssets = memo(function StakedAssets({
  currencyA,
  currencyB,
  onAdd,
  onRemove,
  staked0Amount,
  staked1Amount,
  token0PriceUSD,
  token1PriceUSD,
  isSingleDepositToken0,
  isSingleDepositToken,
}: StakedAssetsProps) {
  const { t } = useTranslation()

  const totalAssetsInUsd = useTotalAssetInUsd(staked0Amount, staked1Amount, token0PriceUSD, token1PriceUSD)

  const singleDepositSymbol = isSingleDepositToken0 ? currencyA.symbol : currencyB.symbol
  const singleDepositTokenAmount = isSingleDepositToken0 ? staked0Amount : staked1Amount
  const singleDepositTokenPriceUSD = isSingleDepositToken0 ? token0PriceUSD : token1PriceUSD
  const otherTokenAmount = isSingleDepositToken0 ? staked1Amount : staked0Amount
  const otherTokenPriceUSD = isSingleDepositToken0 ? token1PriceUSD : token0PriceUSD

  const totalAssetInSingleDepositTokenAmount = useTotalAssetInSingleDepositTokenAmount(
    singleDepositTokenAmount,
    otherTokenAmount,
    singleDepositTokenPriceUSD,
    otherTokenPriceUSD,
  )

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
            ~${totalAssetsInUsd.toFixed(2)}
          </Text>
          {isSingleDepositToken && (
            <Text color="textSubtle" fontSize="0.75em">
              (~{totalAssetInSingleDepositTokenAmount.toFixed(6)} {singleDepositSymbol})
            </Text>
          )}
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end">
          <ActionButton scale="md" onClick={onRemove} variant="secondary">
            <MinusIcon color="currentColor" width="1.5em" />
          </ActionButton>
          <ActionButton scale="md" ml="0.5em" onClick={onAdd} variant="secondary">
            <AddIcon color="currentColor" width="1.5em" />
          </ActionButton>
        </Flex>
      </RowBetween>
      <Flex flexDirection="column" mt="1em">
        <CurrencyAmountDisplay amount={staked0Amount} currency={currencyA} priceUSD={token0PriceUSD} />
        <CurrencyAmountDisplay amount={staked1Amount} mt="8px" currency={currencyB} priceUSD={token1PriceUSD} />
      </Flex>
    </>
  )
})

interface CurrencyAmountDisplayProps extends AtomBoxProps {
  amount?: CurrencyAmount<Currency>
  currency: Currency
  priceUSD?: number
}

export const CurrencyAmountDisplay = memo(function CurrencyAmountDisplay({
  amount,
  currency,
  priceUSD,
  ...rest
}: CurrencyAmountDisplayProps) {
  const currencyDisplay = amount?.currency || currency
  const amountDisplay = useMemo(() => formatAmount(amount) || '0', [amount])

  const amountInUsd = useMemo(() => {
    return Number(formatAmount(amount)) * (priceUSD ?? 0) || 0
  }, [amount, priceUSD])

  return (
    <RowBetween {...rest}>
      <Flex flexDirection="row" justifyContent="flex-start">
        <CurrencyLogo currency={currencyDisplay} useTrustWalletUrl={false} />
        <Text color="textSubtle" ml="0.5em">
          {currencyDisplay.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-end">
        <Text color="text">{amountDisplay}</Text>
        <Text color="textSubtle" fontSize="0.75em">
          (~${amountInUsd.toFixed(2)})
        </Text>
      </Flex>
    </RowBetween>
  )
})
