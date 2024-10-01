import { RecentTransactions } from 'components/App/Transactions/TransactionsModal'
import { memo } from 'react'
import { TabContent } from './TabContent'

export const RecentTransactionsTab = memo(() => {
  return (
    <TabContent>
      <RecentTransactions />
    </TabContent>
  )
})
