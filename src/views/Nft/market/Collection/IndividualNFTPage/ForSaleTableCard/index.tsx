import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Flex,
  Card,
  Grid,
  SellIcon,
  Text,
  ArrowBackIcon,
  ArrowForwardIcon,
  useMatchBreakpoints,
  ArrowUpIcon,
  ArrowDownIcon,
  Button,
  Spinner,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { NftToken } from 'state/nftMarket/types'
import ForSaleTableRows from './ForSaleTableRows'
import { StyledSortButton } from './styles'

const ITEMS_PER_PAGE_DESKTOP = 10
const ITEMS_PER_PAGE_MOBILE = 5

const StyledCard = styled(Card)<{ hasManyPages: boolean }>`
  width: 100%;
  & > div:first-child {
    ${({ hasManyPages }) => (hasManyPages ? 'min-height: 480px;' : null)}
    display: flex;
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.md} {
      ${({ hasManyPages }) => (hasManyPages ? 'min-height: 850px;' : null)}
    }
  }
`

const TableHeading = styled(Grid)`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

interface ForSaleTableCardProps {
  nftsForSale: NftToken[]
  bunnyId: string
  totalForSale: number
  priceSort: 'asc' | 'desc'
  isFetchingMoreNfts: boolean
  togglePriceSort: () => void
  loadMore: (orderDirection: 'asc' | 'desc') => void
}

const ForSaleTableCard: React.FC<ForSaleTableCardProps> = ({
  nftsForSale,
  bunnyId,
  totalForSale,
  loadMore,
  isFetchingMoreNfts,
  priceSort,
  togglePriceSort,
}) => {
  const [page, setPage] = useState(1)
  const { isMobile } = useMatchBreakpoints()
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP

  const { t } = useTranslation()
  const { theme } = useTheme()

  useEffect(() => {
    // If user clicks on other NFT at the bottom of the page - load new NFT table starting on page 1
    // Same for reversing sorting direction
    setPage(1)
  }, [bunnyId, priceSort])

  const needsExtraPage = nftsForSale.length % itemsPerPage !== 0
  let maxPage = Math.floor(nftsForSale.length / itemsPerPage)
  if (needsExtraPage) {
    maxPage += 1
  }

  const nftsOnCurrentPage = nftsForSale.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const switchPage = (pageNumber: number) => {
    setPage(pageNumber)
  }

  const loadMoreHandler = () => {
    loadMore(priceSort)
  }

  const loadMoreButton = isFetchingMoreNfts ? (
    <Flex width="96px" justifyContent="center">
      <Spinner size={32} />
    </Flex>
  ) : (
    <Button variant="primary" scale="xs" ml="12px" onClick={loadMoreHandler}>
      {t('Load more')}
    </Button>
  )

  return (
    <StyledCard hasManyPages={maxPage > 1}>
      <Grid
        flex="0 1 auto"
        gridTemplateColumns="34px 1fr"
        alignItems="center"
        height="72px"
        px="24px"
        borderBottom={`1px solid ${theme.colors.cardBorder}`}
      >
        <SellIcon width="24px" height="24px" />
        <Text bold>{t('For Sale (%num%)', { num: totalForSale.toLocaleString() })}</Text>
      </Grid>
      {nftsOnCurrentPage.length > 0 ? (
        <>
          <TableHeading flex="0 1 auto" gridTemplateColumns="2fr 2fr 1fr" py="12px">
            <StyledSortButton type="button" onClick={togglePriceSort}>
              <Flex alignItems="center">
                <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px" px="24px">
                  {t('Price')}
                </Text>
                {priceSort === 'asc' ? <ArrowUpIcon color="textSubtle" /> : <ArrowDownIcon color="textSubtle" />}
              </Flex>
            </StyledSortButton>
            <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px">
              {t('Owner')}
            </Text>
          </TableHeading>
          <Flex flex="1 1 auto" flexDirection="column" justifyContent="space-between" height="100%">
            <ForSaleTableRows nftsForSale={nftsOnCurrentPage} />
            <PageButtons>
              <Arrow
                onClick={() => {
                  switchPage(page === 1 ? page : page - 1)
                }}
              >
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
              {page === maxPage ? (
                loadMoreButton
              ) : (
                <Arrow
                  onClick={() => {
                    switchPage(page === maxPage ? page : page + 1)
                  }}
                >
                  <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
                </Arrow>
              )}
            </PageButtons>
          </Flex>
        </>
      ) : (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Text>{t('No items for sale')}</Text>
        </Flex>
      )}
    </StyledCard>
  )
}

export default ForSaleTableCard
