import { useEffect, useMemo, useState } from 'react'
import { Table, Th, Td, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

import { useTranslation } from 'contexts/Localization'
import Navigation from './TableNavigation'
import CompactRow from './CompactRow'
import NoOrdersMessage from './NoOrdersMessage'
import { LimitOrderTableProps } from './types'
import FullRow from './FullRow'

const ORDERS_PER_PAGE = 5

const StyledTBody = styled.tbody`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.disabled}`};
`

const OrderItemRows: React.FC<LimitOrderTableProps> = ({ orders, orderCategory, isCompact }) => {
  const [page, setPage] = useState(1)
  const { t } = useTranslation()

  // Reset to initial page when tab switched
  useEffect(() => {
    setPage(1)
  }, [orderCategory])

  const maxPage = useMemo(() => {
    if (orders?.length) {
      return Math.ceil(orders?.length / ORDERS_PER_PAGE)
    }
    return 1
  }, [orders?.length])

  const onPageNext = () => {
    setPage((currentPage) => (currentPage === maxPage ? currentPage : currentPage + 1))
  }

  const onPagePrev = () => {
    setPage((currentPage) => (currentPage === 1 ? currentPage : currentPage - 1))
  }

  if (!orders?.length) {
    return <NoOrdersMessage orderCategory={orderCategory} />
  }

  const currentPageOrders = orders.slice(ORDERS_PER_PAGE * (page - 1), ORDERS_PER_PAGE * page)

  return (
    <>
      <Table>
        {isCompact ? (
          <StyledTBody>
            {currentPageOrders.map((order) => (
              <tr key={order.id}>
                <Td>
                  <CompactRow order={order} />
                </Td>
              </tr>
            ))}
          </StyledTBody>
        ) : (
          <>
            <thead>
              <tr>
                <Th>
                  <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                    {t('From')}
                  </Text>
                </Th>
                <Th>
                  <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                    {t('To')}
                  </Text>
                </Th>
                <Th>
                  <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                    {t('Limit Price')}
                  </Text>
                </Th>
                <Th>
                  <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                    {t('Status')}
                  </Text>
                </Th>
                <Th />
              </tr>
            </thead>
            <StyledTBody>
              {currentPageOrders.map((order) => (
                <FullRow key={order.id} order={order} />
              ))}
            </StyledTBody>
          </>
        )}
      </Table>
      <Navigation currentPage={page} maxPage={maxPage} onPageNext={onPageNext} onPagePrev={onPagePrev} />
    </>
  )
}

export default OrderItemRows
