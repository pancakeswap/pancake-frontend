import { ModalV2 } from '@pancakeswap/uikit'
import { toggleFarmTransactionModal } from 'state/global/actions'
import { useFarmHarvestTransaction } from 'state/global/hooks'
import { useTransactionState } from 'state/transactions/reducer'
import FarmTransactionModal from './FarmTransactionModal'

const TransactionsDetailModal = () => {
  const { showModal } = useFarmHarvestTransaction()
  const [, dispatch] = useTransactionState()

  const closeModal = () => {
    dispatch(toggleFarmTransactionModal({ showModal: false }))
  }

  return (
    <ModalV2 isOpen={showModal} closeOnOverlayClick onDismiss={closeModal}>
      <FarmTransactionModal onDismiss={closeModal} />
    </ModalV2>
  )
}

export default TransactionsDetailModal
