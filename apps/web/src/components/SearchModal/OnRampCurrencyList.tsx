import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowForwardIcon, Column, Flex, QuestionHelper, Text, Toggle } from '@pancakeswap/uikit'
import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { useAllowBtcPurchases } from 'state/buyCrypto/hooks'
import { styled } from 'styled-components'
import { chains } from 'utils/wagmi'
import { OnRampCurrencyLogo } from 'views/BuyCrypto/components/OnRampProviderLogo/OnRampProviderLogo'
import { isNativeBtc } from 'views/BuyCrypto/constants'
import { FiatCurrency } from 'views/BuyCrypto/types'
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
  z-index: ${({ disabled }) => (disabled ? 10 : 0)};
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.background};
  }
  position: relative;
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

const NativeBTCToggle = ({
  allowBuyBtc,
  setAllowBuyBtc,
}: {
  allowBuyBtc: boolean
  setAllowBuyBtc: (v: any) => void
}) => {
  const { t } = useTranslation()
  return (
    <Flex left="82%" top="5%" position="absolute" zIndex={999}>
      <QuestionHelper
        text={t(
          'Enable Native BTC purchases. Only do this is you have a Bitcoin address to receive the funds to. You cannot use your EVM addresses for native BTC.',
        )}
        placement="top"
        size="16px"
        mr="8px"
      />
      <Toggle
        id="toggle-allow-btc-button"
        scale="sm"
        checked={allowBuyBtc}
        onChange={() => setAllowBuyBtc((v) => !v)}
      />
    </Flex>
  )
}

function OnRampCurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  mode,
  allowBuyBtc,
  setAllowBuyBtc,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  mode: string
  allowBuyBtc: boolean
  setAllowBuyBtc: (v: any) => void
}) {
  const { t } = useTranslation()

  const key = currencyKey(currency)
  const isBtcNative = isNativeBtc(currency)
  const disabled = Boolean(isSelected || (isBtcNative && !allowBuyBtc))
  const btcNetworkDisplayName = t('Bitcoin Network')
  const isFiat = Boolean(mode === 'onramp-fiat')

  const chainName = useMemo(() => chains.find((c) => c.id === currency.chainId), [currency.chainId])?.name

  return (
    <>
      {isBtcNative && <NativeBTCToggle allowBuyBtc={allowBuyBtc} setAllowBuyBtc={setAllowBuyBtc} />}

      <MenuItem
        style={style}
        className={`token-item-${key}`}
        onClick={() => (disabled ? null : onSelect())}
        disabled={disabled}
        selected={otherSelected}
      >
        <OnRampCurrencyLogo mode={mode} currency={currency as Token} size={28} />
        <Column>
          <Text bold>{currency?.symbol}</Text>
          <Text color="textSubtle" small ellipsis maxWidth="200px">
            {isFiat ? currency.name : isBtcNative ? btcNetworkDisplayName : chainName}
          </Text>
        </Column>

        <RowFixed style={{ justifySelf: 'flex-end' }} zIndex={999}>
          {!isBtcNative && <ArrowForwardIcon />}
        </RowFixed>
      </MenuItem>
    </>
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
  currencies: Currency[] | FiatCurrency[]
  selectedCurrency?: Currency | FiatCurrency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | FiatCurrency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  mode: string
}) {
  const [allowBuyBtc, setAllowBuyBtc] = useAllowBtcPurchases()

  const itemData = useMemo(() => [...currencies], [currencies])
  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]

      let isSelected = false
      let otherSelected = false

      if (mode !== 'onramp-fiat') {
        isSelected = Boolean(selectedCurrency && currency && (selectedCurrency as Currency).equals(currency))
        otherSelected = Boolean(otherCurrency && currency && (otherCurrency as Currency).equals(currency))
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
          allowBuyBtc={allowBuyBtc}
          setAllowBuyBtc={setAllowBuyBtc}
        />
      )
    },
    [selectedCurrency, otherCurrency, onCurrencySelect, mode, allowBuyBtc, setAllowBuyBtc],
  )

  const itemKey = useCallback((index: number, data: any) => `${currencyKey(data[index])}-${index}`, [])

  return (
    <FixedSizeList
      style={{ overflowX: 'hidden' }}
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
