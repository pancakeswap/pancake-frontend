import { useTranslation } from '@pancakeswap/localization'
import { BlockIcon, BscScanIcon, CheckmarkCircleIcon, Flex, RefreshIcon } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { pickFarmTransactionTx } from 'state/global/actions'
import { FarmTransactionStatus, TransactionType } from 'state/transactions/actions'
import { TransactionDetails } from 'state/transactions/reducer'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'

interface TransactionRowProps {
  txn: TransactionDetails
  chainId: number
  type?: TransactionType
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
  const { receipt, crossChainFarm } = txn
  if (!txn.receipt || crossChainFarm?.status === FarmTransactionStatus.PENDING) {
    return <RefreshIcon spin width="24px" />
  }

  const isFarmStatusSuccess = crossChainFarm ? crossChainFarm.status === FarmTransactionStatus.SUCCESS : true
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
    if (type === 'cross-chain-farm') {
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
        <BscScanIcon width="24px" color="primary" />
      </TxnIcon>
    </TxnLink>
  )
}

export default TransactionRow
