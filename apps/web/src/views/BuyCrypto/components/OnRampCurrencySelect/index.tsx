import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowDropDownIcon, Box, BoxProps, Flex, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { NumericalInput } from '@pancakeswap/widgets-internal'
import OnRampCurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/OnRampCurrencyModal'
import { ReactNode } from 'react'
import { NATIVE_BTC, fiatCurrencyMap, getNetworkDisplay, onRampCurrencies } from 'views/BuyCrypto/constants'
import { DropDownContainer, OptionSelectButton } from 'views/BuyCrypto/styles'
import { BtcLogo, EvmLogo } from '../OnRampProviderLogo/OnRampProviderLogo'

interface BuyCryptoSelectorProps extends Omit<CurrencySearchModalProps, 'mode'>, BoxProps {
  id: 'onramp-fiat' | 'onramp-crypto'
  value: string
  onUserInput?: (value: string) => void
  disableCurrencySelect?: boolean
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disabled?: boolean
  loading?: boolean
  topElement?: ReactNode
  bottomElement?: ReactNode
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
  const isBtcNative = selectedCurrency.chainId === NATIVE_BTC.chainId
  return (
    <Flex>
      {isBtcNative ? <BtcLogo /> : <EvmLogo mode={id} currency={selectedCurrency as Token} size={26} />}
      {currencyLoading ? null : (
        <Text id="pair" bold marginLeft="8px">
          {(selectedCurrency && selectedCurrency.symbol && selectedCurrency.symbol.length > 10
            ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                selectedCurrency.symbol.length - 5,
                selectedCurrency.symbol.length,
              )}`
            : selectedCurrency?.symbol) || t('Select a currency')}
        </Text>
      )}
    </Flex>
  )
}

interface BuyCryptoSelectorProps extends Omit<CurrencySearchModalProps, 'mode'>, BoxProps {
  id: 'onramp-fiat' | 'onramp-crypto'
  currencyLoading: boolean
  value: string
  onUserInput?: (value: string) => void
  disableCurrencySelect?: boolean
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disabled?: boolean
  loading?: boolean
  topElement?: ReactNode
  bottomElement?: ReactNode
}

export const BuyCryptoSelector = ({
  onCurrencySelect,
  onUserInput,
  onInputBlur,
  selectedCurrency,
  otherSelectedCurrency,
  id,
  currencyLoading,
  topElement,
  error,
  value,
  bottomElement,
  ...props
}: BuyCryptoSelectorProps) => {
  const { t } = useTranslation()
  const tokensToShow = id === 'onramp-fiat' ? Object.values(fiatCurrencyMap) : onRampCurrencies
  const isBtcNative = selectedCurrency && selectedCurrency.chainId === NATIVE_BTC.chainId
  const btcNetworkDisplayName = t('Bitcoin Network')

  const networkDisplay = isBtcNative ? btcNetworkDisplayName : getNetworkDisplay(selectedCurrency?.chainId)

  const [onPresentCurrencyModal] = useModal(
    <OnRampCurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      tokensToShow={tokensToShow}
      mode={id}
    />,
  )

  return (
    <Box width="100%" {...props}>
      <Flex justifyContent="space-between" py="4px" width="100%" alignItems="center">
        {topElement}
      </Flex>
      <DropDownContainer error={error as any}>
        {id === 'onramp-fiat' ? (
          <NumericalInput
            error={error}
            disabled={!selectedCurrency}
            loading={!selectedCurrency}
            className="token-amount-input"
            value={value}
            onBlur={onInputBlur}
            onUserInput={(val) => {
              onUserInput?.(val)
            }}
            align="left"
          />
        ) : (
          <Text>{networkDisplay}</Text>
        )}
        <OptionSelectButton
          className="open-currency-select-button"
          selected={!!selectedCurrency}
          onClick={onPresentCurrencyModal}
        >
          {selectedCurrency ? (
            <ButtonAsset id={id} selectedCurrency={selectedCurrency} currencyLoading={currencyLoading} />
          ) : (
            <Flex>
              <Skeleton width="105px" height="26px" variant="round" isDark />
            </Flex>
          )}
          {selectedCurrency && <ArrowDropDownIcon />}
        </OptionSelectButton>
      </DropDownContainer>
      <Flex justifyContent="space-between" pt="6px" width="100%" alignItems="center">
        {bottomElement}
      </Flex>
    </Box>
  )
}
