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
  useMatchBreakpoints,
  useModal,
} from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { CurrencyLogo, DoubleCurrencyLogo, SwapUIV2 } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'

import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { RiskInputPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import {
  MAX_FONT_SIZE,
  MAX_LOGO_SIZE,
  MIN_FONT_SIZE,
  MIN_LOGO_SIZE,
  SIZE_ADAPTION_BOUNDARY_MAX_PX,
  SIZE_ADAPTION_BOUNDARY_MIN_PX_,
  useFontSize,
} from './state'

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 24px 4px;

  &:hover {
    background: ${({ theme }) => theme.colors.invertedContrast};
  }
`
const SymbolText = styled(Text)`
  font-size: ${MAX_FONT_SIZE}px;
`

const handleFontSizeChange = (fontSize: string, operation: number) => {
  const currentFontSize = parseInt(fontSize.replace('px', ''), 10)
  if ((currentFontSize > MIN_FONT_SIZE && operation < 0) || (currentFontSize < MAX_FONT_SIZE && operation > 0))
    return `${currentFontSize + operation}px`
  return fontSize
}

const handleFontSizeChangeNumerical = (fontSize: string, operation: number) => {
  const currentFontSize = parseInt(fontSize.replace('px', ''), 10)
  if ((currentFontSize > MIN_FONT_SIZE && operation < 0) || (currentFontSize < MAX_FONT_SIZE && operation > 0))
    return currentFontSize + operation
  return parseInt(fontSize.replace('px', ''), 10)
}

const useSizeAdaption = (value: string, currencySymbol?: string, otherCurrencySymbol?: string) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const tokenImageRef = useRef<HTMLImageElement>(null)
  const symbolRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Linked font sizes are for Symbol and Logo only and not Input
  const { symbolFontSize, logoFontSize, setFontSizesBySymbol } = useFontSize(
    currencySymbol ?? '',
    otherCurrencySymbol ?? '',
  )

  const { isMobile } = useMatchBreakpoints()

  const shortedSymbol = useMemo(() => {
    const CUTOFF_FONT_SIZE = isMobile ? { left: 3, right: 3 } : { left: 5, right: 4 }

    if (currencySymbol && currencySymbol.length > 8) {
      return `${currencySymbol.slice(0, CUTOFF_FONT_SIZE.left)}...${currencySymbol.slice(
        currencySymbol.length - CUTOFF_FONT_SIZE.right,
        currencySymbol.length,
      )}`
    }
    return currencySymbol
  }, [currencySymbol, isMobile])

  useLayoutEffect(() => {
    if (!inputRef.current || !symbolRef.current || !wrapperRef.current || !tokenImageRef.current) return

    const inputElement = inputRef.current
    const symbolElement = symbolRef.current
    const logoElement = tokenImageRef.current

    const wrapperWidth = wrapperRef.current.offsetWidth
    const symbolWidth = symbolElement.offsetWidth
    const inputWidth = inputElement.scrollWidth
    const logoWidth = logoElement.offsetWidth

    console.log('Values', {
      currencySymbol,
      wrapperWidth,
      symbolWidth,
      inputWidth,
      logoWidth,
      SIZE_ADAPTION_BOUNDARY_MIN_PX_,
      SIZE_ADAPTION_BOUNDARY_MAX_PX,
      firstCondition: wrapperWidth - symbolWidth - inputWidth < SIZE_ADAPTION_BOUNDARY_MIN_PX_,
      secondCondition: wrapperWidth - symbolWidth - inputWidth > SIZE_ADAPTION_BOUNDARY_MAX_PX,
    })

    if (wrapperWidth - symbolWidth - inputWidth < SIZE_ADAPTION_BOUNDARY_MIN_PX_) {
      inputElement.style.fontSize = handleFontSizeChange(inputElement.style.fontSize, -2)

      const logoSize = Math.max(logoWidth - 2, MIN_LOGO_SIZE)

      setFontSizesBySymbol(
        currencySymbol ?? '',
        handleFontSizeChangeNumerical(inputElement.style.fontSize, -2),
        logoSize,
      )
    } else if (wrapperWidth - symbolWidth - inputWidth > SIZE_ADAPTION_BOUNDARY_MAX_PX) {
      inputElement.style.fontSize = handleFontSizeChange(inputElement.style.fontSize, 2)

      const logoSize = Math.min(logoWidth + 2, MAX_LOGO_SIZE)
      setFontSizesBySymbol(
        currencySymbol ?? '',
        handleFontSizeChangeNumerical(inputElement.style.fontSize, 2),
        logoSize,
      )
    }

    if (value === '') {
      inputElement.style.fontSize = '24px'

      setFontSizesBySymbol(currencySymbol ?? '', MAX_FONT_SIZE, 40)
    }
  }, [value, currencySymbol, setFontSizesBySymbol])

  useEffect(() => {
    const symbolElement = symbolRef.current
    if (!symbolElement) return

    symbolElement.style.fontSize = `${symbolFontSize}px`
  }, [symbolFontSize, currencySymbol, otherCurrencySymbol])

  useEffect(() => {
    const logoElement = tokenImageRef.current
    if (!logoElement) return

    logoElement.style.width = `${logoFontSize}px`
    logoElement.style.height = `${logoFontSize}px`
  }, [logoFontSize, currencySymbol, otherCurrencySymbol])

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
  isUserInsufficientBalance?: boolean
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
  isUserInsufficientBalance,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  const mode = id
  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  // const tokenAddress = token ? safeGetAddress(token.address) : null
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
      showCurrencyInHeader
    />,
  )

  const { shortedSymbol, inputRef, wrapperRef, tokenImageRef, symbolRef } = useSizeAdaption(
    value ?? '',
    currency?.symbol,
    otherCurrency?.symbol,
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
                <SwapUIV2.WalletAssetDisplay
                  isUserInsufficientBalance={isUserInsufficientBalance}
                  balance={balance}
                  onMax={onMax}
                />
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
                      <SymbolText id="pair" bold ref={symbolRef}>
                        {(currency && currency.symbol && shortedSymbol) || t('Select a currency')}
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
