import { AutoColumn, Box, Text } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { POOL_HIDE, v3InfoPath } from '../../constants'
import { PoolData } from '../../types'
import { feeTierPercent } from '../../utils'
import { formatDollarAmount } from '../../utils/numbers'
import { DarkGreyCard, GreyBadge } from '../Card'
import Loader, { LoadingRows } from '../Loader'
import { RowFixed } from '../Row'
import { Arrow, Break, PageButtons } from '../shared'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 20px 3.5fr repeat(3, 1fr);

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
    grid-template-columns: 2.5fr repeat(1, 1fr);
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

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  return (
    <LinkWrapper href={`/${v3InfoPath}/pools/${poolData.address}`}>
      <ResponsiveGrid>
        <Text fontWeight={400}>{index + 1}</Text>
        <Text fontWeight={400}>
          <RowFixed>
            <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} />
            <Text ml="8px">
              {poolData.token0.symbol}/{poolData.token1.symbol}
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

  // theming
  const { theme } = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

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
          .filter((x) => !!x && !POOL_HIDE[chainId].includes(x.address))
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
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    },
    [sortDirection, sortField],
  )

  if (!poolDatas) {
    return <Loader />
  }

  return (
    <Wrapper>
      {sortedPools.length > 0 ? (
        <AutoColumn gap="16px">
          <ResponsiveGrid>
            <Text color={theme.colors.textSubtle}>#</Text>
            <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.feeTier)}>
              Pool {arrow(SORT_FIELD.feeTier)}
            </Text>
            <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              TVL {arrow(SORT_FIELD.tvlUSD)}
            </Text>
            <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              Volume 24H {arrow(SORT_FIELD.volumeUSD)}
            </Text>
            <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}>
              Volume 7D {arrow(SORT_FIELD.volumeUSDWeek)}
            </Text>
          </ResponsiveGrid>
          <Break />
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <React.Fragment key={`${poolData?.address}_Row`}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} poolData={poolData} />
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
              <Arrow faded={page === 1}>←</Arrow>
            </Box>
            <Text>{`Page ${page} of ${maxPage}`}</Text>
            <Box
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <Arrow faded={page === maxPage}>→</Arrow>
            </Box>
          </PageButtons>
        </AutoColumn>
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
    </Wrapper>
  )
}
