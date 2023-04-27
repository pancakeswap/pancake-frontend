import { BlockIcon, CheckmarkCircleIcon, Flex, BscScanIcon, RefreshIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionDetails } from 'state/transactions/reducer'
import { pickFarmTransactionTx } from 'state/global/actions'
import { TransactionType, FarmTransactionStatus } from 'state/transactions/actions'
import { getBlockExploreLink } from 'utils'
import { useCallback, useMemo } from 'react'

interface TransactionRowProps {
  txn: TransactionDetails
  chainId: number
  type: TransactionType
  onDismiss: () => void
}

const TxnIcon = styled(Flex)`
  align-items: center;
  flex: none;
  width: 24px;
`

const Summary = styled.div`
  flex: 1;
  padding: 0 8px;
`

const TxnLink = styled.div`
  cursor: pointer;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  margin-bottom: 16px;
  width: 100%;

  &:hover {
    text-decoration: none;
  }
`

const TransactionRow: React.FC<React.PropsWithChildren<TransactionRowProps>> = ({ txn, chainId, type, onDismiss }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { receipt, nonBscFarm } = txn || {}
  const isFarmStatusSuccess = useMemo(
    () => (nonBscFarm ? nonBscFarm.status === FarmTransactionStatus.SUCCESS : true),
    [nonBscFarm],
  )

  const onClickTransaction = useCallback(() => {
    if (type === 'non-bsc-farm') {
      onDismiss()
      dispatch(pickFarmTransactionTx({ tx: txn.hash, chainId }))
    } else {
      const url = getBlockExploreLink(txn.hash, 'transaction', chainId)
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }, [chainId, dispatch, onDismiss, txn?.hash, type])

  if (!txn) {
    return null
  }

  return (
    <TxnLink onClick={onClickTransaction}>
      <TxnIcon>
        {!txn.receipt || nonBscFarm?.status === FarmTransactionStatus.PENDING ? (
          <RefreshIcon spin width="24px" />
        ) : (receipt?.status === 1 && isFarmStatusSuccess) || typeof receipt?.status === 'undefined' ? (
          <CheckmarkCircleIcon color="success" width="24px" />
        ) : (
          <BlockIcon color="failure" width="24px" />
        )}
      </TxnIcon>
      <Summary>
        {txn.translatableSummary
          ? t(txn.translatableSummary.text, txn.translatableSummary.data)
          : txn.summary ?? txn.hash}
      </Summary>
      <TxnIcon>
        <BscScanIcon width="24px" color="primary" />
      </TxnIcon>
    </TxnLink>
  )
}

export default TransactionRow
