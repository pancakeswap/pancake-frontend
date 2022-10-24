import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { chains } from 'config/chains'
import isEmpty from 'lodash/isEmpty'
import { clearAllTransactions } from 'state/transactions/actions'
import { useAllSortedRecentTransactions } from 'state/transactions/hooks'
import { useTransactionState } from 'state/transactions/reducer'
import styled from 'styled-components'
import TransactionRow from './TransactionRow'

const TransactionsContainer = styled(Box)`
  max-height: 300px;
  overflow-y: auto;
`

const WalletTransactions: React.FC<React.PropsWithChildren> = () => {
  const [, dispatch] = useTransactionState()
  const { t } = useTranslation()
  const sortedTransactions = useAllSortedRecentTransactions()
  const hasTransactions = !isEmpty(sortedTransactions)

  const handleClearAll = () => {
    dispatch(clearAllTransactions())
  }

  return (
    <Box minHeight="120px">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold">
          {t('Recent Transactions')}
        </Text>
        {hasTransactions && (
          <Button scale="sm" onClick={handleClearAll} variant="text" px="0">
            {t('Clear all')}
          </Button>
        )}
      </Flex>
      {hasTransactions ? (
        <TransactionsContainer>
          {Object.entries(sortedTransactions).map(([chainId, transactions]) => {
            const chainIdNumber = Number(chainId)
            return (
              <Box key={chainId}>
                <Text fontSize="12px" color="textSubtle" mb="4px">
                  {chains.find((c) => c.id === chainIdNumber)?.name ?? 'Unknown network'}
                </Text>
                {Object.values(transactions).map((txn) => (
                  <TransactionRow key={txn.hash} txn={txn} chainId={chainIdNumber} />
                ))}
              </Box>
            )
          })}
        </TransactionsContainer>
      ) : (
        <Text textAlign="center">{t('No recent transactions')}</Text>
      )}
    </Box>
  )
}

export default WalletTransactions
