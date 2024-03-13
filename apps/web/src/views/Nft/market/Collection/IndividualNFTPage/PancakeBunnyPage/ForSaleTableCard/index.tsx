import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Card,
  Flex,
  Grid,
  PaginationButton,
  SellIcon,
  Spinner,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import chunk from 'lodash/chunk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiResponseCollectionTokens, NftToken } from 'state/nftMarket/types'
import { styled } from 'styled-components'
import { usePancakeBunnyOnSaleNfts } from '../../../../hooks/usePancakeBunnyOnSaleNfts'
import { StyledSortButton, TableHeading } from '../../shared/styles'
import ForSaleTableRows from './ForSaleTableRows'
import UpdateIndicator from './UpdateIndicator'

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
  nftMetadata: ApiResponseCollectionTokens | null
  onSuccessSale: () => void
}

const ForSaleTableCard: React.FC<React.PropsWithChildren<ForSaleTableCardProps>> = ({
  bunnyId,
  nftMetadata,
  onSuccessSale,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP
  const {
    nfts,
    refresh,
    page,
    fetchNextPage,
    direction: priceSort,
    setDirection,
    isFetchingNfts,
    isLastPage,
    isValidating,
  } = usePancakeBunnyOnSaleNfts(bunnyId, nftMetadata, itemsPerPage * 10)

  const [internalPage, setInternalPage] = useState(1)

  const switchPage = useCallback((pageNumber: number) => {
    setInternalPage(pageNumber)
  }, [])

  const togglePriceSort = useCallback(() => {
    setDirection(priceSort === 'asc' ? 'desc' : 'asc')
    setInternalPage(1)
  }, [setDirection, priceSort])

  const totalNfts = useMemo(() => {
    return nfts
      ? nfts.flat().sort((nftA, nftB) => {
          const priceA = nftA.marketData?.currentAskPrice ? new BigNumber(nftA.marketData.currentAskPrice) : BIG_ZERO
          const priceB = nftB.marketData?.currentAskPrice ? new BigNumber(nftB.marketData.currentAskPrice) : BIG_ZERO
          return priceA.gt(priceB)
            ? 1 * (priceSort === 'desc' ? -1 : 1)
            : priceA.eq(priceB)
            ? 0
            : -1 * (priceSort === 'desc' ? -1 : 1)
        })
      : []
  }, [nfts, priceSort])
  const chunkedNfts = useMemo(() => {
    return chunk(totalNfts, itemsPerPage) ?? []
  }, [totalNfts, itemsPerPage])
  const nftsOnCurrentPage = useMemo(() => {
    return chunkedNfts[internalPage - 1] ?? []
  }, [chunkedNfts, internalPage])
  const maxInternalPage = useMemo(() => {
    return Math.max(1, Math.ceil(totalNfts.length / itemsPerPage))
  }, [totalNfts, itemsPerPage])

  useEffect(() => {
    if (maxInternalPage === internalPage && !isValidating && !isLastPage) {
      fetchNextPage()
    }
  }, [internalPage, isLastPage, isValidating, maxInternalPage, page, fetchNextPage])

  useEffect(() => {
    setInternalPage(1)
  }, [bunnyId])

  useEffect(() => {
    // This is a workaround for when on sale nft's size decreased, page still indicates a data where nft's had larger size
    if (nfts && !isValidating && maxInternalPage < internalPage) {
      setInternalPage(maxInternalPage)
    }
  }, [nfts, page, isValidating, maxInternalPage, internalPage])

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
              nftsForSale={nftsOnCurrentPage as NftToken[]}
              onSuccessSale={() => {
                refresh()
                onSuccessSale?.()
              }}
            />
            <PaginationButton currentPage={internalPage} maxPage={maxInternalPage} setCurrentPage={switchPage} />
          </Flex>
        </>
      ) : isFetchingNfts ? (
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
