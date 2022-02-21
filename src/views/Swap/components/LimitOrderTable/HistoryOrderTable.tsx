import { Table, Th, Td, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

import CurrencyFormat from './CurrencyFormat'
import CellFormat from './CellFormat'
import Navigation from 'components/TableNavigation'
import OrderRow from './OrderRow'
import NoOrderTable from './NoOrderTable'
import { LimitOrderTableProps } from './types'
import { useTranslation } from 'contexts/Localization'
import HeaderCellStyle from './HeaderCellStyle'

const HistoryOrderTable: React.FC<LimitOrderTableProps> = ({ isChartDisplayed, orders }) => {
  const { isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const oneLineMode = !isChartDisplayed || isTablet

  if (!orders?.length) {
    return <NoOrderTable />
  }

  return (
    <>
      <Table>
        {oneLineMode ? (
          <tbody>
            {orders.map((order) => (
              <tr>
                <Td>
                  <OrderRow order={order} inline={isChartDisplayed || isTablet} />
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
                <tr>
                  <Td>
                    <CellFormat
                      firstRow={1200}
                      secondRow={<CurrencyFormat bold currency={order.inputAmount.currency} />}
                    />
                  </Td>
                  <Td>
                    <CellFormat
                      firstRow={1200}
                      secondRow={<CurrencyFormat bold currency={order.outputAmount.currency} />}
                    />
                  </Td>
                  <Td>
                    <Text color="failure">{t('Canceled')}</Text>
                  </Td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </Table>
      <Navigation />
    </>
  )
}

export default HistoryOrderTable
