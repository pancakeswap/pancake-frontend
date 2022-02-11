import React, { useCallback } from 'react'
import { useModal } from '@tovaswapui/uikit'
import { useAppDispatch } from 'state'
import { fetchAddressResult, setSelectedAddress } from 'state/predictions'
import AddressInputSelect from 'components/AddressInputSelect'
import WalletStatsModal from './WalletStatsModal'

const AddressSearch = () => {
  const dispatch = useAppDispatch()

  const handleBeforeDismiss = () => {
    dispatch(setSelectedAddress(null))
  }

  const [onPresentWalletStatsModal] = useModal(<WalletStatsModal onBeforeDismiss={handleBeforeDismiss} />)
  const handleValidAddress = useCallback(
    async (value: string) => {
      const response: any = await dispatch(fetchAddressResult(value))
      return response.payload?.data !== undefined
    },
    [dispatch],
  )

  const handleAddressClick = async (value: string) => {
    await dispatch(setSelectedAddress(value))
    onPresentWalletStatsModal()
  }

  return <AddressInputSelect onAddressClick={handleAddressClick} onValidAddress={handleValidAddress} />
}

export default AddressSearch
