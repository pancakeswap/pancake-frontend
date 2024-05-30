import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowDropDownIcon, Box, BoxProps, Flex, SkeletonText, Text, useModal } from '@pancakeswap/uikit'
import { NumberDisplay, NumericalInput } from '@pancakeswap/widgets-internal'
import OnRampCurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/OnRampCurrencyModal'
import { fiatCurrencyMap, getNetworkDisplay, onRampCurrencies } from 'views/BuyCrypto/constants'
import { DropDownContainer, OptionSelectButton } from 'views/BuyCrypto/styles'
import { OnRampUnit } from 'views/BuyCrypto/types'
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
      unit={unit}
    />,
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
