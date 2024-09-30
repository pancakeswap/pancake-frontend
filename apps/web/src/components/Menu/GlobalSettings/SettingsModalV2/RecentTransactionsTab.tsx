import { Text } from '@pancakeswap/uikit'
import { memo } from 'react'
import { TabContent } from './TabContent'

export const RecentTransactionsTab = memo(() => {
  return (
    <TabContent>
      <Text>Recent Transactions</Text>
    </TabContent>
  )
})
