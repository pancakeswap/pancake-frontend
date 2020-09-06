import { useContext } from 'react'
import { Context } from '../contexts/Transactions'

const usePendingTransactions = () => {
  const { transactions } = useContext(Context)
  const pendingTransactions = Object.keys(transactions)
    .map((txHash) => transactions[txHash])
    .filter((tx) => !tx.receipt)
  return pendingTransactions
}

export default usePendingTransactions
