import styled from 'styled-components'
import { CheckmarkIcon, CloseIcon, ScanLink } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { TransactionDetails } from 'state/transactions/reducer'
import CircleLoader from '../../Loader/CircleLoader'

const TransactionState = styled.div<{ pending: boolean; success?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
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
    <TransactionState pending={pending} success={success}>
      <ScanLink chainId={chainId} href={getBlockExploreLink(tx.hash, 'transaction', chainId)}>
        {summary ?? tx.hash}
      </ScanLink>
      <IconWrapper pending={pending} success={success}>
        {pending ? <CircleLoader /> : success ? <CheckmarkIcon color="success" /> : <CloseIcon color="failure" />}
      </IconWrapper>
    </TransactionState>
  )
}
