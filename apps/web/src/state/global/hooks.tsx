import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from '../index'
import { akkaSwapStatus } from './actions'

// Get Farm Harvest
export function useFarmHarvestTransaction() {
  const state = useSelector<AppState, AppState['global']>((s) => s.global)
  return {
    showModal: state.showFarmTransactionModal,
    pickedTx: state.pickedFarmTransactionModalTx,
  }
}
export function useIsAkkaSwap(): boolean {
  return useSelector<AppState, AppState['global']['isAkkaSwap']>((state) => state.global.isAkkaSwap)
}

export function useIsAkkaSwapModeStatus(): [boolean, () => void, () => void, () => void] {
  const dispatch = useAppDispatch()
  const isAkkSwapMode = useIsAkkaSwap()

  const toggleSetAkkaMode = useCallback(() => {
    dispatch(akkaSwapStatus({ isAkkaSwap: !isAkkSwapMode }))
  }, [isAkkSwapMode, dispatch])

  const toggleSetAkkaModeToFalse = useCallback(() => {
    dispatch(akkaSwapStatus({ isAkkaSwap: false }))
  }, [isAkkSwapMode, dispatch])

  const toggleSetAkkaModeToTrue = useCallback(() => {
    dispatch(akkaSwapStatus({ isAkkaSwap: true }))
  }, [isAkkSwapMode, dispatch])

  return [isAkkSwapMode, toggleSetAkkaMode, toggleSetAkkaModeToFalse, toggleSetAkkaModeToTrue]
}
