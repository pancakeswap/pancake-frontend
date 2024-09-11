import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowDropDownIcon, Box, BoxProps, Flex, SkeletonText, Text, useModal } from '@pancakeswap/uikit'
import { NumberDisplay, NumericalInput } from '@pancakeswap/widgets-internal'
import OnRampCurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/OnRampCurrencyModal'
import { ClipboardEvent, KeyboardEvent, useCallback, useMemo } from 'react'
import {
  fiatCurrencyMap,
  getNetworkDisplay,
  NON_DECIMAL_FIAT_CURRENCIES,
  onRampCurrenciesMap,
} from 'views/BuyCrypto/constants'
import { DropDownContainer, OptionSelectButton } from 'views/BuyCrypto/styles'
import { FiatCurrency, OnRampUnit } from 'views/BuyCrypto/types'
import { OnRampCurrencyLogo } from '../OnRampProviderLogo/OnRampProviderLogo'

interface BuyCryptoSelectorProps extends Omit<CurrencySearchModalProps, 'mode'>, BoxProps {
  id: 'onramp-fiat' | 'onramp-crypto'
  currencyLoading: boolean
  inputLoading?: boolean
  value: string
  onUserInput?: (value: string) => void
  disableCurrencySelect?: boolean
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disableInput?: boolean
  unit: OnRampUnit
  fiatCurrency: FiatCurrency
}

const ButtonAsset = ({
  id,
  selectedCurrency,
  currencyLoading,
}: {
  id: string
  selectedCurrency: Currency
  currencyLoading: boolean
}) => {
  const { t } = useTranslation()
  const networkDisplay = getNetworkDisplay(selectedCurrency?.chainId)

  return (
    <Flex>
      <OnRampCurrencyLogo mode={id} currency={selectedCurrency as Token} size={30} />
      {currencyLoading ? null : (
        <Flex flexDirection="column" marginLeft="6px" alignItems="flex-start" justifyContent="center">
          <Text id="pair" bold lineHeight="16px">
            {(selectedCurrency?.symbol && selectedCurrency.symbol.length > 10
              ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                  selectedCurrency.symbol.length - 5,
                  selectedCurrency.symbol.length,
                )}`
              : selectedCurrency?.symbol) || t('Select a currency')}
          </Text>
          {id === 'onramp-crypto' && (
            <Text id="pair" color="textSubtle" fontSize="12px" fontWeight={500} lineHeight="12px" ellipsis>
              {t('on %network%', { network: networkDisplay })}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  )
}

export const BuyCryptoSelector = ({
  onCurrencySelect,
  onUserInput,
  onInputBlur,
  selectedCurrency,
  otherSelectedCurrency,
  id,
  currencyLoading,
  inputLoading = false,
  error,
  value,
  disableInput = false,
  unit,
  fiatCurrency,
  ...props
}: BuyCryptoSelectorProps) => {
  const tokensToShow = useMemo(() => {
    return id === 'onramp-fiat' ? Object.values(fiatCurrencyMap) : Object.values(onRampCurrenciesMap)
  }, [id])

  const [onPresentCurrencyModal] = useModal(
    <OnRampCurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      tokensToShow={tokensToShow}
      mode={id}
      unit={unit}
    />,
  )
  const blockDecimal = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const blockDecimalInput = NON_DECIMAL_FIAT_CURRENCIES.includes(fiatCurrency?.symbol)
      if ((e.key === '.' || e.key === ',') && blockDecimalInput) e.preventDefault()
    },
    [fiatCurrency],
  )
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const pastedValue = e.clipboardData.getData('text')
      const blockDecimalInput = NON_DECIMAL_FIAT_CURRENCIES.includes(fiatCurrency?.symbol)

      if (blockDecimalInput && (pastedValue.includes('.') || pastedValue.includes(','))) {
        e.preventDefault()
        onUserInput?.(Number(pastedValue).toFixed(0))
      }
    },
    [fiatCurrency, onUserInput],
  )

  return (
    <Box width="100%" {...props} position="relative">
      <DropDownContainer error={Boolean(error)}>
        {!disableInput ? (
          <NumericalInput
            error={error}
            align="left"
            loading={!selectedCurrency}
            className="token-amount-input"
            value={inputLoading ? '' : value}
            onBlur={onInputBlur}
            onKeyDown={blockDecimal}
            onPaste={handlePaste}
            onUserInput={(val) => {
              onUserInput?.(val)
            }}
          />
        ) : (
          <SkeletonText initialHeight={25} initialWidth={100} loading={inputLoading}>
            <NumberDisplay value={value} />
          </SkeletonText>
        )}

        <OptionSelectButton
          className="open-currency-select-button"
          selected={!!selectedCurrency}
          onClick={onPresentCurrencyModal}
        >
          <ButtonAsset id={id} selectedCurrency={selectedCurrency as Currency} currencyLoading={currencyLoading} />
          <ArrowDropDownIcon color="primary" />
        </OptionSelectButton>
      </DropDownContainer>
    </Box>
  )
}
