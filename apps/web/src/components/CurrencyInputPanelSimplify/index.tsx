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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'

import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { RiskInputPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { FONT_SIZE, LOGO_SIZE, useFontSize } from './state'

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 24px 4px;

  &:hover {
    background: ${({ theme }) => theme.colors.invertedContrast};
  }
`
const SymbolText = styled(Text)`
  font-size: ${FONT_SIZE.LARGE}px;
`

const formatDollarAmount = (amount: number) => {
  if (amount > 0 && amount < 0.01) {
    return '<0.01'
  }
  return formatNumber(amount)
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

  const { isMobile, isXs, isSm } = useMatchBreakpoints()

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

  useEffect(() => {
    if (!inputRef.current || !symbolRef.current || !wrapperRef.current || !tokenImageRef.current) return

    const inputElement = inputRef.current

    const wrapperWidth = wrapperRef.current.offsetWidth

    const fontWidth = 8 // consider for calculation an approx width of a character in large font size

    const valueIsPercentWidthOfWrapper = (value.length * fontWidth * 100) / wrapperWidth

    // Breakpoints of valueIsPercentWidthOfWrapper. Calibrated for ~4 character symbols
    const BREAKPOINT = isXs
      ? {
          ONE: 25,
          TWO: 30,
          THREE: 37,
          FOUR: 45,
        }
      : isSm
      ? {
          ONE: 35,
          TWO: 40,
          THREE: 44,
          FOUR: 50,
        }
      : {
          ONE: 40,
          TWO: 45,
          THREE: 50,
          FOUR: 57,
        }

    // Since the breakpoints are calibrated for 4 character symbols, we need to adjust for longer symbols
    const symbolExcessLength = shortedSymbol && shortedSymbol.length > 4 ? shortedSymbol?.length - 2 : 0

    if (valueIsPercentWidthOfWrapper >= BREAKPOINT.FOUR - symbolExcessLength) {
      inputElement.style.fontSize = `${FONT_SIZE.SMALL}px`
      setFontSizesBySymbol(currencySymbol ?? '', FONT_SIZE.SMALL, LOGO_SIZE.SMALL)
    } else if (valueIsPercentWidthOfWrapper >= BREAKPOINT.THREE - symbolExcessLength) {
      inputElement.style.fontSize = `${FONT_SIZE.MEDIUM}px`
      setFontSizesBySymbol(currencySymbol ?? '', FONT_SIZE.SMALL, LOGO_SIZE.MEDIUM)
    } else if (valueIsPercentWidthOfWrapper >= BREAKPOINT.TWO - symbolExcessLength) {
      inputElement.style.fontSize = `${FONT_SIZE.LARGE}px`
      setFontSizesBySymbol(currencySymbol ?? '', FONT_SIZE.MEDIUM, LOGO_SIZE.LARGE)
    } else if (valueIsPercentWidthOfWrapper >= BREAKPOINT.ONE - symbolExcessLength) {
      inputElement.style.fontSize = `${FONT_SIZE.X_LARGE}px`
      setFontSizesBySymbol(currencySymbol ?? '', FONT_SIZE.MEDIUM, LOGO_SIZE.X_LARGE)
    } else {
      inputElement.style.fontSize = `${FONT_SIZE.MAX}px`
      setFontSizesBySymbol(currencySymbol ?? '', FONT_SIZE.LARGE, LOGO_SIZE.MAX)
    }
  }, [value, currencySymbol, setFontSizesBySymbol, otherCurrencySymbol, isXs, isSm, shortedSymbol])

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
                    <FiatLogo currency={currency} size={`${LOGO_SIZE.MAX}px`} style={{ marginRight: '8px' }} />
                  ) : (
                    <CurrencyLogo
                      imageRef={tokenImageRef}
                      currency={currency}
                      size={`${LOGO_SIZE.MAX}px`}
                      style={{
                        marginRight: '8px',
                      }}
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
        inputLoading || (showUSDPrice && Number.isFinite(amountInDollar)) ? (
          <Box position="absolute" bottom="12px" right="0px">
            <Flex justifyContent="flex-end" mr="1rem">
              <Flex maxWidth={['120px', '160px', '200px', '240px']}>
                {inputLoading ? (
                  <Loading width="14px" height="14px" />
                ) : showUSDPrice && Number.isFinite(amountInDollar) ? (
                  <>
                    <Text fontSize="14px" color="textSubtle" ellipsis>
                      {`~${amountInDollar && formatDollarAmount(amountInDollar)}`}
                    </Text>
                    <Text ml="4px" fontSize="14px" color="textSubtle">
                      USD
                    </Text>
                  </>
                ) : null}
              </Flex>
            </Flex>
          </Box>
        ) : null
      }
    />
  )
})

export default CurrencyInputPanelSimplify
