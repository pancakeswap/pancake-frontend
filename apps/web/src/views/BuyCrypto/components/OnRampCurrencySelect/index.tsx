import styled from 'styled-components'
import {
  ArrowDropDownIcon,
  Box,
  Button,
  Text,
  useModal,
  Flex,
  BoxProps,
  Skeleton,
  NumericalInput,
  CurrencyLogo,
} from '@pancakeswap/uikit'
import CurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/CurrencySearchModal'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { ReactNode } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useAllOnRampTokens } from 'hooks/Tokens'
import { fiatCurrencyMap } from 'views/BuyCrypto/constants'

const networkDisplay: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.BSC]: 'Binance Chain',
}

const DropDownContainer = styled.div<{ error: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  box-shadow: ${({ theme, error }) => (error ? theme.shadows.danger : theme.shadows.inset)};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.failure : theme.colors.inputSecondary)};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  cursor: pointer;
  position: relative;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
  border-left: ${({ theme }) => `1px solid ${theme.colors.inputSecondary}`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
  padding-left: 16px;
  padding-right: 8px;
  border-radius: 0px;
`

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
  return (
    <Flex pl="8px">
      {id === 'onramp-input' ? (
        <FiatLogo currency={selectedCurrency} size="24px" style={{ marginRight: '8px' }} />
      ) : (
        <CurrencyLogo currency={selectedCurrency} size="24px" style={{ marginRight: '8px' }} />
      )}
      {currencyLoading ? null : (
        <Text id="pair" bold>
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

interface CurrencySelectProps extends CurrencySearchModalProps, BoxProps {
  id: 'onramp-input' | 'onramp-output'
  onUserInput?: (value: string) => void
  value?: string
  disableCurrencySelect?: boolean
  currencyLoading?: boolean
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disabled?: boolean
  loading?: boolean
  topElement?: ReactNode
  bottomElement?: ReactNode
}

export const CurrencySelect = ({
  onCurrencySelect,
  onUserInput,
  onInputBlur,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases,
  commonBasesType,
  id,
  currencyLoading,
  topElement,
  error,
  value,
  bottomElement,
  ...props
}: CurrencySelectProps) => {
  const onRampTokens = useAllOnRampTokens()
  const tokensToShow = id === 'onramp-input' ? fiatCurrencyMap : (onRampTokens as any)

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
      tokensToShow={tokensToShow}
      mode={id}
    />,
  )

  return (
    <Box width="100%" {...props}>
      <Flex justifyContent="space-between" py="4px" width="100%" alignItems="center">
        {topElement}
      </Flex>
      <DropDownContainer error={error}>
        {id === 'onramp-input' ? (
          <NumericalInput
            error={error}
            disabled={!selectedCurrency}
            loading={!selectedCurrency}
            className="token-amount-input"
            value={value}
            onBlur={onInputBlur}
            onUserInput={onUserInput}
            align="left"
          />
        ) : (
          <Text>{networkDisplay[selectedCurrency?.chainId]}</Text>
        )}
        <CurrencySelectButton
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
        </CurrencySelectButton>
      </DropDownContainer>
      <Flex justifyContent="space-between" pt="6px" width="100%" alignItems="center">
        {bottomElement}
      </Flex>
    </Box>
  )
}
