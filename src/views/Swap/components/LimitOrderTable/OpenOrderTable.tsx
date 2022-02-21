import { Table, Th, Td, useMatchBreakpoints, MoreHorizontalIcon, SyncAltIcon, Text, useModal } from '@pancakeswap/uikit'

import { useTranslation } from 'contexts/Localization'
import { DetailLimitOrderModal } from './DetailLimitOrderModal'
import CurrencyFormat from './CurrencyFormat'
import CellFormat from './CellFormat'
import Navigation from './Navigation'
import TextIcon from './TextIcon'
import OrderRow from './OrderRow'
import NoOrderTable from './NoOrderTable'
import { LimitOrderTableProps } from './types'
import HeaderCellStyle from './HeaderCellStyle'

const OpenOrderTable: React.FC<LimitOrderTableProps> = ({ isChartDisplayed, orders }) => {
  const [openDetailLimitOrderModal] = useModal(<DetailLimitOrderModal />)
  const { isTablet } = useMatchBreakpoints()
  const oneLineMode = !isChartDisplayed || isTablet
  const { t } = useTranslation()

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
                  {/* Add key */}
                  <OrderRow order={order} onClick={openDetailLimitOrderModal} inline={isChartDisplayed || isTablet} />
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
              {/* Add key */}
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
                    <CellFormat
                      firstRow={1200}
                      secondRow={
                        <TextIcon
                          text={`${order.inputAmount.currency?.symbol}/${order.outputAmount.currency?.symbol}`}
                          icon={<SyncAltIcon />}
                        />
                      }
                    />
                  </Td>
                  <Td>
                    <MoreHorizontalIcon onClick={openDetailLimitOrderModal} />
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

export default OpenOrderTable
