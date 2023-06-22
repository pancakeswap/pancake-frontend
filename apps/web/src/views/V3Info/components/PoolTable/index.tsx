import { ArrowBackIcon, ArrowForwardIcon, Box, SortArrowIcon, Text } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import NextLink from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import styled from 'styled-components'
import { subgraphTokenSymbol } from 'state/info/constant'
import { DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { POOL_HIDE, v3InfoPath } from '../../constants'
import { PoolData } from '../../types'
import { feeTierPercent } from '../../utils'
import { formatDollarAmount } from '../../utils/numbers'
import { GreyBadge } from '../Card'
import Loader, { LoadingRows } from '../Loader'
import { RowFixed } from '../Row'
import { SortButton, useSortFieldClassName } from '../SortButton'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 20px 3.5fr repeat(3, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: 1.3fr 1fr;
    > *:nth-child(1) {
      display: none;
    }
  }
`

const LinkWrapper = styled(NextLink)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const SORT_FIELD = {
  feeTier: 'feeTier',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
}

const DataRow = ({ poolData, index, chainPath }: { poolData: PoolData; index: number; chainPath: string }) => {
  const chainName = useChainNameByQuery()
  return (
    <LinkWrapper href={`/${v3InfoPath}${chainPath}/pairs/${poolData.address}`}>
      <ResponsiveGrid>
        <Text fontWeight={400}>{index + 1}</Text>
        <Text fontWeight={400}>
          <RowFixed>
            <DoubleCurrencyLogo
              address0={poolData.token0.address}
              address1={poolData.token1.address}
              chainName={chainName}
            />
            <Text ml="8px">
              {subgraphTokenSymbol[poolData.token0.address] ?? poolData.token0.symbol}/
              {subgraphTokenSymbol[poolData.token1.address] ?? poolData.token1.symbol}
            </Text>
            <GreyBadge ml="10px" style={{ fontSize: 14 }}>
              {feeTierPercent(poolData.feeTier)}
            </GreyBadge>
          </RowFixed>
        </Text>
        <Text fontWeight={400}>{formatDollarAmount(poolData.tvlUSD)}</Text>
        <Text fontWeight={400}>{formatDollarAmount(poolData.volumeUSD)}</Text>
        <Text fontWeight={400}>{formatDollarAmount(poolData.volumeUSDWeek)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const MAX_ITEMS = 10

export default function PoolTable({ poolDatas, maxItems = MAX_ITEMS }: { poolDatas: PoolData[]; maxItems?: number }) {
  const { chainId } = useActiveChainId()

  const { t } = useTranslation()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const chainPath = useMultiChainPath()

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
  }, [maxItems, poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .filter((x) => !!x && !POOL_HIDE?.[chainId]?.includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [chainId, maxItems, page, poolDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
      setPage(1)
    },
    [sortDirection, sortField],
  )

  const getSortFieldClassName = useSortFieldClassName(sortField, sortDirection)

  if (!poolDatas) {
    return <Loader />
  }

  return (
    <TableWrapper>
      {sortedPools.length > 0 ? (
        <>
          <ResponsiveGrid>
            <Text color="secondary">#</Text>
            <ClickableColumnHeader color="secondary">
              {t('Pair')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.feeTier)}
                className={getSortFieldClassName(SORT_FIELD.feeTier)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color="secondary">
              {t('TVL')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.tvlUSD)}
                className={getSortFieldClassName(SORT_FIELD.tvlUSD)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color="secondary">
              {t('Volume 24H')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.volumeUSD)}
                className={getSortFieldClassName(SORT_FIELD.volumeUSD)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color="secondary">
              {t('Volume 7D')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                className={getSortFieldClassName(SORT_FIELD.volumeUSDWeek)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
          </ResponsiveGrid>
          <Break />
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <React.Fragment key={`${poolData?.address}_Row`}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} poolData={poolData} chainPath={chainPath} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          <PageButtons>
            <Box
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <Arrow>
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
            </Box>
            <Text>{`Page ${page} of ${maxPage}`}</Text>
            <Box
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <Arrow>
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </Box>
          </PageButtons>
        </>
      ) : (
        <LoadingRows>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRows>
      )}
    </TableWrapper>
  )
}
