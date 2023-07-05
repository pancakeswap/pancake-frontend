import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Button,
  CurrencyLogo,
  Flex,
  MoreIcon,
  NextLinkFromReactRouter,
  Skeleton,
  SortArrowIcon,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useStableSwapPath } from 'state/info/hooks'
import { InfoDataSource } from 'state/info/types'
import styled from 'styled-components'
import { isAddress } from 'utils'
import { logGTMClickTokenHighLightTradeEvent } from 'utils/customGTMEventTracking'
import { formatAmount } from 'utils/formatInfoNumbers'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import Percent from 'views/Info/components/Percent'
import TradingRewardIcon from 'views/Swap/components/HotTokenList/TradingRewardIcon'
import { getTokenInfoPath } from 'state/info/utils'

import { TokenHighlightData } from './types'

/**
 *  Columns on different layouts
 *  6 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  5 = | # | Name | Price |              | Volume 24H | TVL |
 *  4 = | # | Name | Price |              | Volume 24H |     |
 *  2 = |   | Name |       |              | Volume 24H |     |
 *  On smallest screen Name is reduced to just symbol
 */

type TableType = 'priceChange' | 'volume' | 'liquidity'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 4fr 1fr 1fr 2fr;

  @media screen and (max-width: 900px) {
    grid-template-columns: 2fr repeat(3, 1fr);
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(3, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 2fr 1fr 1fr 2fr;
  }
`
const TableRowWrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};

  @media screen and (max-width: 575px) {
    max-height: 450px;
    overflow-y: auto;
  }
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const ResponsiveLogo = styled(CurrencyLogo)`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`
const StyledClickableColumnHeader = styled(ClickableColumnHeader)`
  display: flex;
  align-items: center;
  gap: 5px;
`

const SortButton = styled(Button)`
  padding: 4px 8px;
  border-radius: 8px;
  width: 25px;
  height: 25px;
  margin-left: 3px;
  border-color: ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => (theme.isDark ? theme.colors.backgroundDisabled : theme.colors.input)};
  path {
    fill: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#B4ACCF')};
  }
  &.is-asc {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 1);
    }
    path:last-child {
      fill: rgba(255, 255, 255, 0.3);
    }
  }
  &.is-desc {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 0.3);
    }
    path:last-child {
      fill: rgba(255, 255, 255, 1);
    }
  }
`

const TableLoader: React.FC<React.PropsWithChildren> = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<
  React.PropsWithChildren<{
    dataSource: InfoDataSource
    tokenData: TokenHighlightData
    index: number
    type: TableType
    handleOutputSelect: (newCurrencyOutput: Currency) => void
  }>
> = ({ tokenData, type, handleOutputSelect, dataSource }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isXs, isSm } = useMatchBreakpoints()
  const stableSwapPath = useStableSwapPath()
  const { chainId } = useActiveChainId()
  const address = isAddress(tokenData.address)
  const currencyFromAddress = useMemo(
    () => (address ? new Token(chainId, address, tokenData.decimals, tokenData.symbol) : null),
    [tokenData, chainId, address],
  )
  const tokenInfoLink = useMemo(
    () => getTokenInfoPath(chainId, tokenData.address, dataSource, stableSwapPath),
    [dataSource, tokenData.address, stableSwapPath, chainId],
  )
  if (!address) return null

  const isTradeRewardToken = dataSource === InfoDataSource.V3 && tokenData?.pairs?.length > 0

  return (
    <LinkWrapper to={tokenInfoLink}>
      <ResponsiveGrid style={{ gap: '8px' }}>
        <Flex flexWrap="wrap" width="100%" justifyContent="flex-start" alignItems="center">
          <ResponsiveLogo size="24px" currency={currencyFromAddress} />
          {(isXs || isSm) && <Text ml="4px">{tokenData.symbol}</Text>}
          {!isXs && !isSm && (
            <Flex marginLeft="10px">
              <Text>{tokenData.name}</Text>
              <Text ml="8px">({tokenData.symbol})</Text>
            </Flex>
          )}
        </Flex>
        {(type === 'priceChange' || type === 'liquidity') && (
          <Flex flexWrap="wrap" width="100%" justifyContent="center" alignItems="center">
            <Text fontWeight={400}>${formatAmount(tokenData.priceUSD, { notation: 'standard' })}</Text>
          </Flex>
        )}
        {type !== 'liquidity' && (
          <Flex flexWrap="wrap" width="100%" justifyContent="center" alignItems="center">
            <Text fontWeight={400}>
              <Percent value={tokenData.priceUSDChange} fontWeight={400} />
            </Text>
          </Flex>
        )}
        {type === 'volume' && <Text fontWeight={400}>${formatAmount(tokenData.volumeUSD)}</Text>}
        {type === 'liquidity' && <Text fontWeight={400}>${formatAmount(tokenData.tvlUSD)}</Text>}
        <Flex alignItems="center" justifyContent="flex-end">
          {isTradeRewardToken && <TradingRewardIcon pairs={tokenData.pairs} />}
          <Button
            variant="text"
            scale="sm"
            p="0"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (currencyFromAddress) handleOutputSelect(currencyFromAddress)
              logGTMClickTokenHighLightTradeEvent(tokenData.symbol)
            }}
            style={{ color: theme.colors.textSubtle }}
          >
            {t('Trade')}
          </Button>
          <Text pl="8px" pr="4px" lineHeight="100%" color="rgba(122, 110, 170, 0.3)">
            |
          </Text>
          <MoreIcon color={theme.colors.textSubtle} />
        </Flex>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

const TokenTable: React.FC<
  React.PropsWithChildren<{
    dataSource: InfoDataSource
    tokenDatas: TokenHighlightData[] | undefined
    maxItems?: number
    defaultSortField?: string
    type: TableType
    handleOutputSelect: (newCurrencyOutput: Currency) => void
  }>
> = ({
  tokenDatas,
  maxItems = MAX_ITEMS,
  defaultSortField = SORT_FIELD.volumeUSD,
  type,
  handleOutputSelect,
  dataSource,
}) => {
  const [sortField, setSortField] = useState(SORT_FIELD[defaultSortField])
  const { isMobile } = useMatchBreakpoints()
  useEffect(() => {
    if (defaultSortField) {
      setSortField(defaultSortField)
      setPage(1)
    }
  }, [defaultSortField])

  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (tokenDatas) {
      if (tokenDatas.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
    }
  }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? orderBy(
          tokenDatas,
          (tokenData) => tokenData[sortField as keyof TokenHighlightData],
          sortDirection ? 'desc' : 'asc',
        ).slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrowClassName = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? 'is-asc' : 'is-desc'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  if (!tokenDatas) {
    return <Skeleton />
  }
  return (
    <TableWrapper>
      <ResponsiveGrid>
        <StyledClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.name)}
          textTransform="uppercase"
        >
          {t('Token Name')}
        </StyledClickableColumnHeader>
        {(type === 'priceChange' || type === 'liquidity') && (
          <StyledClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.priceUSD)}
            textTransform="uppercase"
          >
            {t('Price')}{' '}
            <SortButton scale="sm" variant="subtle" className={arrowClassName(SORT_FIELD.priceUSD)}>
              <SortArrowIcon />
            </SortButton>
          </StyledClickableColumnHeader>
        )}

        {type !== 'liquidity' && (
          <StyledClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
            textTransform="uppercase"
          >
            {t('Change')}{' '}
            <SortButton scale="sm" variant="subtle" className={arrowClassName(SORT_FIELD.priceUSDChange)}>
              <SortArrowIcon />
            </SortButton>
          </StyledClickableColumnHeader>
        )}
        {type === 'liquidity' && (
          <StyledClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
            textTransform="uppercase"
          >
            {t('Liquidity')}
            <SortButton scale="sm" variant="subtle" className={arrowClassName(SORT_FIELD.liquidityUSD)}>
              <SortArrowIcon />
            </SortButton>
          </StyledClickableColumnHeader>
        )}
        {type === 'volume' && (
          <StyledClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.volumeUSD)}
            textTransform="uppercase"
          >
            {t('Volume 24H')}{' '}
            <SortButton scale="sm" variant="subtle" className={arrowClassName(SORT_FIELD.volumeUSD)}>
              <SortArrowIcon />
            </SortButton>
          </StyledClickableColumnHeader>
        )}
      </ResponsiveGrid>
      <TableRowWrapper>
        <Break />
        {sortedTokens.length > 0 ? (
          <>
            {sortedTokens.map((data, i) => {
              if (data) {
                return (
                  <Fragment key={data.address}>
                    <DataRow
                      dataSource={dataSource}
                      index={(page - 1) * MAX_ITEMS + i}
                      tokenData={data}
                      type={type}
                      handleOutputSelect={handleOutputSelect}
                    />
                    <Break />
                  </Fragment>
                )
              }
              return null
            })}
            {!isMobile && (
              <PageButtons>
                <Arrow
                  onClick={() => {
                    setPage(page === 1 ? page : page - 1)
                  }}
                >
                  <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
                </Arrow>
                <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
                <Arrow
                  onClick={() => {
                    setPage(page === maxPage ? page : page + 1)
                  }}
                >
                  <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
                </Arrow>
              </PageButtons>
            )}
          </>
        ) : (
          <>
            <TableLoader />
            <Box />
          </>
        )}
      </TableRowWrapper>
    </TableWrapper>
  )
}

export default TokenTable
