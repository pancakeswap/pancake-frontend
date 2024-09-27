import { useTranslation } from '@pancakeswap/localization'
import { useMemo } from 'react'
import { CheckmarkCircleIcon, ErrorIcon, ScanLink } from '@pancakeswap/uikit'
import {
  TransactionListItem,
  TransactionListItemDesc,
  TransactionListItemTitle,
  TransactionStatus,
} from '@pancakeswap/widgets-internal'
import { ChainLinkSupportChains } from 'state/info/constant'
import { TransactionDetails } from 'state/transactions/reducer'
import { useReadableTransactionType } from 'state/transactions/hooks'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'

import CircleLoader from '../../Loader/CircleLoader'

const TransactionState = styled.div<{ pending: boolean; success?: boolean }>`
  display: flex;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) =>
    pending ? theme.colors.primary : success ? theme.colors.success : theme.colors.failure};
`

export default function Transaction({ tx, chainId }: { tx: TransactionDetails; chainId: number }) {
  const { t } = useTranslation()
  const translatableSummary = tx?.translatableSummary
    ? t(tx.translatableSummary.text, tx.translatableSummary.data)
    : undefined
  const summary = translatableSummary ?? tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const status = useMemo(() => {
    if (pending) {
      return TransactionStatus.Pending
    }
    if (success) {
      return TransactionStatus.Success
    }
    return TransactionStatus.Failed
  }, [pending, success])
  const link = useMemo(() => getBlockExploreLink(tx.hash, 'transaction', chainId), [tx.hash, chainId])
  const title = useReadableTransactionType(tx?.type)

  if (!chainId) return null

  return (
    <TransactionListItem
      status={status}
      title={<TransactionListItemTitle>{title}</TransactionListItemTitle>}
      action={<ScanLink useBscCoinFallback={ChainLinkSupportChains.includes(chainId)} href={link} />}
    >
      <TransactionListItemDesc>{summary ?? tx.hash}</TransactionListItemDesc>
    </TransactionListItem>
  )
}

export function TransactionWrapper({
  pending,
  success,
  children,
}: {
  pending: boolean
  success: boolean
  children: React.ReactNode
}) {
  return (
    <TransactionState pending={pending} success={success}>
      <IconWrapper pending={pending} success={success}>
        {pending ? <CircleLoader /> : success ? <CheckmarkCircleIcon color="success" /> : <ErrorIcon color="failure" />}
      </IconWrapper>
      {children}
    </TransactionState>
  )
}
