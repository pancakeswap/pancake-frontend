import { CheckmarkCircleIcon, ErrorIcon, ScanLink, Text } from '@pancakeswap/uikit'
import { ChainLinkSupportChains } from 'state/info/constant'
import { TransactionDetails } from 'state/transactions/reducer'
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
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId) return null

  return (
    <TransactionWrapper pending={pending} success={success}>
      {summary ? (
        <>
          <Text>{summary}</Text>
          <ScanLink
            useBscCoinFallback={ChainLinkSupportChains.includes(chainId)}
            href={getBlockExploreLink(tx.hash, 'transaction', chainId)}
          />
        </>
      ) : (
        <ScanLink
          useBscCoinFallback={ChainLinkSupportChains.includes(chainId)}
          href={getBlockExploreLink(tx.hash, 'transaction', chainId)}
        >
          {tx.hash}
        </ScanLink>
      )}
    </TransactionWrapper>
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
