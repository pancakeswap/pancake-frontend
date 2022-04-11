import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import chunk from 'lodash/chunk'
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
  Spinner,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { ApiResponseCollectionTokens } from 'state/nftMarket/types'
import ForSaleTableRows from './ForSaleTableRows'
import { StyledSortButton, TableHeading } from '../../shared/styles'
import UpdateIndicator from './UpdateIndicator'
import { Arrow, PageButtons } from '../../../../components/PaginationButtons'
import { usePancakeBunnyOnSaleNfts } from '../../../../hooks/usePancakeBunnyOnSaleNfts'

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

interface ForSaleTableCardProps {
  bunnyId: string
  nftMetadata: ApiResponseCollectionTokens
  onSuccessSale: () => void
}

const ForSaleTableCard: React.FC<ForSaleTableCardProps> = ({ bunnyId, nftMetadata, onSuccessSale }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP
  const {
    nfts,
    refresh,
    page,
    setPage,
    direction: priceSort,
    setDirection,
    isLastPage,
    isValidating,
  } = usePancakeBunnyOnSaleNfts(bunnyId, nftMetadata, itemsPerPage * 10)

  const [internalPage, setInternalPage] = useState(1)

  const switchPage = (pageNumber: number) => {
    setInternalPage(pageNumber)
  }

  const togglePriceSort = useCallback(() => {
    setDirection(priceSort === 'asc' ? 'desc' : 'asc')
    setInternalPage(1)
  }, [setDirection, priceSort])

  const totalNfts = nfts ? nfts.flat() : []
  const chunkedNfts = chunk(totalNfts, itemsPerPage) ?? []
  const nftsOnCurrentPage = chunkedNfts[internalPage - 1] ?? []
  const maxInternalPage = Math.max(1, Math.ceil(totalNfts.length / itemsPerPage))

  useEffect(() => {
    if (maxInternalPage === internalPage && !isValidating && !isLastPage) {
      setPage(page + 1)
    }
  }, [internalPage, isLastPage, isValidating, maxInternalPage, page, setPage])

  useEffect(() => {
    setInternalPage(1)
  }, [bunnyId])

  useEffect(() => {
    // This is a workaround for when on sale nft's size decreased, page still indicates a data where nft's had larger size
    if (nfts && !isValidating && maxInternalPage < internalPage) {
      setInternalPage(maxInternalPage)
    }
  }, [nfts, page, setPage, isValidating, maxInternalPage, internalPage])

  return (
    <StyledCard hasManyPages>
      <Grid
        flex="0 1 auto"
        gridTemplateColumns="34px 1fr 48px"
        alignItems="center"
        height="72px"
        px="24px"
        borderBottom={`1px solid ${theme.colors.cardBorder}`}
      >
        <SellIcon width="24px" height="24px" />
        <Text bold>{t('For Sale')}</Text>
        <UpdateIndicator isFetchingPancakeBunnies={isValidating} />
      </Grid>
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
      {nftsOnCurrentPage.length > 0 ? (
        <>
          <Flex flex="1 1 auto" flexDirection="column" justifyContent="space-between" height="100%">
            <ForSaleTableRows
              nftsForSale={nftsOnCurrentPage}
              onSuccessSale={() => {
                refresh()
                onSuccessSale?.()
              }}
            />
            <PageButtons>
              <Arrow
                onClick={() => {
                  switchPage(internalPage === 1 ? internalPage : internalPage - 1)
                }}
              >
                <ArrowBackIcon color={internalPage === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page% of %maxPage%', { page: internalPage, maxPage: maxInternalPage })}</Text>
              <Arrow
                onClick={() => {
                  switchPage(internalPage === maxInternalPage ? internalPage : internalPage + 1)
                }}
              >
                <ArrowForwardIcon color={internalPage === maxInternalPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </Flex>
        </>
      ) : !nfts ? (
        <Flex justifyContent="center" alignItems="center" marginTop={30}>
          <Spinner size={42} />
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Text>{t('No items for sale')}</Text>
        </Flex>
      )}
    </StyledCard>
  )
}

export default ForSaleTableCard
