import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountBalance } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { Button, ChevronDownIcon, SkeletonV2, Swap as SwapUI, Text, useModal } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import styled from 'styled-components'

type Props = {
  id: string
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  currency?: Currency
  otherCurrency?: Currency
  onCurrencySelect: (currency: Currency) => void
  hideBalance?: boolean
  disableCurrencySelect?: boolean
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  disabled?: boolean
}

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

export const CurrencyInputPanel = ({
  id,
  value,
  onUserInput,
  onInputBlur,
  currency,
  onCurrencySelect,
  otherCurrency,
  hideBalance,
  disableCurrencySelect,
  label,
  onMax,
  showMaxButton,
  disabled,
}: Props) => {
  const { account } = useAccount()

  const isMounted = useIsMounted()
  const { t } = useTranslation()

  const { data, isLoading } = useAccountBalance({
    address: account?.address,
    coin: currency?.wrapped?.address,
    enabled: !!currency,
    watch: true,
  })

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
    />,
  )

  return (
    <SwapUI.CurrencyInputPanel
      id={id}
      value={value}
      onUserInput={onUserInput}
      onInputBlur={onInputBlur}
      top={
        <>
          <AtomBox display="flex">
            <Button variant="text" scale="sm" py={0} px="0.5rem" onClick={onPresentCurrencyModal}>
              <SkeletonV2 isDataReady={isMounted} width="24px" height="24px" variant="circle" mr="8px">
                <CurrencyLogo currency={currency} size="24px" />
              </SkeletonV2>
              <Text>{currency?.symbol}</Text>
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Button>
          </AtomBox>
          {account && currency && isMounted && (
            <Text
              onClick={!disabled ? onMax : undefined}
              color="textSubtle"
              fontSize="14px"
              style={{ display: 'inline', cursor: 'pointer' }}
            >
              {!hideBalance && !!currency
                ? t('Balance: %balance%', { balance: !isLoading ? data?.formatted ?? '0' : t('Loading') })
                : ' -'}
            </Text>
          )}
        </>
      }
      bottom={
        <InputRow selected={!!disableCurrencySelect}>
          {isMounted && account && currency && !disabled && showMaxButton && label !== 'To' && (
            <Button onClick={onMax} scale="xs" variant="secondary" style={{ textTransform: 'uppercase' }}>
              {t('Max')}
            </Button>
          )}
        </InputRow>
      }
    />
  )
}
