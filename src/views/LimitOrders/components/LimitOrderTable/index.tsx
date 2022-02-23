import { useState, useCallback } from 'react'
import { Flex, Card, Box } from '@pancakeswap/uikit'

import useGelatoLimitOrdersHistory from 'hooks/limitOrders/useGelatoLimitOrdersHistory'
import OpenOrderTable from './OpenOrderTable'
import HistoryOrderTable from './HistoryOrderTable'
import OrderTab from './OrderTab'
import { TAB_TYPE } from './types'

const LimitOrderTable: React.FC<{ isChartDisplayed: boolean }> = ({ isChartDisplayed }) => {
  const [activeTab, setIndex] = useState<TAB_TYPE>(TAB_TYPE.Open)
  const handleClick = useCallback((tabType: TAB_TYPE) => setIndex(tabType), [])

  const ordersHistory = useGelatoLimitOrdersHistory()

  // TODO: add sort by date
  const openOrders = [...ordersHistory.open.pending, ...ordersHistory.open.confirmed]
  const executedAndCancelledOrders = [
    ...ordersHistory.cancelled.pending,
    ...ordersHistory.cancelled.confirmed,
    ...ordersHistory.executed,
  ]

  return (
    <Flex mt={isChartDisplayed ? ['56px', '56px', '56px', '24px'] : '24px'} width="100%" justifyContent="center">
      <Card style={{ width: isChartDisplayed ? '50%' : '328px' }}>
        <OrderTab onItemClick={handleClick} activeIndex={activeTab} />
        {TAB_TYPE.Open === activeTab ? (
          <OpenOrderTable orders={openOrders} isChartDisplayed={isChartDisplayed} />
        ) : (
          <HistoryOrderTable orders={executedAndCancelledOrders} isChartDisplayed={isChartDisplayed} />
        )}
      </Card>
      {isChartDisplayed && <Box width="328px" mx={['24px', '24px', '24px', '40px']} />}
    </Flex>
  )
}

export default LimitOrderTable
