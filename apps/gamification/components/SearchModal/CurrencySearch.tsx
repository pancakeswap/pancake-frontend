import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { AutoColumn, Box, Column, Input, Row, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AutoRow } from 'components/Layout/Row'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { SHORT_SYMBOL } from 'components/NetworkSwitcher'
import { CurrencyList } from 'components/SearchModal/CurrencyList'
import { TOKEN_LIST, targetChains } from 'config/supportedChain'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'

const ButtonWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
`

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.dropdown)};
  border-radius: 10px;
  display: flex;
  padding: 6px;
  align-items: center;
  &:hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.background};
  }
  background-color: ${({ theme, disable }) => disable && theme.colors.dropdown};
  opacity: ${({ disable }) => disable && '0.4'};
`

const RowWrapper = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`

interface CurrencySearchProps {
  height: number | undefined
}

export const CurrencySearch: React.FC<CurrencySearchProps> = ({ height }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const showNetworkBases = true
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const tokenList: Currency[] = useMemo(() => Object.values(TOKEN_LIST[56]).map((i) => ({ ...i })), [])
  const filteredSortedTokens: Currency[] = useMemo(() => tokenList, [tokenList])

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (!isMobile) inputRef.current?.focus()
  }, [isMobile])

  const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = safeGetAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        // if (s === native.symbol.toLowerCase().trim()) {
        //   handleCurrencySelect(native)
        // } else if (filteredSortedTokens.length > 0) {
        //   if (
        //     filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
        //     filteredSortedTokens.length === 1
        //   ) {
        //     handleCurrencySelect(filteredSortedTokens[0])
        //   }
        // }
      }
    },
    [],
    // [debouncedQuery, filteredSortedTokens, handleCurrencySelect, native],
  )

  const getCurrencyListRows = useCallback(() => {
    const hasFilteredInactiveTokens = true

    return tokenList.length || hasFilteredInactiveTokens ? (
      <Box mx="-24px" my="24px" overflow="auto">
        <CurrencyList
          currencies={filteredSortedTokens}
          height={isMobile ? (showNetworkBases ? height || 250 : height ? height + 80 : 350) : 390}
        />
      </Box>
    ) : (
      <Column style={{ padding: '20px', height: '100%' }}>
        <Text color="textSubtle" textAlign="center" mb="20px">
          {t('No results found.')}
        </Text>
      </Column>
    )
  }, [filteredSortedTokens, height, isMobile, showNetworkBases, t, tokenList.length])

  return (
    <>
      <AutoColumn gap="16px">
        <Row>
          <Input
            id="token-search-input"
            placeholder={t('Search name or paste address')}
            scale="lg"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
        <AutoColumn gap="md">
          <AutoRow>
            <Text fontSize="14px">{t('Select a Network')}</Text>
          </AutoRow>
          <RowWrapper>
            {targetChains.map((chain) => (
              <ButtonWrapper key={chain.id}>
                {/* <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected}> */}
                <BaseWrapper disable={chain.id === 56}>
                  <ChainLogo chainId={chain.id} />
                  <Text color="text" pl="12px">
                    {SHORT_SYMBOL?.[chain.id]}
                  </Text>
                </BaseWrapper>
              </ButtonWrapper>
            ))}
          </RowWrapper>
        </AutoColumn>
      </AutoColumn>
      {getCurrencyListRows()}
    </>
  )
}
export { CurrencyList }
