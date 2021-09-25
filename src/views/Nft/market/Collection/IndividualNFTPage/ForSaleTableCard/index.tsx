import React, { useState } from 'react'
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
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { NftToken } from 'state/nftMarket/types'
import ForSaleTableRows from './ForSaleTableRows'

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
  totalForSale: number
}

const ForSaleTableCard: React.FC<ForSaleTableCardProps> = ({ nftsForSale, totalForSale }) => {
  const [page, setPage] = useState(1)
  const { isMobile } = useMatchBreakpoints()
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP
  const [displayedCollectibles, setDisplayedCollectibles] = useState(nftsForSale.slice(0, itemsPerPage - 1))
  const { t } = useTranslation()
  const { theme } = useTheme()

  let maxPage = Math.floor(nftsForSale.length / itemsPerPage) + 1
  if (nftsForSale.length % itemsPerPage === 0) {
    maxPage = Math.floor(nftsForSale.length / itemsPerPage)
  }

  const switchPage = (pageNumber: number) => {
    setPage(pageNumber)
    setDisplayedCollectibles(nftsForSale.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage))
  }

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
      <TableHeading flex="0 1 auto" gridTemplateColumns="2fr 2fr 1fr" py="12px">
        <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px" px="24px">
          {t('Price')}
        </Text>
        <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px">
          {t('Owner')}
        </Text>
      </TableHeading>
      <Flex flex="1 1 auto" flexDirection="column" justifyContent="space-between" height="100%">
        <ForSaleTableRows nftsForSale={displayedCollectibles} />
        <PageButtons>
          <Arrow
            onClick={() => {
              switchPage(page === 1 ? page : page - 1)
            }}
          >
            <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>
          <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
          <Arrow
            onClick={() => {
              switchPage(page === maxPage ? page : page + 1)
            }}
          >
            <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
          </Arrow>
        </PageButtons>
      </Flex>
    </StyledCard>
  )
}

export default ForSaleTableCard
