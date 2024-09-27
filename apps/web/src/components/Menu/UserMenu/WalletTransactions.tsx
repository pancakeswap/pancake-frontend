import { Box } from '@pancakeswap/uikit'
import { RecentTransactions } from 'components/App/Transactions/TransactionsModal'

interface WalletTransactionsProps {
  onDismiss: () => void
}

const WalletTransactions: React.FC<React.PropsWithChildren<WalletTransactionsProps>> = () => {
  return (
    <Box minHeight="120px" pb="1.5rem">
      <RecentTransactions />
    </Box>
  )
}

export default WalletTransactions
