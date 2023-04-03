import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AutoColumn,
  Box,
  Flex,
  NextLinkFromReactRouter,
  Text,
} from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMultiChainPath, useGetChainName } from 'state/info/hooks'
import styled from 'styled-components'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { TOKEN_HIDE, v3InfoPath } from '../../constants'
import { TokenData } from '../../types'
import { formatDollarAmount } from '../../utils/numbers'
import HoverInlineText from '../HoverInlineText'
import Loader, { LoadingRows } from '../Loader'
import Percent from '../Percent'
import { RowFixed } from '../Row'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 20px 3fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: repeat(2, 1fr);
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
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

const DataRow = ({ tokenData, index, chainPath }: { tokenData: TokenData; index: number; chainPath: string }) => {
  const { theme } = useTheme()
  const chainName = useGetChainName()
  return (
    <LinkWrapper to={`/${v3InfoPath}${chainPath}/tokens/${tokenData.address}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <RowFixed>
            <ResponsiveLogo address={tokenData.address} chainName={chainName} />
          </RowFixed>
          <Text style={{ marginLeft: '6px' }}>
            <Text ml="8px">{tokenData.symbol}</Text>
          </Text>
          <Text style={{ marginLeft: '10px' }}>
            <RowFixed>
              <HoverInlineText text={tokenData.name} />
              <Text ml="8px" color={theme.colors.text99}>
                ({tokenData.symbol})
              </Text>
            </RowFixed>
          </Text>
        </Flex>
        <Text fontWeight={400}>{formatDollarAmount(tokenData.priceUSD)}</Text>
        <Text fontWeight={400}>
          <Percent value={tokenData.priceUSDChange} fontWeight={400} />
        </Text>
        <Text fontWeight={400}>{formatDollarAmount(tokenData.volumeUSD)}</Text>
        <Text fontWeight={400}>{formatDollarAmount(tokenData.tvlUSD)}</Text>
      </ResponsiveGrid>{' '}
    </LinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

export default function TokenTable({
  tokenDatas,
  maxItems = MAX_ITEMS,
}: {
  tokenDatas: TokenData[] | undefined
  maxItems?: number
}) {
  const { chainId } = useActiveChainId()
  const chainPath = useMultiChainPath()

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
    if (tokenDatas) {
      if (tokenDatas.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
    }
  }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? tokenDatas
          .filter((x) => !!x && !TOKEN_HIDE[chainId].includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, , sortField, sortDirection, chainId])

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

  if (!tokenDatas) {
    return <Loader />
  }

  return (
    <TableWrapper>
      {sortedTokens.length > 0 ? (
        <AutoColumn gap="16px">
          <ResponsiveGrid>
            <Text color={theme.colors.textSubtle}>#</Text>
            <ClickableColumnHeader color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.name)}>
              Name {arrow(SORT_FIELD.name)}
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.priceUSD)}>
              Price {arrow(SORT_FIELD.priceUSD)}
            </ClickableColumnHeader>
            <ClickableColumnHeader
              color={theme.colors.textSubtle}
              onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
            >
              Price Change {arrow(SORT_FIELD.priceUSDChange)}
            </ClickableColumnHeader>
            {/* <ClickableText onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
            <ClickableColumnHeader color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              Volume 24H {arrow(SORT_FIELD.volumeUSD)}
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              TVL {arrow(SORT_FIELD.tvlUSD)}
            </ClickableColumnHeader>
          </ResponsiveGrid>

          <Break />
          {sortedTokens.map((data, i) => {
            if (data) {
              return (
                <React.Fragment key={`${data.address}_sortedTokens`}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} chainPath={chainPath} />
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
    </TableWrapper>
  )
}
