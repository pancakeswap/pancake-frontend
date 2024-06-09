import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { ArrowDropDownIcon, Button, Flex, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { CurrencyLogo, Swap as SwapUI } from '@pancakeswap/widgets-internal'
import { BigNumber } from 'bignumber.js'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { TokenWithChain } from 'components/TokenWithChain'
import useTokenBalance from 'hooks/useTokenBalance'
import { memo, useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
`

interface CurrencyInputPanelProps {
  value: string | undefined
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onPercentInput?: (percent: number) => void
  onMax?: () => void
  onCurrencySelect?: (currency: Currency) => void
  onPressCustomModal?: () => void
  showQuickInputButton?: boolean
  showMaxButton: boolean
  maxAmount?: BigNumber
  lpPercent?: string
  label?: string
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  id: string
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean | string
  currencyLoading?: boolean
  inputLoading?: boolean
  title?: React.ReactNode
  hideBalanceComp?: boolean
  showLogoWithChain?: boolean
}

export const CurrencyInputPanel = memo(function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onPercentInput,
  onMax,
  onCurrencySelect,
  onPressCustomModal,
  showQuickInputButton = false,
  showMaxButton,
  maxAmount,
  lpPercent,
  label,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  beforeButton,
  id,
  disabled,
  error,
  currencyLoading,
  inputLoading,
  title,
  hideBalanceComp,
  showLogoWithChain,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()
  const { balance: selectedCurrencyBalance } = useTokenBalance(currency.address ?? undefined)

  const { t } = useTranslation()

  const [onPresentCurrencyModal] = useModal(
    currency && onCurrencySelect && (
      <CurrencySearchModal selectedCurrency={currency} onCurrencySelect={onCurrencySelect} />
    ),
  )

  const percentAmount: any = useMemo(
    () => ({
      25: maxAmount ? maxAmount.multipliedBy(new BigNumber(25).div(100)).toString() : undefined,
      50: maxAmount ? maxAmount.multipliedBy(new BigNumber(50).div(100)).toString() : undefined,
      75: maxAmount ? maxAmount.multipliedBy(new BigNumber(75).div(100)).toString() : undefined,
    }),
    [maxAmount],
  )

  const handleUserInput = useCallback(
    (val: string) => {
      onUserInput(val)
    },
    [onUserInput],
  )

  const onCurrencySelectClick = useCallback(() => {
    if (!disableCurrencySelect) {
      if (onPressCustomModal) {
        onPressCustomModal()
      } else {
        onPresentCurrencyModal()
      }
    }
  }, [disableCurrencySelect, onPressCustomModal, onPresentCurrencyModal])

  const isAtPercentMax = (maxAmount && value === maxAmount.toString()) || (lpPercent && lpPercent === '100')

  const balance =
    !hideBalance && !!currency ? getFullDisplayBalance(selectedCurrencyBalance, currency.decimals, 6) : undefined

  return (
    <SwapUI.CurrencyInputPanel
      id={id}
      disabled={disabled}
      error={error as boolean}
      value={value}
      onInputBlur={onInputBlur}
      onUserInput={handleUserInput}
      loading={inputLoading}
      top={
        <>
          {title}
          <Flex alignItems="center">
            {beforeButton}
            <CurrencySelectButton
              className="open-currency-select-button"
              data-dd-action-name="Select currency"
              selected={!!currency}
              onClick={onCurrencySelectClick}
            >
              <Flex alignItems="center" justifyContent="space-between">
                {currency ? (
                  showLogoWithChain ? (
                    <TokenWithChain currency={currency} width={24} height={24} />
                  ) : (
                    <CurrencyLogo currency={currency} size="24px" />
                  )
                ) : currencyLoading ? (
                  <Skeleton width="24px" height="24px" variant="circle" />
                ) : null}
                {currencyLoading ? null : (
                  <Text ml="8px" id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 10
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t('Select a currency')}
                  </Text>
                )}
                {!currencyLoading && !disableCurrencySelect && <ArrowDropDownIcon />}
              </Flex>
            </CurrencySelectButton>
          </Flex>

          {account && !hideBalanceComp && (
            <Text
              data-dd-action-name="Token balance"
              onClick={!disabled ? onMax : undefined}
              color="textSubtle"
              fontSize="12px"
              ellipsis
              title={!hideBalance && !!currency ? t('Balance: %balance%', { balance: balance ?? t('Loading') }) : ' -'}
              style={{ display: 'inline', cursor: 'pointer' }}
            >
              {!hideBalance && !!currency
                ? (balance?.replace('.', '')?.length || 0) > 12
                  ? balance
                  : t('Balance: %balance%', { balance: balance ?? t('Loading') })
                : ' -'}
            </Text>
          )}
        </>
      }
      bottom={
        <>
          <InputRow selected={disableCurrencySelect}>
            {account && currency && selectedCurrencyBalance?.gt(0) && !disabled && label !== 'To' && (
              <Flex alignItems="right" justifyContent="right">
                {maxAmount?.gt(0) &&
                  showQuickInputButton &&
                  onPercentInput &&
                  [25, 50, 75].map((percent) => {
                    const isAtCurrentPercent =
                      (maxAmount && value !== '0' && value === percentAmount[percent]) ||
                      (lpPercent && lpPercent === percent.toString())

                    return (
                      <Button
                        key={`btn_quickCurrency${percent}`}
                        data-dd-action-name={`Balance percent ${percent}`}
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
                {maxAmount?.gt(0) && showMaxButton && (
                  <Button
                    data-dd-action-name="Balance percent max"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onMax?.()
                    }}
                    scale="xs"
                    variant={isAtPercentMax ? 'primary' : 'secondary'}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {t('Max')}
                  </Button>
                )}
              </Flex>
            )}
          </InputRow>
        </>
      }
    />
  )
})
