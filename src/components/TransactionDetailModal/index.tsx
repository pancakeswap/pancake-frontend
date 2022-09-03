import { ModalV2 } from '@pancakeswap/uikit'
import { atom, useAtom } from 'jotai'
import FarmHarvestModal from './FarmHarvestModal'

export const hideFarmHarvestModalAtom = atom(false)

const TransactionsDetailModal = () => {
  const [dismissFarmHarvest, setDismissFarmHarvest] = useAtom(hideFarmHarvestModalAtom)

  return (
    <ModalV2 isOpen={!dismissFarmHarvest} closeOnOverlayClick onDismiss={() => setDismissFarmHarvest(true)}>
      <FarmHarvestModal onDismiss={() => setDismissFarmHarvest(true)} />
    </ModalV2>
  )
}

export default TransactionsDetailModal
