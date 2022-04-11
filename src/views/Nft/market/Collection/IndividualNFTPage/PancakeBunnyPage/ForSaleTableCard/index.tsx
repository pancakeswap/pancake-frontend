import { useCallback, useEffect } from 'react'
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
  } = usePancakeBunnyOnSaleNfts(bunnyId, nftMetadata, itemsPerPage)

  const { t } = useTranslation()
  const { theme } = useTheme()

  const togglePriceSort = useCallback(() => {
    setDirection(priceSort === 'asc' ? 'desc' : 'asc')
  }, [setDirection, priceSort])

  const isLoading = nfts ? isValidating && nfts.length < page : true
  const nftsOnCurrentPage = !isLoading ? (nfts.length < page ? nfts[nfts.length - 1] : nfts[page - 1]) : []

  useEffect(() => {
    // This is a workaround for when on sale nft's size decreased, page still indicates a data where nft's had larger size
    if (nfts && !isLoading && nfts.length < page) {
      setPage(nfts.length)
    }
  }, [nfts, page, setPage, isLoading])

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
                  if (page !== 1) {
                    setPage(page - 1)
                  }
                }}
              >
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page%', { page })}</Text>
              <Arrow
                onClick={() => {
                  if (!isLastPage) {
                    setPage(page + 1)
                  }
                }}
              >
                <ArrowForwardIcon color={isLastPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </Flex>
        </>
      ) : isLoading ? (
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
