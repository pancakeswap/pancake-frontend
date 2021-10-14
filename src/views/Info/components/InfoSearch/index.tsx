import React, { useRef, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Input, Flex, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import useFetchSearchResults from 'state/info/queries/search'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { useWatchlistTokens, useWatchlistPools } from 'state/user/hooks'
import SaveIcon from 'views/Info/components/SaveIcon'
import { useHistory } from 'react-router-dom'
import { usePoolDatas, useTokenDatas } from 'state/info/hooks'
import { useTranslation } from 'contexts/Localization'
import useDebounce from 'hooks/useDebounce'
import { MINIMUM_SEARCH_CHARACTERS } from 'config/constants/info'
import { PoolData } from 'state/info/types'

const Container = styled.div`
  position: relative;
  z-index: 30;
  width: 100%;
`

const StyledInput = styled(Input)`
  z-index: 9999;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const Menu = styled.div<{ hide: boolean }>`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 50px;
  max-height: 400px;
  overflow: auto;
  right: 0;
  padding: 1.5rem;
  padding-bottom: 2.5rem;
  position: absolute;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => hide && 'none'};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  margin-top: 4px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0;
    width: 500px;
    max-height: 600px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
    width: 800px;
    max-height: 600px;
  }
`

const Blackout = styled.div`
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  z-index: 10;
  background-color: black;
  opacity: 0.7;
  left: 0;
  top: 0;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr;
  margin: 8px 0;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1.5fr repeat(3, 1fr);
  }
`

const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
  margin: 16px 0;
`

const HoverText = styled.div<{ hide: boolean }>`
  color: ${({ theme }) => theme.colors.secondary};
  display: ${({ hide }) => (hide ? 'none' : 'block')};
  margin-top: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const HoverRowLink = styled.div`
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const OptionButton = styled.div<{ enabled: boolean }>`
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, enabled }) => (enabled ? theme.colors.primary : 'transparent')};
  color: ${({ theme, enabled }) => (enabled ? theme.card.background : theme.colors.secondary)};
  :hover {
    opacity: 0.6;
    cursor: pointer;
  }
`
type BasicTokenData = {
  address: string
  symbol: string
  name: string
}
const tokenIncludesSearchTerm = (token: BasicTokenData, value: string) => {
  return (
    token.address.toLowerCase().includes(value.toLowerCase()) ||
    token.symbol.toLowerCase().includes(value.toLowerCase()) ||
    token.name.toLowerCase().includes(value.toLowerCase())
  )
}

const poolIncludesSearchTerm = (pool: PoolData, value: string) => {
  return (
    pool.address.toLowerCase().includes(value.toLowerCase()) ||
    tokenIncludesSearchTerm(pool.token0, value) ||
    tokenIncludesSearchTerm(pool.token1, value)
  )
}

const Search = () => {
  const history = useHistory()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const showMoreRef = useRef<HTMLDivElement>(null)

  const [showMenu, setShowMenu] = useState(false)
  const [value, setValue] = useState('')
  const debouncedSearchTerm = useDebounce(value, 600)

  const { tokens, pools, tokensLoading, poolsLoading, error } = useFetchSearchResults(debouncedSearchTerm)

  const [tokensShown, setTokensShown] = useState(3)
  const [poolsShown, setPoolsShown] = useState(3)

  useEffect(() => {
    setTokensShown(3)
    setPoolsShown(3)
  }, [debouncedSearchTerm])

  const handleOutsideClick = (e: any) => {
    const menuClick = menuRef.current && menuRef.current.contains(e.target)
    const inputCLick = inputRef.current && inputRef.current.contains(e.target)
    const showMoreClick = showMoreRef.current && showMoreRef.current.contains(e.target)

    if (!menuClick && !inputCLick && !showMoreClick) {
      setPoolsShown(3)
      setTokensShown(3)
      setShowMenu(false)
    }
  }

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick)
      document.querySelector('body').style.overflow = 'hidden'
    } else {
      document.removeEventListener('click', handleOutsideClick)
      document.querySelector('body').style.overflow = 'visible'
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [showMenu])

  // watchlist
  const [savedTokens, addSavedToken] = useWatchlistTokens()
  const [savedPools, addSavedPool] = useWatchlistPools()

  const handleItemClick = (to: string) => {
    setShowMenu(false)
    setPoolsShown(3)
    setTokensShown(3)
    history.push(to)
  }

  // get date for watchlist
  const watchListTokenData = useTokenDatas(savedTokens)
  const watchListTokenLoading = watchListTokenData.length !== savedTokens.length
  const watchListPoolData = usePoolDatas(savedPools)
  const watchListPoolLoading = watchListPoolData.length !== savedPools.length

  // filter on view
  const [showWatchlist, setShowWatchlist] = useState(false)
  const tokensForList = useMemo(() => {
    if (showWatchlist) {
      return watchListTokenData.filter((token) => tokenIncludesSearchTerm(token, value))
    }
    return tokens.sort((t0, t1) => (t0.volumeUSD > t1.volumeUSD ? -1 : 1))
  }, [showWatchlist, tokens, watchListTokenData, value])

  const poolForList = useMemo(() => {
    if (showWatchlist) {
      return watchListPoolData.filter((pool) => poolIncludesSearchTerm(pool, value))
    }
    return pools.sort((p0, p1) => (p0.volumeUSD > p1.volumeUSD ? -1 : 1))
  }, [pools, showWatchlist, watchListPoolData, value])

  const contentUnderTokenList = () => {
    const isLoading = showWatchlist ? watchListTokenLoading : tokensLoading
    const noTokensFound =
      tokensForList.length === 0 && !isLoading && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS
    const noWatchlistTokens = tokensForList.length === 0 && !isLoading
    const showMessage = showWatchlist ? noWatchlistTokens : noTokensFound
    const noTokensMessage = showWatchlist ? t('Saved tokens will appear here') : t('No results')
    return (
      <>
        {isLoading && <Skeleton />}
        {showMessage && <Text>{noTokensMessage}</Text>}
        {!showWatchlist && debouncedSearchTerm.length < MINIMUM_SEARCH_CHARACTERS && (
          <Text>{t('Search pools or tokens')}</Text>
        )}
      </>
    )
  }

  const contentUnderPoolList = () => {
    const isLoading = showWatchlist ? watchListPoolLoading : poolsLoading
    const noPoolsFound =
      poolForList.length === 0 && !poolsLoading && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS
    const noWatchlistPools = poolForList.length === 0 && !isLoading
    const showMessage = showWatchlist ? noWatchlistPools : noPoolsFound
    const noPoolsMessage = showWatchlist ? t('Saved tokens will appear here') : t('No results')
    return (
      <>
        {isLoading && <Skeleton />}
        {showMessage && <Text>{noPoolsMessage}</Text>}
        {!showWatchlist && debouncedSearchTerm.length < MINIMUM_SEARCH_CHARACTERS && (
          <Text>{t('Search pools or tokens')}</Text>
        )}
      </>
    )
  }

  return (
    <>
      {showMenu ? <Blackout /> : null}
      <Container>
        <StyledInput
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          placeholder={t('Search pools or tokens')}
          ref={inputRef}
          onFocus={() => {
            setShowMenu(true)
          }}
        />
        <Menu hide={!showMenu} ref={menuRef}>
          <Flex mb="16px">
            <OptionButton enabled={!showWatchlist} onClick={() => setShowWatchlist(false)}>
              {t('Search')}
            </OptionButton>
            <OptionButton enabled={showWatchlist} onClick={() => setShowWatchlist(true)}>
              {t('Watchlist')}
            </OptionButton>
          </Flex>
          {error && <Text color="failure">{t('Error occurred, please try again')}</Text>}

          <ResponsiveGrid>
            <Text bold color="secondary">
              {t('Tokens')}
            </Text>
            {!isXs && !isSm && (
              <Text textAlign="end" fontSize="12px">
                {t('Price')}
              </Text>
            )}
            {!isXs && !isSm && (
              <Text textAlign="end" fontSize="12px">
                {t('Volume 24H')}
              </Text>
            )}
            {!isXs && !isSm && (
              <Text textAlign="end" fontSize="12px">
                {t('Liquidity')}
              </Text>
            )}
          </ResponsiveGrid>
          {tokensForList.slice(0, tokensShown).map((token, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <HoverRowLink onClick={() => handleItemClick(`/info/token/${token.address}`)} key={i}>
                <ResponsiveGrid>
                  <Flex>
                    <CurrencyLogo address={token.address} />
                    <Text ml="10px">
                      <Text>{`${token.name} (${token.symbol})`}</Text>
                    </Text>
                    <SaveIcon
                      id="watchlist-icon"
                      style={{ marginLeft: '8px' }}
                      fill={savedTokens.includes(token.address)}
                      onClick={(e) => {
                        e.stopPropagation()
                        addSavedToken(token.address)
                      }}
                    />
                  </Flex>
                  {!isXs && !isSm && <Text textAlign="end">${formatAmount(token.priceUSD)}</Text>}
                  {!isXs && !isSm && <Text textAlign="end">${formatAmount(token.volumeUSD)}</Text>}
                  {!isXs && !isSm && <Text textAlign="end">${formatAmount(token.liquidityUSD)}</Text>}
                </ResponsiveGrid>
              </HoverRowLink>
            )
          })}
          {contentUnderTokenList()}
          <HoverText
            onClick={() => {
              setTokensShown(tokensShown + 5)
            }}
            hide={tokensForList.length <= tokensShown}
            ref={showMoreRef}
          >
            {t('See more...')}
          </HoverText>

          <Break />
          <ResponsiveGrid>
            <Text bold color="secondary" mb="8px">
              {t('Pools')}
            </Text>
            {!isXs && !isSm && (
              <Text textAlign="end" fontSize="12px">
                {t('Volume 24H')}
              </Text>
            )}
            {!isXs && !isSm && (
              <Text textAlign="end" fontSize="12px">
                {t('Volume 7D')}
              </Text>
            )}
            {!isXs && !isSm && (
              <Text textAlign="end" fontSize="12px">
                {t('Liquidity')}
              </Text>
            )}
          </ResponsiveGrid>
          {poolForList.slice(0, poolsShown).map((p, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <HoverRowLink onClick={() => handleItemClick(`/info/pool/${p.address}`)} key={i}>
                <ResponsiveGrid>
                  <Flex>
                    <DoubleCurrencyLogo address0={p.token0.address} address1={p.token1.address} />
                    <Text ml="10px" style={{ whiteSpace: 'nowrap' }}>
                      <Text>{`${p.token0.symbol} / ${p.token1.symbol}`}</Text>
                    </Text>
                    <SaveIcon
                      id="watchlist-icon"
                      style={{ marginLeft: '10px' }}
                      fill={savedPools.includes(p.address)}
                      onClick={(e) => {
                        e.stopPropagation()
                        addSavedPool(p.address)
                      }}
                    />
                  </Flex>
                  {!isXs && !isSm && <Text textAlign="end">${formatAmount(p.volumeUSD)}</Text>}
                  {!isXs && !isSm && <Text textAlign="end">${formatAmount(p.volumeUSDWeek)}</Text>}
                  {!isXs && !isSm && <Text textAlign="end">${formatAmount(p.liquidityUSD)}</Text>}
                </ResponsiveGrid>
              </HoverRowLink>
            )
          })}
          {contentUnderPoolList()}
          <HoverText
            onClick={() => {
              setPoolsShown(poolsShown + 5)
            }}
            hide={poolForList.length <= poolsShown}
            ref={showMoreRef}
          >
            {t('See more...')}
          </HoverText>
        </Menu>
      </Container>
    </>
  )
}

export default Search
