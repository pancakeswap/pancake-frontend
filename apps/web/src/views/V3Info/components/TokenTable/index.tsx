import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AutoColumn,
  Box,
  Flex,
  NextLinkFromReactRouter,
  SortArrowIcon,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
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
import { SortButton, useSortFieldClassName } from '../SortButton'

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
    grid-template-columns: 1.3fr 1fr;
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
  const chainName = useChainNameByQuery()
  const { isMobile } = useMatchBreakpoints()
  return (
    <LinkWrapper to={`/${v3InfoPath}${chainPath}/tokens/${tokenData.address}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <RowFixed>
            <ResponsiveLogo address={tokenData.address} chainName={chainName} />
          </RowFixed>

          <Text style={{ marginLeft: '10px' }}>
            <RowFixed>
              {isMobile ? <HoverInlineText text={tokenData.symbol} /> : <HoverInlineText text={tokenData.name} />}
              {!isMobile && (
                <Text ml="8px" color={theme.colors.text99}>
                  ({tokenData.symbol})
                </Text>
              )}
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
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const chainPath = useMultiChainPath()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
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
          .filter((x) => !!x && !TOKEN_HIDE?.[chainId]?.includes(x.address))
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
      setPage(1)
    },
    [sortDirection, sortField],
  )
  const getSortFieldClassName = useSortFieldClassName(sortField, sortDirection)

  if (!tokenDatas) {
    return <Loader />
  }

  return (
    <TableWrapper>
      {sortedTokens.length > 0 ? (
        <AutoColumn gap="16px">
          <ResponsiveGrid>
            <Text color="secondary">#</Text>
            <ClickableColumnHeader color="secondary">
              {t('Name')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.name)}
                className={getSortFieldClassName(SORT_FIELD.name)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color="secondary">
              {t('Price')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.priceUSD)}
                className={getSortFieldClassName(SORT_FIELD.priceUSD)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color="secondary">
              {t('Price Change')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
                className={getSortFieldClassName(SORT_FIELD.priceUSDChange)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            {/* <ClickableText onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
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
