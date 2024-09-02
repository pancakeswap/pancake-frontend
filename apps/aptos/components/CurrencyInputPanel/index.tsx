import { useMemo } from 'react'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useBalance } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { useCurrencyBalance } from 'hooks/Balances'
import useStablePrice from 'hooks/useStablePrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, Button, ChevronDownIcon, CopyButton, Text, useModal } from '@pancakeswap/uikit'
import { Swap as SwapUI } from '@pancakeswap/widgets-internal'

import { CoinRegisterButton } from 'components/CoinRegisterButton'
import { CurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { styled } from 'styled-components'
import { BridgeButton } from 'components/Swap/BridgeButton'
import useBridgeInfo from 'components/Swap/hooks/useBridgeInfo'

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
  onPercentInput?: (percent: number) => void
  showQuickInputButton?: boolean
  onMax?: () => void
  showMaxButton: boolean
  maxAmount?: CurrencyAmount<Currency>
  lpPercent?: string
  label?: string
  disabled?: boolean
  showBridgeWarning?: boolean
  showUSDPrice?: boolean
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
  onPercentInput,
  showQuickInputButton = false,
  onMax,
  showMaxButton,
  maxAmount,
  lpPercent,
  disabled,
  showBridgeWarning,
  showUSDPrice,
}: Props) => {
  const { account } = useAccount()
  const { bridgeResult } = useBridgeInfo({ currency })
  const currencyBalance = useCurrencyBalance(currency?.wrapped?.address)

  const isMounted = useIsMounted()
  const { t } = useTranslation()

  const { data, isLoading } = useBalance({
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
      showCommonBases
    />,
  )

  const percentAmount = useMemo(
    () => ({
      25: maxAmount ? maxAmount.multiply(new Percent(25, 100)).toExact() : undefined,
      50: maxAmount ? maxAmount.multiply(new Percent(50, 100)).toExact() : undefined,
      75: maxAmount ? maxAmount.multiply(new Percent(75, 100)).toExact() : undefined,
    }),
    [maxAmount],
  )

  const isAtPercentMax = (maxAmount && value === maxAmount.toExact()) || (lpPercent && lpPercent === '100')
  const isShowPercentButton =
    isMounted && account && currency && currencyBalance?.greaterThan(0) && !disabled && label !== 'To'

  const tokenPrice = useStablePrice(currency)
  const amountInDollar = tokenPrice ? multiplyPriceByAmount(tokenPrice, +value, currency?.decimals) : 0

  return (
    <SwapUI.CurrencyInputPanel
      id={id}
      value={value}
      onUserInput={onUserInput}
      onInputBlur={onInputBlur}
      showBridgeWarning={showBridgeWarning}
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
              {isMounted && <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />}
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
                {currency && currency.isToken && account && !isLoading && !data && (
                  <CoinRegisterButton currency={currency} />
                )}
                {bridgeResult && <BridgeButton url={bridgeResult.url} />}
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
        <>
          <AtomBox display="flex" justifyContent="flex-end" mr="1rem" style={{ height: '18px' }}>
            {!!currency && showUSDPrice && (
              <AtomBox style={{ maxWidth: '200px' }}>
                {Number.isFinite(amountInDollar) && amountInDollar > 0 ? (
                  <Text fontSize="12px" color="textSubtle">
                    ~{amountInDollar.toFixed(2)} USD
                  </Text>
                ) : (
                  <AtomBox style={{ height: '18px' }} />
                )}
              </AtomBox>
            )}
          </AtomBox>
          <InputRow selected={!!disableCurrencySelect}>
            {account && currency && currencyBalance?.greaterThan(0) && !disabled && label !== 'To' && (
              <>
                {isShowPercentButton &&
                  showQuickInputButton &&
                  onPercentInput &&
                  [25, 50, 75].map((percent) => {
                    const isAtCurrentPercent =
                      (maxAmount && value !== '0' && value === percentAmount[percent]) ||
                      (lpPercent && lpPercent === percent.toString())
                    return (
                      <Button
                        key={`btn_quickCurrency${percent}`}
                        onClick={() => {
                          onPercentInput(percent)
                        }}
                        scale="xs"
                        mr="5px"
                        variant={isAtCurrentPercent ? 'primary' : 'secondary'}
                        style={{ textTransform: 'uppercase' }}
                      >
                        {percent}%
                      </Button>
                    )
                  })}
                {isShowPercentButton && showMaxButton && (
                  <Button
                    onClick={onMax}
                    scale="xs"
                    variant={isAtPercentMax ? 'primary' : 'secondary'}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {t('Max')}
                  </Button>
                )}
              </>
            )}
          </InputRow>
        </>
      }
    />
  )
}
