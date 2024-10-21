import { RecentTransactions } from 'components/App/Transactions/TransactionsModal'
import { memo } from 'react'
import { TabContent } from './TabContent'

interface RecentTransactionsTabProps {
  ariaId?: string
}

export const RecentTransactionsTab = memo(({ ariaId }: RecentTransactionsTabProps) => {
  return (
    <TabContent id={`${ariaId}_motion-tabpanel-1`} role="tabpanel" aria-labelledby={`${ariaId}_motion-tab-1`}>
      <RecentTransactions />
    </TabContent>
  )
})
