import { useSelector } from 'react-redux'
import { AppState } from 'state'

// Get Farm Harvest
export function useFarmHarvestTransaction() {
  const state = useSelector<AppState, AppState['global']>((s) => s.global)
  return {
    showModal: state.showFarmTransactionModal,
    pickedTx: state.pickedFarmTransactionModalTx,
  }
}
