import { BlockIcon, CheckmarkCircleIcon, Flex, OpenNewIcon, RefreshIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionDetails } from 'state/transactions/reducer'
import { pickFarmHarvestTx } from 'state/global/actions'
import { TransactionType, HarvestStatusType } from 'state/transactions/actions'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBlockExploreLink } from 'utils'

interface TransactionRowProps {
  txn: TransactionDetails
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
  if (!txn.receipt || txn?.farmHarvest?.destinationChain?.status === HarvestStatusType.PENDING) {
    return <RefreshIcon spin width="24px" />
  }

  return txn.receipt?.status === 1 || typeof txn.receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="24px" />
  ) : (
    <BlockIcon color="failure" width="24px" />
  )
}

const TransactionRow: React.FC<React.PropsWithChildren<TransactionRowProps>> = ({ txn, type, onDismiss }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()

  const onClickTransaction = () => {
    if (type === 'non-bsc-farm-harvest') {
      onDismiss()
      dispatch(pickFarmHarvestTx({ tx: txn.hash }))
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
