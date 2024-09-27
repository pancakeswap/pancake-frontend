import { useTranslation } from '@pancakeswap/localization'
import { Button, InjectedModalProps, Modal, ModalBody, Text } from '@pancakeswap/uikit'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { TransactionList } from '@pancakeswap/widgets-internal'
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
    return b.item.addedTime > a.item.addedTime ? 1 : -1
  }

  if (a.type === 'xOrder' && b.type === 'xOrder') {
    return new Date(b.item.createdAt).getTime() > new Date(a.item.createdAt).getTime() ? 1 : -1
  }

  if (b.type === 'tx' && a.type === 'xOrder') {
    return b.item.addedTime > new Date(a.item.createdAt).getTime() ? 1 : -1
  }
  if (b.type === 'xOrder' && a.type === 'tx') {
    return new Date(b.item.createdAt).getTime() > a.item.addedTime ? 1 : -1
  }
  return 0
}

export function RecentTransactions() {
  const { address: account, chainId } = useAccount()
  const dispatch = useAppDispatch()

  const { data: recentXOrders } = useRecentXOrders({
    chainId,
    address: account,
    refetchInterval: 10_000,
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
    <>
      {account ? (
        xOrders.length > 0 || hasTransactions ? (
          <>
            <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
              <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold">
                {t('Recent Transactions')}
              </Text>
              {hasTransactions && (
                <Button variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                  {t('clear all')}
                </Button>
              )}
            </AutoRow>
            {hasTransactions ? (
              Object.entries(sortedRecentTransactions).map(([chainId_, transactions]) => {
                const chainIdNumber = Number(chainId_)
                const content = (
                  <TransactionWithX
                    transactions={Object.values(transactions)}
                    xOrders={chainIdNumber === chainId ? xOrders : undefined}
                    chainId={chainIdNumber}
                  />
                )

                return (
                  <div key={`transactions#${chainIdNumber}`}>
                    <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
                      <Text fontSize="12px" color="textSubtle" mb="4px">
                        {chains.find((c) => c.id === chainIdNumber)?.name ?? 'Unknown network'}
                      </Text>
                    </AutoRow>
                    {content}
                  </div>
                )
              })
            ) : (
              <TransactionWithX xOrders={xOrders} chainId={chainId} />
            )}
          </>
        ) : (
          <Text>{t('No recent transactions')}</Text>
        )
      ) : (
        <ConnectWalletButton />
      )}
    </>
  )
}

const TransactionsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Recent Transactions')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <ModalBody>
        <RecentTransactions />
      </ModalBody>
    </Modal>
  )
}

function TransactionWithX({
  transactions,
  xOrders = [],
  chainId,
}: {
  transactions?: TransactionDetails[]
  xOrders?: TransactionItem[]
  chainId?: number
}) {
  const allTransactionItems = useMemo(
    () =>
      [
        ...(transactions || []).map(
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

  if (!chainId) {
    return null
  }

  return (
    <TransactionList>
      {allTransactionItems.map((tx) => {
        if (tx.type === 'tx') {
          return <Transaction key={tx.item.hash + tx.item.addedTime} tx={tx.item} chainId={chainId} />
        }
        return <XTransaction key={tx.item.hash} order={tx.item} />
      })}
    </TransactionList>
  )
}

export default TransactionsModal
