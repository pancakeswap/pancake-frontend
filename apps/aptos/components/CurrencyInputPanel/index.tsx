import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountBalance } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import {
  Button,
  ChevronDownIcon,
  CopyButton,
  ShareIcon,
  SkeletonV2,
  Swap as SwapUI,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { CoinRegisterButton } from 'components/CoinRegisterButton'
import { CurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import styled from 'styled-components'

type Props = {
  id: string
  value: string
  shareLink?: string
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
  shareLink,
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
          <AtomBox display="flex" flexWrap="wrap">
            <Button
              variant="text"
              scale="sm"
              py={0}
              px="0.5rem"
              onClick={onPresentCurrencyModal}
              title={currency?.name}
            >
              <SkeletonV2 isDataReady={isMounted} width="24px" height="24px" variant="circle" mr="8px">
                <CurrencyLogo currency={currency} size="24px" />
              </SkeletonV2>
              <Text>{currency?.symbol}</Text>
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Button>
            {currency && currency.address ? (
              <AtomBox display="flex" gap="4px" ml="4px" alignItems="center">
                <CopyButton
                  width="16px"
                  buttonColor="textSubtle"
                  text={currency.address}
                  tooltipMessage={t('Token address copied')}
                />
                {shareLink && (
                  <CopyButton
                    icon={ShareIcon}
                    width="16px"
                    buttonColor="textSubtle"
                    text={shareLink}
                    tooltipMessage={t('Sharing link copied')}
                  />
                )}
                {currency && currency.isToken && account && !isLoading && !data && (
                  <CoinRegisterButton currency={currency} />
                )}
              </AtomBox>
            ) : null}
          </AtomBox>
          {account && currency && isMounted && (
            <Text
              onClick={!disabled ? onMax : undefined}
              color="textSubtle"
              fontSize="12px"
              textAlign="right"
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
