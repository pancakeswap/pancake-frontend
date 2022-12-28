import { useState, useCallback, memo, useMemo } from 'react'
import { Flex, Card, ButtonTabMenu } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useGelatoLimitOrdersHistory from '../../hooks/useGelatoLimitOrdersHistory'

import { ORDER_CATEGORY } from '../../types'

import CompactLimitOrderTable from './CompactLimitOrderTable'
import SpaciousLimitOrderTable from './SpaciousLimitOrderTable'
import Navigation from './TableNavigation'

const OrderTable: React.FC<React.PropsWithChildren<{ isCompact: boolean; orderCategory: ORDER_CATEGORY }>> = memo(
  ({ orderCategory, isCompact }) => {
    const orders = useGelatoLimitOrdersHistory(orderCategory)

    return (
      <Navigation data={orders} orderCategory={orderCategory}>
        {({ paginatedData }) =>
          isCompact ? (
            <CompactLimitOrderTable orders={paginatedData} />
          ) : (
            <SpaciousLimitOrderTable orders={paginatedData} />
          )
        }
      </Navigation>
    )
  },
)

const LimitOrderTable: React.FC<React.PropsWithChildren<{ isCompact: boolean }>> = ({ isCompact }) => {
  const { t } = useTranslation()
  const [activeTab, setIndex] = useState<ORDER_CATEGORY>(ORDER_CATEGORY.Open)
  const handleClick = useCallback((tabType: ORDER_CATEGORY) => setIndex(tabType), [])
  const tabMenuItems = useMemo(() => {
    return [t('Open Orders'), t('Expired Order'), t('Order History')]
  }, [t])

  return (
    <Flex flex="1" justifyContent="center" mb="24px">
      <Card style={{ width: '100%', height: 'max-content' }}>
        <ButtonTabMenu itemList={tabMenuItems} onItemClick={handleClick} activeIndex={activeTab} />
        <OrderTable orderCategory={activeTab} isCompact={isCompact} />
      </Card>
    </Flex>
  )
}

export default memo(LimitOrderTable)
