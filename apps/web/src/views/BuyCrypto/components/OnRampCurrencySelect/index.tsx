import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowDropDownIcon, Box, BoxProps, Flex, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { NumericalInput } from '@pancakeswap/widgets-internal'
import OnRampCurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/OnRampCurrencyModal'
import { ReactNode } from 'react'
import { fiatCurrencyMap, getNetworkDisplay, onRampCurrencies } from 'views/BuyCrypto/constants'
import { DropDownContainer, OptionSelectButton, StyledCircle } from 'views/BuyCrypto/styles'
import { OnRampCurrencyLogo } from '../OnRampProviderLogo/OnRampProviderLogo'

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

interface BuyCryptoSelectorProps extends Omit<CurrencySearchModalProps, 'mode'>, BoxProps {
  id: 'onramp-fiat' | 'onramp-crypto'
  currencyLoading: boolean
  value: string
  onUserInput?: (value: string) => void
  disableCurrencySelect?: boolean
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disableInput?: boolean
}

export const BuyCryptoSelector = ({
  onCurrencySelect,
  onUserInput,
  onInputBlur,
  selectedCurrency,
  otherSelectedCurrency,
  id,
  currencyLoading,
  error,
  value,
  disableInput = false,
  ...props
}: BuyCryptoSelectorProps) => {
  const tokensToShow = id === 'onramp-fiat' ? Object.values(fiatCurrencyMap) : onRampCurrencies
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
      <DropDownContainer error={error as any}>
        {!disableInput && <StyledCircle />}
        <NumericalInput
          error={error}
          disabled={disableInput || !selectedCurrency}
          loading={!selectedCurrency}
          className="token-amount-input"
          value={value}
          onBlur={onInputBlur}
          onUserInput={(val) => {
            onUserInput?.(val)
          }}
          align="left"
        />
        <OptionSelectButton
          className="open-currency-select-button"
          selected={!!selectedCurrency}
          onClick={onPresentCurrencyModal}
        >
          {selectedCurrency ? (
            <ButtonAsset id={id} selectedCurrency={selectedCurrency as Currency} currencyLoading={currencyLoading} />
          ) : (
            <Flex>
              <Skeleton width="105px" height="26px" variant="round" isDark />
            </Flex>
          )}
          {selectedCurrency && <ArrowDropDownIcon color="primary" />}
        </OptionSelectButton>
      </DropDownContainer>
    </Box>
  )
}
