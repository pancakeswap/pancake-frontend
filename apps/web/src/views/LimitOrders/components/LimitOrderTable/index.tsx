import { useState, useCallback, memo, useMemo } from 'react'
import { Flex, Card, ButtonTabMenu } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useGelatoLimitOrdersHistory from '../../hooks/useGelatoLimitOrdersHistory'

import { ORDER_CATEGORY } from '../../types'

import Navigation from './TableNavigation'
import ExistingLimitOrderTable from './ExistingLimitOrderTable'

const OrderTable: React.FC<React.PropsWithChildren<{ isCompact: boolean; orderCategory: ORDER_CATEGORY }>> = memo(
  ({ orderCategory }) => {
    const orders = useGelatoLimitOrdersHistory(orderCategory)

    return (
      <Navigation data={orders} orderCategory={orderCategory}>
        {({ paginatedData }) => <ExistingLimitOrderTable orders={paginatedData} />}
      </Navigation>
    )
  },
)

const LimitOrderTable: React.FC<React.PropsWithChildren<{ isCompact: boolean }>> = ({ isCompact }) => {
  const { t } = useTranslation()
  const [activeTab, setIndex] = useState<ORDER_CATEGORY>(ORDER_CATEGORY.Existing)
  const handleClick = useCallback((tabType: ORDER_CATEGORY) => setIndex(tabType), [])
  const tabMenuItems = useMemo(() => {
    if (activeTab === ORDER_CATEGORY.Existing) {
      return [t('Existing Orders')]
    }
    return [t('Open Orders'), t('Expired Order'), t('Order History')]
  }, [t, activeTab])

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
