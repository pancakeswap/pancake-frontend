import { useMemo, useState } from 'react'
import { Table, Th, Td, useMatchBreakpoints } from '@pancakeswap/uikit'

import { useTranslation } from 'contexts/Localization'
import Navigation from 'components/TableNavigation'
import CompactRow from './CompactRow'
import NoOrderTable from './NoOrderTable'
import { LimitOrderTableProps } from './types'
import HeaderCellStyle from './HeaderCellStyle'
import FullRow from './FullRow'

const ORDERS_PER_PAGE = 5

const OpenOrderTable: React.FC<LimitOrderTableProps> = ({ isChartDisplayed, orders }) => {
  const { isTablet } = useMatchBreakpoints()
  const [page, setPage] = useState(1)
  const compactMode = !isChartDisplayed || isTablet
  const { t } = useTranslation()

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
    return <NoOrderTable />
  }

  const currentPageOrders = orders.slice(ORDERS_PER_PAGE * (page - 1), ORDERS_PER_PAGE * page)

  return (
    <>
      <Table>
        {compactMode ? (
          <tbody>
            {currentPageOrders.map((order) => (
              <tr key={order.id}>
                <Td>
                  <CompactRow order={order} />
                </Td>
              </tr>
            ))}
          </tbody>
        ) : (
          <>
            <thead>
              <tr>
                <Th>
                  <HeaderCellStyle>{t('From')}</HeaderCellStyle>
                </Th>
                <Th>
                  <HeaderCellStyle>{t('To')}</HeaderCellStyle>
                </Th>
                <Th>
                  <HeaderCellStyle>{t('Limit Price')}</HeaderCellStyle>
                </Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <FullRow key={order.id} order={order} />
              ))}
            </tbody>
          </>
        )}
      </Table>
      <Navigation currentPage={page} maxPage={maxPage} onPageNext={onPageNext} onPagePrev={onPagePrev} />
    </>
  )
}

export default OpenOrderTable
