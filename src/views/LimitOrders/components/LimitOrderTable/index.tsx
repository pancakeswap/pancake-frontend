import { useState, useCallback } from 'react'
import { Flex, Card } from '@pancakeswap/uikit'

import { GelatoLimitOrdersHistory } from 'hooks/limitOrders/useGelatoLimitOrdersHistory'
import OrderItemRows from './OrderItemRows'
import OrderTab from './OrderTab'
import { ORDER_CATEGORY } from './types'

const LimitOrderTable: React.FC<{ orderHistory: GelatoLimitOrdersHistory; isCompact: boolean }> = ({
  orderHistory,
  isCompact,
}) => {
  const openOrders = [...orderHistory.open.pending, ...orderHistory.open.confirmed]
  const executedAndCancelledOrders = [
    ...orderHistory.cancelled.pending,
    ...orderHistory.cancelled.confirmed,
    ...orderHistory.executed,
  ]
  const [activeTab, setIndex] = useState<ORDER_CATEGORY>(
    openOrders.length === 0 ? ORDER_CATEGORY.History : ORDER_CATEGORY.Open,
  )
  const handleClick = useCallback((tabType: ORDER_CATEGORY) => setIndex(tabType), [])

  return (
    <Flex flex="1" justifyContent="center" mb="24px">
      <Card style={{ width: '100%', height: 'max-content' }}>
        <OrderTab onItemClick={handleClick} activeIndex={activeTab} />
        <OrderItemRows
          orderCategory={activeTab}
          orders={activeTab === ORDER_CATEGORY.Open ? openOrders : executedAndCancelledOrders}
          isCompact={isCompact}
        />
      </Card>
    </Flex>
  )
}

export default LimitOrderTable
