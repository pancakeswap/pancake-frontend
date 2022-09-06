import { useMemo } from 'react'
import { ModalV2 } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { toggleFarmHarvestModal } from 'state/global/actions'
import { useFarmHarvestTransaction } from 'state/global/hooks'
import { useAllTransactions } from 'state/transactions/hooks'
import FarmHarvestModal from './FarmHarvestModal'

const TransactionsDetailModal = () => {
  const { showModal, pickedTx } = useFarmHarvestTransaction()
  const allTransactions = useAllTransactions()
  const dispatch = useAppDispatch()

  const pickedData = useMemo(() => allTransactions[pickedTx], [allTransactions, pickedTx])

  const closeModal = () => {
    dispatch(toggleFarmHarvestModal({ showModal: false }))
  }

  return (
    <ModalV2 isOpen={showModal} closeOnOverlayClick onDismiss={closeModal}>
      <FarmHarvestModal pickedData={pickedData} onDismiss={closeModal} />
    </ModalV2>
  )
}

export default TransactionsDetailModal
