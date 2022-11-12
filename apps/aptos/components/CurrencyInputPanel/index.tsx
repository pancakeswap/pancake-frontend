import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountBalance, useSendTransaction } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import {
  Button,
  ChevronDownIcon,
  CopyButton,
  SkeletonV2,
  Swap as SwapUI,
  Text,
  useModal,
  ShareIcon,
  WalletRegisterIcon,
  useTooltip,
  Loading,
} from '@pancakeswap/uikit'
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

function RegisterButton({ currency }: { currency: Currency }) {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Register coin to receive transfers'), {
    placement: 'auto',
  })

  const { account } = useAccount()

  // check is coin registered
  const { data, isSuccess } = useAccountBalance({
    address: account?.address,
    coin: currency.address,
    enabled: currency.isToken,
    watch: true,
  })

  const { sendTransactionAsync, isLoading } = useSendTransaction()

  if (isSuccess && data && account) {
    return null
  }

  return (
    <>
      <AtomBox cursor="pointer" ref={targetRef}>
        {!isLoading ? (
          <WalletRegisterIcon
            onClick={() => {
              sendTransactionAsync({
                payload: {
                  type: 'entry_function_payload',
                  type_arguments: [currency.address],
                  arguments: [],
                  function: `0x1::managed_coin::register`,
                },
              })
            }}
            color="primary"
            width="16px"
          />
        ) : (
          <Loading width="12px" height="12px" />
        )}
      </AtomBox>
      {tooltipVisible && tooltip}
    </>
  )
}

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
            <Button variant="text" scale="sm" py={0} px="0.5rem" onClick={onPresentCurrencyModal}>
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
                  tooltipTop={-20}
                  tooltipRight={40}
                  tooltipFontSize={12}
                />
                {shareLink && (
                  <CopyButton
                    icon={ShareIcon}
                    width="16px"
                    buttonColor="textSubtle"
                    text={shareLink}
                    tooltipMessage={t('Sharing link copied')}
                    tooltipTop={-20}
                    tooltipRight={40}
                    tooltipFontSize={12}
                  />
                )}
                {currency && <RegisterButton currency={currency} />}
              </AtomBox>
            ) : null}
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
