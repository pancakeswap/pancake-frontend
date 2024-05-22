import { useState, useMemo, useCallback, ReactElement, memo, useEffect } from 'react'
import { Text, Flex, Box, Grid, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { ChainId } from '@pancakeswap/chains'
import NoOrdersMessage from './NoOrdersMessage'
import { ORDER_CATEGORY } from '../../types'
import LoadingTable from './LoadingTable'

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  &:hover {
    cursor: pointer;
  }
`

interface ExposedProps {
  paginatedData: any[]
}

interface TableNavigationProps {
  data: any[]
  itemsPerPage?: number
  children: (exposedProps: ExposedProps) => ReactElement
  orderCategory: ORDER_CATEGORY
}

const ORDERS_PER_PAGE = 5

const TableNavigation: React.FC<TableNavigationProps> = ({
  data,
  orderCategory,
  itemsPerPage = ORDERS_PER_PAGE,
  children,
}) => {
  const { t } = useTranslation()
  const [currentPage, setPage] = useState(1)

  const total = Array.isArray(data) ? data.length : 0

  const maxPage = useMemo(() => {
    if (total) {
      return Math.ceil(total / itemsPerPage)
    }
    return 1
  }, [total, itemsPerPage])

  const onPageNext = useCallback(() => {
    setPage((page) => (page === maxPage ? page : page + 1))
  }, [maxPage])

  const onPagePrev = useCallback(() => {
    setPage((page) => (page === 1 ? page : page - 1))
  }, [])

  const from = useMemo(() => itemsPerPage * (currentPage - 1), [currentPage, itemsPerPage])
  const to = useMemo(() => itemsPerPage * currentPage, [currentPage, itemsPerPage])

  const paginatedData = useMemo(() => {
    return Array.isArray(data) ? data.slice(from, to) : []
  }, [data, from, to])

  useEffect(() => {
    setPage(1)
  }, [orderCategory])

  return (
    <>
      {children({
        paginatedData,
      })}
      {!data && <LoadingTable />}
      {data && !total && <NoOrdersMessage orderCategory={orderCategory} />}
      <Grid gridGap="16px" gridTemplateColumns={['1fr', null, null, null, '1fr 2fr 1fr']} mt="16px" mb="16px" px="16px">
        <Box />
        <Flex width="100%" justifyContent="center" alignItems="center">
          <Arrow onClick={onPagePrev}>
            <ArrowBackIcon color={currentPage === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>

          <Text>{t('Page %page% of %maxPage%', { page: currentPage, maxPage })}</Text>

          <Arrow onClick={onPageNext}>
            <ArrowForwardIcon color={currentPage === maxPage ? 'textDisabled' : 'primary'} />
          </Arrow>
        </Flex>
        <Flex width="100%" justifyContent={['center', null, null, null, 'flex-end']}>
          <SubgraphHealthIndicator chainId={ChainId.BSC} subgraphName="gelatodigital/limit-orders-bsc" inline />
        </Flex>
      </Grid>
    </>
  )
}

export default memo(TableNavigation)
