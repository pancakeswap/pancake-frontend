import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Pair, Percent, Token } from '@pancakeswap/sdk'
import {
  Box,
  Button,
  ChevronDownIcon,
  domAnimation,
  Flex,
  LazyAnimatePresence,
  Loading,
  Skeleton,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { CurrencyLogo, DoubleCurrencyLogo, Swap as SwapUI } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'

import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { AssetSettingButtonList } from './AssetSettingButtonList'
import { WalletAssetDisplay } from './WalletAssetDisplay'

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
const CurrencyInputPanelSimplify = memo(function CurrencyInputPanel({
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

  const [isInputFocus, setIsInputFocus] = useState(false)

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

  const percentAmount = useMemo(
    () => ({
      25: maxAmount ? maxAmount.multiply(new Percent(25, 100)).toExact() : undefined,
      50: maxAmount ? maxAmount.multiply(new Percent(50, 100)).toExact() : undefined,
      75: maxAmount ? maxAmount.multiply(new Percent(75, 100)).toExact() : undefined,
    }),
    [maxAmount],
  )

  const handleUserInput = useCallback(
    (val: string) => {
      onUserInput(val)
    },
    [onUserInput],
  )
  const handleUserInputBlur = useCallback(() => {
    onInputBlur?.()
    setTimeout(() => setIsInputFocus(false), 300)
  }, [onInputBlur])

  const handleUserInputFocus = useCallback(() => {
    setIsInputFocus(true)
  }, [])

  const onCurrencySelectClick = useCallback(() => {
    if (!disableCurrencySelect) {
      onPresentCurrencyModal()
    }
  }, [onPresentCurrencyModal, disableCurrencySelect])

  const isAtPercentMax = (maxAmount && value === maxAmount.toExact()) || (lpPercent && lpPercent === '100')

  const balance = !hideBalance && !!currency ? formatAmount(selectedCurrencyBalance, 6) : undefined
  return (
    <SwapUI.CurrencyInputPanelSimplify
      id={id}
      disabled={disabled}
      error={error as boolean}
      value={value}
      onInputBlur={handleUserInputBlur}
      onInputFocus={handleUserInputFocus}
      onUserInput={handleUserInput}
      loading={inputLoading}
      top={
        <Flex justifyContent="space-between" alignItems="center" width="100%" position="relative">
          {title}
          <LazyAnimatePresence features={domAnimation}>
            {account ? (
              !isInputFocus || !onMax ? (
                <WalletAssetDisplay balance={balance} onMax={onMax} />
              ) : (
                <AssetSettingButtonList onPercentInput={onPercentInput} />
              )
            ) : null}
          </LazyAnimatePresence>
        </Flex>
      }
      inputLeft={
        <>
          <Flex alignItems="center">
            {beforeButton}
            <CurrencySelectButton
              className="open-currency-select-button"
              data-dd-action-name="Select currency"
              selected={!!currency}
              onClick={onCurrencySelectClick}
            >
              <Flex alignItems="center" justifyContent="space-between">
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                ) : currency ? (
                  id === 'onramp-input' ? (
                    <FiatLogo currency={currency} size="40px" style={{ marginRight: '8px' }} />
                  ) : (
                    <CurrencyLogo currency={currency} size="40px" style={{ marginRight: '8px' }} />
                  )
                ) : currencyLoading ? (
                  <Skeleton width="40px" height="40px" variant="circle" />
                ) : null}
                {currencyLoading ? null : pair ? (
                  <Text id="pair" bold fontSize="24px">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text id="pair" bold fontSize="24px">
                    {(currency && currency.symbol && currency.symbol.length > 10
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t('Select a currency')}
                  </Text>
                )}
                {!currencyLoading && !disableCurrencySelect && <ChevronDownIcon />}
              </Flex>
            </CurrencySelectButton>
          </Flex>
        </>
      }
      bottom={
        <Box position="absolute" bottom="5px" right="0px">
          {!!showUSDPrice && (
            <Flex justifyContent="flex-end" mr="1rem">
              <Flex maxWidth="200px">
                {inputLoading ? (
                  <Loading width="14px" height="14px" />
                ) : showUSDPrice && Number.isFinite(amountInDollar) ? (
                  <Text fontSize="14px" color="textSubtle" ellipsis>
                    {`~${amountInDollar ? formatNumber(amountInDollar) : 0} USD`}
                  </Text>
                ) : null}
              </Flex>
            </Flex>
          )}
        </Box>
      }
    />
  )
})

export default CurrencyInputPanelSimplify
