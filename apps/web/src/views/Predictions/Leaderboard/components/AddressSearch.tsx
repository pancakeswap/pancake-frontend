import { useCallback } from 'react'
import { useModal } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { fetchAddressResult, setSelectedAddress } from 'state/predictions'
import AddressInputSelect from 'components/AddressInputSelect'
import { useStatModalProps } from 'state/predictions/hooks'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import WalletStatsModal from './WalletStatsModal'

const AddressSearch = () => {
  const dispatch = useLocalDispatch()
  const { result, address, leaderboardLoadingState } = useStatModalProps()
  const { token, api } = useConfig()

  const handleBeforeDismiss = () => {
    dispatch(setSelectedAddress(null))
  }

  const [onPresentWalletStatsModal] = useModal(
    <WalletStatsModal
      token={token}
      api={api}
      result={result}
      address={address}
      leaderboardLoadingState={leaderboardLoadingState}
      onBeforeDismiss={handleBeforeDismiss}
    />,
    true,
    true,
    'AddressSearchWalletStatsModal',
  )
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
