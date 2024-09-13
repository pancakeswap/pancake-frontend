import { Box, Text } from '@pancakeswap/uikit'
import { useAllSortedRecentTransactions } from 'state/transactions/hooks'
import { useTranslation } from '@pancakeswap/localization'
import isEmpty from 'lodash/isEmpty'
import { RecentTransactions } from 'components/App/Transactions/TransactionsModal'

interface WalletTransactionsProps {
  onDismiss: () => void
}

const WalletTransactions: React.FC<React.PropsWithChildren<WalletTransactionsProps>> = () => {
  const { t } = useTranslation()
  const sortedTransactions = useAllSortedRecentTransactions()

  const hasTransactions = !isEmpty(sortedTransactions)

  return (
    <Box minHeight="120px" pb="1.5rem">
      {hasTransactions ? <RecentTransactions /> : <Text textAlign="center">{t('No recent transactions')}</Text>}
    </Box>
  )
}

export default WalletTransactions
