import { ChainNamesExtended } from '@pancakeswap/chains'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowForwardIcon, Box, Column, Text, TokenImageWithBadge } from '@pancakeswap/uikit'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { getImageUrlFromToken } from 'components/TokenImage'
import { useAllNativeCurrencies } from 'hooks/Tokens'
import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { styled } from 'styled-components'
import { fiatCurrencyMap } from 'views/BuyCrypto/constants'
import { RowBetween, RowFixed } from '../Layout/Row'

function currencyKey(currency: Currency): string {
  return currency?.isToken ? currency.address : currency?.isNative ? currency.symbol : ''
}

const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 8px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.background};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

function OnRampCurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  mode,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  mode: string
}) {
  const key = currencyKey(currency)

  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      {mode === 'onramp-fiat' ? (
        <FiatLogo currency={currency} size="24px" />
      ) : (
        <Box width="28px" height="28px">
          <TokenImageWithBadge
            width={28}
            height={28}
            primarySrc={getImageUrlFromToken(currency as Token)}
            chainId={currency.chainId}
          />
        </Box>
      )}

      <Column>
        <Text bold>{currency?.symbol}</Text>
        <Text color="textSubtle" small ellipsis maxWidth="200px">
          {ChainNamesExtended[currency.chainId]}
        </Text>
      </Column>
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        <ArrowForwardIcon />
      </RowFixed>
    </MenuItem>
  )
}

export default function OnRampCurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  mode,
}: {
  height: number | string
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  mode: string
}) {
  const nativeCurrencies = useAllNativeCurrencies()
  console.log(nativeCurrencies)
  const itemData = useMemo(() => [...currencies], [currencies])
  console.log(itemData)
  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isFiat = Boolean(Object.keys(fiatCurrencyMap).includes(currency?.symbol))

      // the alternative to making a fiat currency token list
      // with class methods
      let isSelected = false
      let otherSelected = false
      if (!isFiat && mode !== 'onramp-output') {
        isSelected = Boolean(selectedCurrency && currency && selectedCurrency.equals(currency))
        otherSelected = Boolean(otherCurrency && currency && otherCurrency.equals(currency))
      } else {
        isSelected = Boolean(selectedCurrency?.symbol && currency && selectedCurrency?.symbol === currency?.symbol)
        otherSelected = Boolean(otherCurrency?.symbol && currency && otherCurrency?.symbol === currency?.symbol)
      }
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <OnRampCurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
          mode={mode}
        />
      )
    },
    [selectedCurrency, otherCurrency, onCurrencySelect, mode],
  )

  const itemKey = useCallback((index: number, data: any) => `${currencyKey(data[index])}-${index}`, [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
