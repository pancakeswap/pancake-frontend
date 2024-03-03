import { ChainNamesExtended } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import {
  ArrowForwardIcon,
  Box,
  Column,
  Flex,
  QuestionHelper,
  Text,
  Toggle,
  TokenImageWithBadge,
} from '@pancakeswap/uikit'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { getImageUrlFromToken } from 'components/TokenImage'
import Image from 'next/image'
import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { useAllowBtcPurchases } from 'state/buyCrypto/hooks'
import { styled } from 'styled-components'
import { NATIVE_BTC, fiatCurrencyMap } from 'views/BuyCrypto/constants'
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

export const EvmLogo = ({ mode, currency, size = 24 }: { mode: string; currency: Token; size?: number }) => {
  return (
    <>
      {mode === 'onramp-fiat' ? (
        <FiatLogo currency={currency} size={`${size - 3}px`} />
      ) : (
        <Box width={`${size}px`} height={`${size}px`}>
          <TokenImageWithBadge
            width={size}
            height={size}
            primarySrc={getImageUrlFromToken(currency)}
            chainId={currency.chainId}
          />
        </Box>
      )}
    </>
  )
}
export const BtcLogo = () => <Image src="/images/btc.svg" alt="bitcoin-logo" width={24} height={24} />
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
  const [allowBuyBtc, setAllowBuyBtc] = useAllowBtcPurchases()
  const { t } = useTranslation()
  const key = currencyKey(currency)
  const isBtcNative = currency.chainId === NATIVE_BTC.chainId
  const btcNetworkDisplayName = t('Bitcoin Network')
  const isFiat = Boolean(mode === 'onramp-fiat')
  return (
    <>
      <Flex justifyContent="flex-end" width="100%" marginTop="15px" paddingRight="20px">
        {isBtcNative && (
          <>
            <QuestionHelper
              text={t(
                'Enable Native BTC purchases. Only do this is you have a Bitcoin address to receive the funds to. you cannot use your EVM addresses for native BTC.',
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
          </>
        )}
      </Flex>

      <MenuItem
        style={style}
        className={`token-item-${key}`}
        onClick={() => (isSelected ? null : onSelect())}
        disabled={!allowBuyBtc && isBtcNative ? true : isSelected}
        selected={otherSelected}
        // zIndex={-}
      >
        {isBtcNative ? <BtcLogo /> : <EvmLogo mode={mode} currency={currency as Token} size={28} />}
        <Column>
          <Text bold>{currency?.symbol}</Text>
          <Text color="textSubtle" small ellipsis maxWidth="200px">
            {isFiat ? currency.name : isBtcNative ? btcNetworkDisplayName : ChainNamesExtended[currency.chainId]}
          </Text>
        </Column>

        <RowFixed style={{ justifySelf: 'flex-end' }}>{!isBtcNative && <ArrowForwardIcon />}</RowFixed>
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
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  mode: string
}) {
  const itemData = useMemo(() => [...currencies], [currencies])
  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isFiat = Boolean(Object.keys(fiatCurrencyMap).includes(currency?.symbol))

      // the alternative to making a fiat currency token list
      // with class methods
      let isSelected = false
      let otherSelected = false
      if ((selectedCurrency?.chainId as any) === 'bitcoin' || (otherCurrency?.chainId as any) === 'bitcoin') {
        isSelected = Boolean(selectedCurrency && currency && selectedCurrency.chainId === currency.chainId)
        otherSelected = Boolean(otherCurrency && currency && otherCurrency.chainId === currency.chainId)
      } else if (!isFiat && mode !== 'onramp-output') {
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

  const finalList = mode === 'onramp-crypto' ? [NATIVE_BTC, ...itemData] : itemData
  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={finalList}
      itemCount={finalList.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
