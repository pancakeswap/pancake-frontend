import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Token } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Box, Column, Input, Row, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AutoRow } from 'components/Layout/Row'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { SHORT_SYMBOL } from 'components/NetworkSwitcher'
import { CurrencyList } from 'components/SearchModal/CurrencyList'
import { TOKEN_LIST, targetChains } from 'config/supportedChain'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  height?: number | undefined
  selectedCurrency: Currency
  onCurrencySelect: (value: Currency) => void
}

export const CurrencySearch: React.FC<CurrencySearchProps> = ({ height, selectedCurrency, onCurrencySelect }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const showNetworkBases = true
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedChainId, setSelectedChainId] = useState<ChainId>(selectedCurrency?.chainId ?? ChainId.BSC)

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

  const tokenList = useMemo((): Token[] => {
    const list = Object.values(TOKEN_LIST?.[selectedChainId]).map((i: Currency) => ({ ...i }))
    return list as Token[]
  }, [selectedChainId])

  const filteredSortedTokens = useMemo((): Token[] => {
    const searchQueryToLowerCase = searchQuery.toLowerCase()

    return searchQuery === ''
      ? tokenList
      : tokenList.filter(
          (i) =>
            i.symbol.toLowerCase().includes(searchQueryToLowerCase) ||
            i?.address.toLowerCase() === searchQueryToLowerCase.toLowerCase(),
        )
  }, [searchQuery, tokenList])

  const getCurrencyListRows = useCallback(() => {
    return filteredSortedTokens.length ? (
      <Box mx="-24px" my="24px" overflow="auto">
        <CurrencyList
          selectedCurrency={selectedCurrency}
          currencies={filteredSortedTokens}
          height={isMobile ? (showNetworkBases ? height || 250 : height ? height + 80 : 350) : 390}
          onCurrencySelect={onCurrencySelect}
        />
      </Box>
    ) : (
      <Column style={{ padding: '20px', height: '100%' }}>
        <Text color="textSubtle" textAlign="center" mb="20px">
          {t('No results found.')}
        </Text>
      </Column>
    )
  }, [height, selectedCurrency, isMobile, showNetworkBases, filteredSortedTokens, onCurrencySelect, t])

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
          />
        </Row>
        <AutoColumn gap="md">
          <AutoRow>
            <Text fontSize="14px">{t('Select a Network')}</Text>
          </AutoRow>
          <RowWrapper>
            {targetChains.map((chain) => (
              <ButtonWrapper key={chain.id}>
                <BaseWrapper onClick={() => setSelectedChainId(chain.id)} disable={chain.id === selectedChainId}>
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
