/* eslint-disable no-restricted-syntax */
import { useDebounce, useSortedTokensByQuery } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { createFilterToken } from '@pancakeswap/token-lists'
import { AutoColumn, AutoRow, Box, Column, Input, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAudioPlay } from '@pancakeswap/utils/user'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { safeGetAddress } from 'utils'
import { chains } from 'utils/wagmi'
import { isAddress } from 'viem'
import { OnRampChainId as ChainId } from 'views/BuyCrypto/constants'
import { FiatCurrency } from 'views/BuyCrypto/types'
import Row from '../Layout/Row'
import OnRampCurrencyList from './OnRampCurrencyList'
import { getSwapSound } from './swapSound'

interface CurrencySearchProps {
  selectedCurrency?: Currency | FiatCurrency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | FiatCurrency | null
  tokensToShow?: (
    | Currency
    | {
        symbol: string
        name: string
      }
  )[]
  mode?: string
  onRampFlow?: boolean
  activeChain: ChainId | undefined
}

function OnRampCurrencySearch({
  activeChain,
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  tokensToShow,
  mode,
  onRampFlow,
}: CurrencySearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()
  const debouncedQuery = useDebounce(searchQuery, 200)
  const native = useNativeCurrency()

  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [audioPlay] = useAudioPlay()

  const filteredTokens: Token[] = useMemo(() => {
    if (!tokensToShow) return []
    const filterToken = createFilterToken(debouncedQuery, (address) => isAddress(address))
    return Object.values(tokensToShow).filter(filterToken as unknown as any)
  }, [tokensToShow, debouncedQuery])

  const chainName = useMemo(() => chains.find((c) => c.id === activeChain), [activeChain])?.name

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      if (audioPlay) {
        getSwapSound().play()
      }
    },
    [audioPlay, onCurrencySelect],
  )

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (!isMobile) inputRef.current?.focus()
  }, [isMobile])

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = safeGetAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === native.symbol.toLowerCase().trim()) {
          handleCurrencySelect(native)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [debouncedQuery, filteredSortedTokens, handleCurrencySelect, native],
  )

  const getCurrencyListRows = useCallback(() => {
    return (
      <Box mx="-24px" mb="24px" mt="12px" height="100%">
        {filteredSortedTokens?.length ? (
          <OnRampCurrencyList
            height={isMobile ? (mode === 'onramp-fiat' ? 390 : 305) : 390}
            currencies={filteredSortedTokens}
            onCurrencySelect={handleCurrencySelect}
            otherCurrency={otherSelectedCurrency}
            selectedCurrency={selectedCurrency}
            fixedListRef={fixedList}
            mode={mode as string}
          />
        ) : (
          <Column style={{ padding: '20px', height: '400px' }}>
            <Text color="textSubtle" textAlign="center" mb="20px">
              {t('No results found.')}
            </Text>
          </Column>
        )}
      </Box>
    )
  }, [handleCurrencySelect, filteredSortedTokens, otherSelectedCurrency, selectedCurrency, t, isMobile, mode])

  return (
    <>
      <AutoColumn gap="16px">
        <Row>
          <Input
            id="token-search-input"
            placeholder={onRampFlow ? t('Search name') : t('Search name or paste address')}
            scale="lg"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
        <AutoRow display="flex" justifyContent="space-between">
          {mode !== 'onramp-fiat' && activeChain ? (
            <Text color="primary" size="xs" fontWeight="bold" fontSize={15}>
              {t('%network% tokens', { network: chainName })}
            </Text>
          ) : mode !== 'onramp-fiat' ? (
            <Text color="primary" size="xs" fontWeight="bold" fontSize={15}>
              {t('All tokens')}
            </Text>
          ) : null}
          {mode === 'onramp-fiat' && (
            <Text color="primary" size="xs" fontWeight="bold" fontSize={15}>
              {t('select a currency')}
            </Text>
          )}
        </AutoRow>
      </AutoColumn>
      {getCurrencyListRows()}
    </>
  )
}

export default OnRampCurrencySearch
