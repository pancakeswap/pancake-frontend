import React, { useMemo, useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import { Modal, ModalBody, Text, Button, Flex, InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { AppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { AutoRow } from '../../Layout/Row'
import Transaction from './Transaction'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function renderTransactions(transactions: TransactionDetails[]) {
  return (
    <Flex flexDirection="column">
      {transactions.map((tx) => {
        return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
      })}
    </Flex>
  )
}

const TransactionsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const allTransactions = useAllTransactions()

  const { t } = useTranslation()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <Modal title={t('Recent Transactions')} headerBackground="gradients.cardHeader" onDismiss={onDismiss}>
      {account && (
        <ModalBody>
          {!!pending.length || !!confirmed.length ? (
            <>
              <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
                <Text>{t('Recent Transactions')}</Text>
                <Button variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                  {t('clear all')}
                </Button>
              </AutoRow>
              {renderTransactions(pending)}
              {renderTransactions(confirmed)}
            </>
          ) : (
            <Text>{t('No recent transactions')}</Text>
          )}
        </ModalBody>
      )}
    </Modal>
  )
}

export default TransactionsModal
