import { Table, Th, Td, useMatchBreakpoints } from '@pancakeswap/uikit'

import Navigation from 'components/TableNavigation'
import CompactRow from './CompactRow'
import NoOrderTable from './NoOrderTable'
import { LimitOrderTableProps } from './types'
import { useTranslation } from 'contexts/Localization'
import HeaderCellStyle from './HeaderCellStyle'
import FullRow from './FullRow'

const HistoryOrderTable: React.FC<LimitOrderTableProps> = ({ isChartDisplayed, orders }) => {
  const { isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const compactMode = !isChartDisplayed || isTablet

  if (!orders?.length) {
    return <NoOrderTable />
  }

  return (
    <>
      <Table>
        {compactMode ? (
          <tbody>
            {orders.map((order) => (
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
      <Navigation currentPage={1} maxPage={1} onPagePrev={() => {}} onPageNext={() => {}} />
    </>
  )
}

export default HistoryOrderTable
