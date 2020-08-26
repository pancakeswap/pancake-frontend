import { useContext } from 'react'

import { Context } from '../contexts/Transactions'

const useTransactionAdder = () => {
  const { onAddTransaction } = useContext(Context)
  return { onAddTransaction }
}

export default useTransactionAdder