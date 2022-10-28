import { BlockIcon, CheckmarkCircleIcon, Flex, OpenNewIcon, RefreshIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionDetails } from 'state/transactions/reducer'
import { pickFarmTransactionTx } from 'state/global/actions'
import { TransactionType, FarmTransactionStatus } from 'state/transactions/actions'
import { getBlockExploreLink } from 'utils'

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

const renderIcon = (txn: TransactionDetails) => {
  const { receipt, nonBscFarm } = txn
  if (!txn.receipt || nonBscFarm?.status === FarmTransactionStatus.PENDING) {
    return <RefreshIcon spin width="24px" />
  }

  const isFarmStatusSuccess = nonBscFarm ? nonBscFarm.status === FarmTransactionStatus.SUCCESS : true
  return (receipt?.status === 1 && isFarmStatusSuccess) || typeof receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="24px" />
  ) : (
    <BlockIcon color="failure" width="24px" />
  )
}

const TransactionRow: React.FC<React.PropsWithChildren<TransactionRowProps>> = ({ txn, chainId, type, onDismiss }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const onClickTransaction = () => {
    if (type === 'non-bsc-farm') {
      onDismiss()
      dispatch(pickFarmTransactionTx({ tx: txn.hash, chainId }))
    } else {
      const url = getBlockExploreLink(txn.hash, 'transaction', chainId)
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

  if (!txn) {
    return null
  }

  return (
    <TxnLink onClick={onClickTransaction}>
      <TxnIcon>{renderIcon(txn)}</TxnIcon>
      <Summary>
        {txn.translatableSummary
          ? t(txn.translatableSummary.text, txn.translatableSummary.data)
          : txn.summary ?? txn.hash}
      </Summary>
      <TxnIcon>
        <OpenNewIcon width="24px" color="primary" />
      </TxnIcon>
    </TxnLink>
  )
}

export default TransactionRow
