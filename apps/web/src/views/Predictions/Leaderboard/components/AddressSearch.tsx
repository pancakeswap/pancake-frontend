import { Token } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'
import AddressInputSelect from 'components/AddressInputSelect'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useCallback } from 'react'
import { fetchAddressResult, setSelectedAddress } from 'state/predictions'
import { useStatModalProps } from 'state/predictions/hooks'
import WalletStatsModal from './WalletStatsModal'

interface AddressSearchProps {
  token: Token
  api: string
}

const AddressSearch: React.FC<React.PropsWithChildren<AddressSearchProps>> = ({ token, api }) => {
  const dispatch = useLocalDispatch()
  const { result, address, leaderboardLoadingState } = useStatModalProps({
    api,
    tokenSymbol: token?.symbol,
  })

  const handleBeforeDismiss = () => {
    dispatch(setSelectedAddress(''))
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
      const response: any = await dispatch(fetchAddressResult({ account: value, api, tokenSymbol: token?.symbol }))
      return response.payload?.data !== undefined
    },
    [api, dispatch, token?.symbol],
  )

  const handleAddressClick = async (value: string) => {
    await dispatch(setSelectedAddress(value))
    onPresentWalletStatsModal()
  }

  return <AddressInputSelect onAddressClick={handleAddressClick} onValidAddress={handleValidAddress} />
}

export default AddressSearch
