import { useState, useMemo, useCallback, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import {
  Text,
  Flex,
  Box,
  Skeleton,
  ArrowBackIcon,
  ArrowForwardIcon,
  useMatchBreakpoints,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import { useGetChainName, useMultiChainPath, useStableSwapPath } from 'state/info/hooks'
import { TokenData } from 'state/info/types'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import Percent from 'views/Info/components/Percent'
import { useTranslation } from '@pancakeswap/localization'
import orderBy from 'lodash/orderBy'
import { formatAmount } from 'utils/formatInfoNumbers'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'

/**
 *  Columns on different layouts
 *  6 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  5 = | # | Name | Price |              | Volume 24H | TVL |
 *  4 = | # | Name | Price |              | Volume 24H |     |
 *  2 = |   | Name |       |              | Volume 24H |     |
 *  On smallest screen Name is reduced to just symbol
 */

type TableType = 'priceChange' | 'volume'
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 3fr 2fr 1fr;

  @media screen and (max-width: 900px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr 1fr;
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
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
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

const DataRow: React.FC<React.PropsWithChildren<{ tokenData: TokenData; index: number; type: TableType }>> = ({
  tokenData,
  type,
}) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const chainName = useGetChainName()
  const chianPath = useMultiChainPath()
  const stableSwapPath = useStableSwapPath()
  return (
    <LinkWrapper to={`/info${chianPath}/tokens/${tokenData.address}${stableSwapPath}`}>
      <ResponsiveGrid>
        <Flex alignItems="center">
          <ResponsiveLogo address={tokenData.address} chainName={chainName} />
          {(isXs || isSm) && <Text ml="8px">{tokenData.symbol}</Text>}
          {!isXs && !isSm && (
            <Flex marginLeft="10px">
              <Text>{tokenData.name}</Text>
              <Text ml="8px">({tokenData.symbol})</Text>
            </Flex>
          )}
        </Flex>
        {type === 'priceChange' && (
          <Text fontWeight={400}>${formatAmount(tokenData.priceUSD, { notation: 'standard' })}</Text>
        )}
        <Text fontWeight={400}>
          <Percent value={tokenData.priceUSDChange} fontWeight={400} />
        </Text>
        {type === 'volume' && <Text fontWeight={400}>${formatAmount(tokenData.volumeUSD)}</Text>}
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
    tokenDatas: TokenData[] | undefined
    maxItems?: number
    defaultSortField?: string
    type: TableType
  }>
> = ({ tokenDatas, maxItems = MAX_ITEMS, defaultSortField = SORT_FIELD.volumeUSD, type }) => {
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
          (tokenData) => tokenData[sortField as keyof TokenData],
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

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
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
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.name)}
          textTransform="uppercase"
        >
          {t('Token Name')} {arrow(SORT_FIELD.name)}
        </ClickableColumnHeader>
        {type === 'priceChange' && (
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.priceUSD)}
            textTransform="uppercase"
          >
            {t('Price')} {arrow(SORT_FIELD.priceUSD)}
          </ClickableColumnHeader>
        )}
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
          textTransform="uppercase"
        >
          {t('Change')} {arrow(SORT_FIELD.priceUSDChange)}
        </ClickableColumnHeader>
        {type === 'volume' && (
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.volumeUSD)}
            textTransform="uppercase"
          >
            {t('Volume 24H')} {arrow(SORT_FIELD.volumeUSD)}
          </ClickableColumnHeader>
        )}
      </ResponsiveGrid>

      <Break />
      {sortedTokens.length > 0 ? (
        <>
          {sortedTokens.map((data, i) => {
            if (data) {
              return (
                <Fragment key={data.address}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} type={type} />
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
    </TableWrapper>
  )
}

export default TokenTable
