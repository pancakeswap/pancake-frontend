import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'
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
import { CurrencyLogo, DoubleCurrencyLogo, SwapUIV2 } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'

import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { RiskInputPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
`
const SymbolText = styled(Text)`
  font-size: 24px;
`

const SIZE_ADAPTION_BOUNDARY_MIN_PX_ = 96
const SIZE_ADAPTION_BOUNDARY_MAX_PX = 116
const MAX_FONT_SIZE = 24
const MIN_FONT_SIZE = 16
const MAX_LOGO_SIZE = 40
const MIN_LOGO_SIZE = 24

const handleFontSizeChange = (fontSize: string, operation: number) => {
  const currentFontSize = parseInt(fontSize.replace('px', ''), 10)
  if ((currentFontSize > MIN_FONT_SIZE && operation < 0) || (currentFontSize < MAX_FONT_SIZE && operation > 0))
    return `${currentFontSize + operation}px`
  return fontSize
}

const useSizeAdaption = (value: string, currencySymbol?: string) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const tokenImageRef = useRef<HTMLImageElement>(null)
  const symbolRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const shortedSymbol = useMemo(() => {
    if (currencySymbol && currencySymbol.length > 10) {
      return `${currencySymbol.slice(0, 4)}...${currencySymbol.slice(currencySymbol.length - 5, currencySymbol.length)}`
    }
    return currencySymbol
  }, [currencySymbol])
  useEffect(() => {
    if (!inputRef.current || !symbolRef.current || !wrapperRef.current || !tokenImageRef.current) return
    const inputElement = inputRef.current
    const symbolElement = symbolRef.current
    const logoElement = tokenImageRef.current
    const wrapperWidth = wrapperRef.current.offsetWidth
    const symbolWidth = symbolElement.offsetWidth
    const inputWidth = inputElement.scrollWidth
    const logoWidth = logoElement.offsetWidth

    if (wrapperWidth - symbolWidth - inputWidth < SIZE_ADAPTION_BOUNDARY_MIN_PX_) {
      inputElement.style.fontSize = handleFontSizeChange(inputElement.style.fontSize, -2)
      symbolElement.style.fontSize = handleFontSizeChange(symbolElement.style.fontSize, -2)
      const size = `${Math.max(logoWidth - 2, MIN_LOGO_SIZE)}px`
      logoElement.style.width = size
      logoElement.style.height = size
    } else if (wrapperWidth - symbolWidth - inputWidth > SIZE_ADAPTION_BOUNDARY_MAX_PX) {
      inputElement.style.fontSize = handleFontSizeChange(inputElement.style.fontSize, 2)
      symbolElement.style.fontSize = handleFontSizeChange(symbolElement.style.fontSize, 2)
      const size = `${Math.min(logoWidth + 2, MAX_LOGO_SIZE)}px`
      logoElement.style.width = size
      logoElement.style.height = size
    }
    if (value === '') {
      inputElement.style.fontSize = '24px'
      symbolElement.style.fontSize = '24px'
      logoElement.style.width = '40px'
      logoElement.style.width = '40px'
    }
  }, [value, currencySymbol])

  return { shortedSymbol, inputRef, symbolRef, wrapperRef, tokenImageRef }
}

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

  const { shortedSymbol, inputRef, wrapperRef, tokenImageRef, symbolRef } = useSizeAdaption(
    value ?? '',
    currency?.symbol,
  )

  const handleUserInput = useCallback(
    (val: string) => {
      onUserInput(val)
    },
    [onUserInput],
  )
  const handleUserInputBlur = useCallback(() => {
    onInputBlur?.()
    setTimeout(() => setIsInputFocus(false), 100)
  }, [onInputBlur])

  const handleUserInputFocus = useCallback(() => {
    setIsInputFocus(true)
  }, [])

  const onCurrencySelectClick = useCallback(() => {
    if (!disableCurrencySelect) {
      onPresentCurrencyModal()
    }
  }, [onPresentCurrencyModal, disableCurrencySelect])

  const balance = !hideBalance && !!currency ? formatAmount(selectedCurrencyBalance, 6) : undefined
  return (
    <SwapUIV2.CurrencyInputPanelSimplify
      id={id}
      disabled={disabled}
      error={error as boolean}
      value={value}
      onInputBlur={handleUserInputBlur}
      onInputFocus={handleUserInputFocus}
      onUserInput={handleUserInput}
      loading={inputLoading}
      inputRef={inputRef}
      wrapperRef={wrapperRef}
      top={
        <Flex justifyContent="space-between" alignItems="center" width="100%" position="relative">
          {title}
          <LazyAnimatePresence mode="wait" features={domAnimation}>
            {account ? (
              !isInputFocus || !onMax ? (
                <SwapUIV2.WalletAssetDisplay balance={balance} onMax={onMax} />
              ) : (
                <SwapUIV2.AssetSettingButtonList onPercentInput={onPercentInput} />
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
                    <CurrencyLogo
                      imageRef={tokenImageRef}
                      currency={currency}
                      size="40px"
                      style={{ marginRight: '8px' }}
                    />
                  )
                ) : currencyLoading ? (
                  <Skeleton width="40px" height="40px" variant="circle" />
                ) : null}
                {currencyLoading ? null : pair ? (
                  <Text id="pair" bold fontSize="24px">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Flex alignItems="start" flexDirection="column">
                    <Flex alignItems="center" justifyContent="space-between">
                      <SymbolText id="pair" bold ref={symbolRef} style={{ fontSize: '24px' }}>
                        {(currency && currency.symbol && currency.symbol.length > 10
                          ? shortedSymbol
                          : currency?.symbol) || t('Select a currency')}
                      </SymbolText>
                      {!currencyLoading && !disableCurrencySelect && <ChevronDownIcon />}
                    </Flex>
                    <RiskInputPanelDisplay token={token ?? undefined} />
                  </Flex>
                )}
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
