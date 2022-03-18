import { Currency, Pair, Token } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, MetamaskIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { registerToken } from 'utils/wallet'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0.5rem;
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`
const Container = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { account, library } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )
  return (
    <Box position="relative" id={id}>
      <Flex mb="6px" alignItems="center" justifyContent="space-between">
        <Flex>
          <CurrencySelectButton
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
          {token && tokenAddress ? (
            <Flex style={{ gap: '4px' }} alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="textSubtle"
                text={tokenAddress}
                tooltipMessage={t('Token address copied')}
                tooltipTop={-20}
                tooltipRight={40}
                tooltipFontSize={12}
              />
              {library?.provider?.isMetaMask && (
                <MetamaskIcon
                  style={{ cursor: 'pointer' }}
                  width="16px"
                  onClick={() => registerToken(tokenAddress, token.symbol, token.decimals)}
                />
              )}
            </Flex>
          ) : null}
        </Flex>
        {account && (
          <Text onClick={onMax} color="textSubtle" fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
        )}
      </Flex>
      <InputPanel>
        <Container as="label">
          <LabelRow>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
          </LabelRow>
          <InputRow selected={disableCurrencySelect}>
            {account && currency && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} scale="xs" variant="secondary">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    </Box>
  )
}
