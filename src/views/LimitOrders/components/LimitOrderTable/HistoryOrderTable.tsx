import { useMemo, useState } from 'react'
import { Table, Th, Td, useMatchBreakpoints } from '@pancakeswap/uikit'

import Navigation from 'components/TableNavigation'
import { useTranslation } from 'contexts/Localization'
import CompactRow from './CompactRow'
import NoOrderTable from './NoOrderTable'
import { LimitOrderTableProps } from './types'
import HeaderCellStyle from './HeaderCellStyle'
import FullRow from './FullRow'

const ORDERS_PER_PAGE = 5

const HistoryOrderTable: React.FC<LimitOrderTableProps> = ({ isChartDisplayed, orders }) => {
  const { isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const compactMode = !isChartDisplayed || isTablet

  const maxPage = useMemo(() => {
    if (orders?.length) {
      return Math.ceil(orders?.length / ORDERS_PER_PAGE)
    }
    return 1
  }, [orders?.length])

  if (!orders?.length) {
    return <NoOrderTable />
  }

  const onPageNext = () => {
    setPage((currentPage) => (currentPage === maxPage ? currentPage : currentPage + 1))
  }

  const onPagePrev = () => {
    setPage((currentPage) => (currentPage === 1 ? currentPage : currentPage - 1))
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
                  <HeaderCellStyle>{t('Status')}</HeaderCellStyle>
                </Th>
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
      <Navigation currentPage={page} maxPage={maxPage} onPagePrev={onPagePrev} onPageNext={onPageNext} />
    </>
  )
}

export default HistoryOrderTable
