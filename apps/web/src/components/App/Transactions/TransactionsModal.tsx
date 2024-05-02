import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Modal, ModalBody, Text } from '@pancakeswap/uikit'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { useAllSortedRecentTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { chains } from 'utils/wagmi'
import { GetXOrderReceiptResponseOrder } from 'views/Swap/x/api'
import { useRecentXOrders } from 'views/Swap/x/useRecentXOders'
import { useAccount } from 'wagmi'
import ConnectWalletButton from '../../ConnectWalletButton'
import { AutoRow } from '../../Layout/Row'
import Transaction from './Transaction'
import { XTransaction } from './XTransaction'

type XTransactionItem = {
  type: 'xOrder'
  item: GetXOrderReceiptResponseOrder
}

type TransactionItem =
  | {
      type: 'tx'
      item: TransactionDetails
    }
  | XTransactionItem

function sortByTransactionTime(a: TransactionItem, b: TransactionItem) {
  if (a.type === 'tx' && b.type === 'tx') {
    return b.item.addedTime > a.item.addedTime ? -1 : 1
  }

  if (a.type === 'xOrder' && b.type === 'xOrder') {
    return new Date(b.item.createdAt).getTime() > new Date(a.item.createdAt).getTime() ? -1 : 1
  }

  if (b.type === 'tx' && a.type === 'xOrder') {
    return b.item.addedTime > new Date(a.item.createdAt).getTime() ? -1 : 1
  }
  if (b.type === 'xOrder' && a.type === 'tx') {
    return new Date(b.item.createdAt).getTime() > a.item.addedTime ? -1 : 1
  }
  return 0
}

const TransactionsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const { address: account, chainId } = useAccount()
  const dispatch = useAppDispatch()

  const { data: recentXOrders } = useRecentXOrders({
    chainId,
    address: account,
  })

  const sortedRecentTransactions = useAllSortedRecentTransactions()

  const xOrders: XTransactionItem[] = useMemo(
    () => recentXOrders?.orders.reverse().map((order) => ({ type: 'xOrder', item: order })) ?? [],
    [recentXOrders],
  )

  const { t } = useTranslation()

  const hasTransactions = !isEmpty(sortedRecentTransactions)

  const clearAllTransactionsCallback = useCallback(() => {
    dispatch(clearAllTransactions())
  }, [dispatch])

  return (
    <Modal title={t('Recent Transactions')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      {account ? (
        <ModalBody>
          {xOrders.length > 0 || hasTransactions ? (
            <>
              <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
                <Text>{t('Recent Transactions')}</Text>
                {hasTransactions && (
                  <Button variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                    {t('clear all')}
                  </Button>
                )}
              </AutoRow>
              {hasTransactions
                ? Object.entries(sortedRecentTransactions).map(([chainId_, transactions]) => {
                    let content = <></>

                    const chainIdNumber = Number(chainId_)

                    if (chainIdNumber === chainId) {
                      content = (
                        <TransactionWithX
                          transactions={Object.values(transactions)}
                          xOrders={xOrders}
                          chainId={chainIdNumber}
                        />
                      )
                    } else {
                      content = (
                        <Flex flexDirection="column">
                          {Object.values(transactions).map((tx) => {
                            return <Transaction key={tx.hash + tx.addedTime} tx={tx} chainId={chainIdNumber} />
                          })}
                        </Flex>
                      )
                    }

                    return (
                      <div key={`transactions#${chainIdNumber}`}>
                        <Text fontSize="12px" color="textSubtle" mb="4px">
                          {chains.find((c) => c.id === chainIdNumber)?.name ?? 'Unknown network'}
                        </Text>
                        {content}
                      </div>
                    )
                  })
                : xOrders.map((order) => <XTransaction key={order.item.hash} order={order.item} />)}
            </>
          ) : (
            <Text>{t('No recent transactions')}</Text>
          )}
        </ModalBody>
      ) : (
        <ConnectWalletButton />
      )}
    </Modal>
  )
}

function TransactionWithX({
  transactions,
  xOrders = [],
  chainId,
}: {
  transactions: TransactionDetails[]
  xOrders?: TransactionItem[]
  chainId: number
}) {
  const allTransactionItems = useMemo(
    () =>
      [
        ...transactions.map(
          (t) =>
            ({
              type: 'tx',
              item: t,
            } as TransactionItem),
        ),
        ...xOrders,
      ].sort(sortByTransactionTime),
    [transactions, xOrders],
  )

  return (
    <Flex flexDirection="column">
      {allTransactionItems.map((tx) => {
        if (tx.type === 'tx') {
          return <Transaction key={tx.item.hash + tx.item.addedTime} tx={tx.item} chainId={chainId} />
        }
        return <XTransaction key={tx.item.hash} order={tx.item} />
      })}
    </Flex>
  )
}

export default TransactionsModal
