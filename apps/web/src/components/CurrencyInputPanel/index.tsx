import { useMemo, memo, useCallback } from 'react'
import { Currency, Pair, Token, Percent, CurrencyAmount } from '@pancakeswap/sdk'
import { zksyncTokens } from '@pancakeswap/tokens'
import {
  Button,
  Text,
  useModal,
  Flex,
  Box,
  CopyButton,
  Loading,
  Skeleton,
  ArrowDropDownIcon,
  LinkExternal,
} from '@pancakeswap/uikit'
import { Swap as SwapUI, CurrencyLogo, DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { formatAmount } from '@pancakeswap/utils/formatFractions'

import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { useAccount } from 'wagmi'
import { useCurrencyBalance } from 'state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'

import AddToWalletButton from '../AddToWallet/AddToWalletButton'

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
  showQuickInputButton?: boolean
  showMaxButton: boolean
  maxAmount?: CurrencyAmount<Currency>
  lpPercent?: string
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | StablePair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean | string
  showUSDPrice?: boolean
  tokensToShow?: Token[]
  currencyLoading?: boolean
  inputLoading?: boolean
  title?: React.ReactNode
  hideBalanceComp?: boolean
}
const CurrencyInputPanel = memo(function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onPercentInput,
  onMax,
  showQuickInputButton = false,
  showMaxButton,
  maxAmount,
  lpPercent,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  showSearchInput,
  disabled,
  error,
  showUSDPrice,
  tokensToShow,
  currencyLoading,
  inputLoading,
  title,
  hideBalanceComp,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  const mode = id
  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  const tokenAddress = token ? safeGetAddress(token.address) : null

  const amountInDollar = useStablecoinPriceAmount(
    showUSDPrice ? currency ?? undefined : undefined,
    value !== undefined && Number.isFinite(+value) ? +value : undefined,
    {
      hideIfPriceImpactTooHigh: true,
      enabled: Boolean(value !== undefined && Number.isFinite(+value)),
    },
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
      showSearchInput={showSearchInput}
      tokensToShow={tokensToShow}
      mode={mode}
    />,
  )

  const handleUserInput = useCallback(
    (val: string) => {
      onUserInput(val)
    },
    [onUserInput],
  )

  const onCurrencySelectClick = useCallback(() => {
    if (!disableCurrencySelect) {
      onPresentCurrencyModal()
    }
  }, [onPresentCurrencyModal, disableCurrencySelect])

  const isAtPercentMax = (maxAmount && value === maxAmount.toExact()) || (lpPercent && lpPercent === '100')

  const balance = !hideBalance && !!currency ? formatAmount(selectedCurrencyBalance, 6) : undefined
  return (
    <SwapUI.CurrencyInputPanel
      id={id}
      disabled={disabled}
      error={error as boolean}
      value={value}
      onInputBlur={onInputBlur}
      onUserInput={handleUserInput}
      loading={inputLoading}
      selector={
        <>
          <button type="button" className="bg-black rounded-full px-2 py-1" onClick={onCurrencySelectClick}>
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                id === 'onramp-input' ? (
                  <FiatLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                ) : (
                  <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                )
              ) : currencyLoading ? (
                <Skeleton width="24px" height="24px" variant="circle" />
              ) : null}
              {currencyLoading ? null : pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" bold>
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
          </button>
        </>
      }
      top={
        <>
          {title}
          <Flex alignItems="center">{beforeButton}</Flex>
        </>
      }
      bottom={
        <div className="mt-2">
          <div className="flex items-center">
            {!!showUSDPrice && (
              <div>
                <Flex maxWidth="200px">
                  {inputLoading ? (
                    <Loading width="14px" height="14px" />
                  ) : showUSDPrice && Number.isFinite(amountInDollar) ? (
                    <Text fontSize="12px" color="textSubtle" ellipsis>
                      {`~${amountInDollar ? formatNumber(amountInDollar) : 0} USD`}
                    </Text>
                  ) : (
                    <Box height="18px" />
                  )}
                </Flex>
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              {account && !hideBalanceComp && (
                <Text
                  data-dd-action-name="Token balance"
                  onClick={!disabled ? onMax : undefined}
                  color="textSubtle"
                  fontSize="12px"
                  ellipsis
                  title={
                    !hideBalance && !!currency ? t('Balance: %balance%', { balance: balance ?? t('Loading') }) : ' -'
                  }
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency
                    ? (balance?.replace('.', '')?.length || 0) > 12
                      ? balance
                      : t('Balance: %balance%', { balance: balance ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
              {account && currency && selectedCurrencyBalance?.greaterThan(0) && !disabled && label !== 'To' && (
                <>
                  {maxAmount?.greaterThan(0) && showMaxButton && (
                    <button
                      type="button"
                      className="text-primary hover:opacity-80 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onMax?.()
                      }}
                    >
                      {t('Max')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
})

export default CurrencyInputPanel
