import { useState, useCallback } from 'react'
import { Flex, Card, Box } from '@pancakeswap/uikit'

import OpenOrderTable from './OpenOrderTable'
import HistoryOrderTable from './HistoryOrderTable'
import OrderTab from './OrderTab'
import { TAB_TYPE, LimitOrderTableProps } from './types'

const LimitOrderTable: React.FC<LimitOrderTableProps> = ({ isChartDisplayed, orders }) => {
  const [activeTab, setIndex] = useState<TAB_TYPE>(TAB_TYPE.Open)
  const handleClick = useCallback((tabType: TAB_TYPE) => setIndex(tabType), [])

  return (
    <Flex mt={isChartDisplayed ? ['56px', '56px', '56px', '24px'] : '24px'} width="100%" justifyContent="center">
      <Card style={{ width: isChartDisplayed ? '50%' : '328px' }}>
        <OrderTab onItemClick={handleClick} activeIndex={activeTab} />
        {TAB_TYPE.Open === activeTab ? (
          <OpenOrderTable orders={orders} isChartDisplayed={isChartDisplayed} />
        ) : (
          <HistoryOrderTable orders={orders} isChartDisplayed={isChartDisplayed} />
        )}
      </Card>
      {isChartDisplayed && <Box width="328px" mx={['24px', '24px', '24px', '40px']} />}
    </Flex>
  )
}

export default LimitOrderTable
