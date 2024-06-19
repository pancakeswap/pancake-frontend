import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Input, Skeleton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { MINIMUM_SEARCH_CHARACTERS } from 'config/constants/info'
import orderBy from 'lodash/orderBy'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import { checkIsStableSwap, multiChainId } from 'state/info/constant'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import useFetchSearchResults from 'state/info/queries/search'
import { styled } from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getTokenNameAlias, getTokenSymbolAlias } from 'utils/getTokenAlias'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'

const Container = styled.div`
  position: relative;
  z-index: 30;
  width: 100%;
`

const StyledInput = styled(Input)`
  z-index: 9999;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const Menu = styled.div`
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

const HoverText = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  display: block;
  margin-top: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const HoverRowLink = styled.div`
  &:hover {
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
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

const Search = () => {
  const router = useRouter()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()
  const chainName = useChainNameByQuery()
  const chainId = multiChainId[chainName]

  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const showMoreTokenRef = useRef<HTMLDivElement>(null)
  const showMorePoolRef = useRef<HTMLDivElement>(null)

  const [showMenu, setShowMenu] = useState(false)
  const [value, setValue] = useState('')
  const debouncedSearchTerm = useDebounce(value, 600)

  const { tokens, pools, tokensLoading, poolsLoading, error } = useFetchSearchResults(debouncedSearchTerm, showMenu)

  const [tokensShown, setTokensShown] = useState(3)
  const [poolsShown, setPoolsShown] = useState(3)

  useEffect(() => {
    setTokensShown(3)
    setPoolsShown(3)
  }, [debouncedSearchTerm])

  const handleOutsideClick = (e: any) => {
    const menuClick = menuRef.current && menuRef.current.contains(e.target)
    const inputCLick = inputRef.current && inputRef.current.contains(e.target)
    const showMoreTokenClick = showMoreTokenRef.current && showMoreTokenRef.current.contains(e.target)
    const showMorePoolClick = showMorePoolRef.current && showMorePoolRef.current.contains(e.target)

    if (!menuClick && !inputCLick && !showMoreTokenClick && !showMorePoolClick) {
      setPoolsShown(3)
      setTokensShown(3)
      setShowMenu(false)
    }
  }

  useEffect(() => {
    const htmlBodyElement = document.querySelector('body')
    if (htmlBodyElement) {
      if (showMenu) {
        document.addEventListener('click', handleOutsideClick)
        htmlBodyElement.style.overflow = 'hidden'
      } else {
        document.removeEventListener('click', handleOutsideClick)
        htmlBodyElement.style.overflow = 'visible'
      }
      return () => {
        document.removeEventListener('click', handleOutsideClick)
      }
    }
    return undefined
  }, [showMenu])

  const handleItemClick = (to: string) => {
    setShowMenu(false)
    setPoolsShown(3)
    setTokensShown(3)
    router.push(to)
  }

  // filter on view
  const tokensForList = useMemo(() => {
    return orderBy(tokens, (token) => token.tvlUSD, 'desc')
  }, [tokens])

  const poolForList = useMemo(() => {
    return orderBy(pools, (pool) => pool?.tvlUSD, 'desc')
  }, [pools])

  const contentUnderTokenList = () => {
    const isLoading = tokensLoading
    const noTokensFound =
      tokensForList.length === 0 && !isLoading && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS
    const showMessage = noTokensFound
    const noTokensMessage = t('No results')
    return (
      <>
        {isLoading && <Skeleton />}
        {showMessage && <Text>{noTokensMessage}</Text>}
        {debouncedSearchTerm.length < MINIMUM_SEARCH_CHARACTERS && <Text>{t('Search liquidity pairs or tokens')}</Text>}
      </>
    )
  }

  const contentUnderPoolList = () => {
    const isLoading = poolsLoading
    const noPoolsFound =
      poolForList.length === 0 && !poolsLoading && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS
    const showMessage = noPoolsFound
    const noPoolsMessage = t('No results')
    return (
      <>
        {isLoading && <Skeleton />}
        {showMessage && <Text>{noPoolsMessage}</Text>}
        {debouncedSearchTerm.length < MINIMUM_SEARCH_CHARACTERS && <Text>{t('Search liquidity pairs or tokens')}</Text>}
      </>
    )
  }
  const chainPath = useMultiChainPath()
  const stableSwapQuery = checkIsStableSwap() ? '?type=stableSwap' : ''
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
          placeholder={t('Search liquidity pairs or tokens')}
          ref={inputRef}
          onFocus={() => {
            setShowMenu(true)
          }}
        />
        {showMenu && (
          <Menu ref={menuRef}>
            <Flex mb="16px">
              <OptionButton enabled>{t('Search')}</OptionButton>
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
              {/* {!isXs && !isSm && (
                <Text textAlign="end" fontSize="12px">
                  {t('Volume 24H')}
                </Text>
              )} */}
              {!isXs && !isSm && (
                <Text textAlign="end" fontSize="12px">
                  {t('Liquidity')}
                </Text>
              )}
            </ResponsiveGrid>
            {tokensForList.slice(0, tokensShown).map((token) => {
              return (
                <HoverRowLink
                  onClick={() => handleItemClick(`/info${chainPath}/tokens/${token.address}${stableSwapQuery}`)}
                  key={`searchTokenResult${token.address}`}
                >
                  <ResponsiveGrid>
                    <Flex>
                      <CurrencyLogo address={token.address} chainName={chainName} />
                      <Text ml="10px">
                        <Text>{`${token.address && getTokenNameAlias(token.address, chainId, token.name)} (${
                          token.address && getTokenSymbolAlias(token.address, chainId, token.symbol)
                        })`}</Text>
                      </Text>
                    </Flex>
                    {!isXs && !isSm && <Text textAlign="end">${formatAmount(token.priceUSD)}</Text>}
                    {!isXs && !isSm && <Text textAlign="end">${formatAmount(token.tvlUSD)}</Text>}
                  </ResponsiveGrid>
                </HoverRowLink>
              )
            })}
            {contentUnderTokenList()}

            <HoverText
              onClick={() => {
                if (tokensShown + 5 < tokensForList.length) setTokensShown(tokensShown + 5)
                else setTokensShown(tokensForList.length)
              }}
              ref={showMoreTokenRef}
              style={{ ...(tokensForList.length <= tokensShown && { display: 'none' }) }}
            >
              {t('See more...')}
            </HoverText>

            <Break />
            <ResponsiveGrid>
              <Text bold color="secondary" mb="8px">
                {t('Pairs')}
              </Text>
              {/* {!isXs && !isSm && (
                <Text textAlign="end" fontSize="12px">
                  {t('Volume 24H')}
                </Text>
              )}
              {!isXs && !isSm && (
                <Text textAlign="end" fontSize="12px">
                  {t('Volume 7D')}
                </Text>
              )} */}
              {!isXs && !isSm && (
                <Text textAlign="end" fontSize="12px">
                  {t('Liquidity')}
                </Text>
              )}
            </ResponsiveGrid>
            {poolForList.slice(0, poolsShown).map((p) => {
              return (
                <HoverRowLink
                  onClick={() => handleItemClick(`/info${chainPath}/pairs/${p?.address}${stableSwapQuery}`)}
                  key={`searchPoolResult${p?.address}`}
                >
                  <ResponsiveGrid>
                    <Flex>
                      <DoubleCurrencyLogo
                        address0={p?.token0.address}
                        address1={p?.token1.address}
                        chainName={chainName}
                      />
                      <Text ml="10px" style={{ whiteSpace: 'nowrap' }}>
                        <Text>{`${p && getTokenSymbolAlias(p.token0.address, chainId, p.token0.symbol)} / ${
                          p && getTokenSymbolAlias(p.token1.address, chainId, p.token1.symbol)
                        }`}</Text>
                      </Text>
                    </Flex>
                    {/* {!isXs && !isSm && <Text textAlign="end">${formatAmount(p?.volumeUSD)}</Text>}
                    {!isXs && !isSm && <Text textAlign="end">${formatAmount(p?.volumeUSDWeek)}</Text>} */}
                    {!isXs && !isSm && <Text textAlign="end">${formatAmount(p?.tvlUSD)}</Text>}
                  </ResponsiveGrid>
                </HoverRowLink>
              )
            })}
            {contentUnderPoolList()}
            <HoverText
              onClick={() => {
                if (poolsShown + 5 < poolForList.length) setPoolsShown(poolsShown + 5)
                else setPoolsShown(poolForList.length)
              }}
              ref={showMorePoolRef}
              style={{ ...(poolForList.length <= poolsShown && { display: 'none' }) }}
            >
              {t('See more...')}
            </HoverText>
          </Menu>
        )}
      </Container>
    </>
  )
}

export default Search
