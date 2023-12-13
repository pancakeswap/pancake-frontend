import { useEffect, useState } from 'react'
import { ModalV2 } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/chains'
import { useAccount } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useVCake from 'views/Pools/hooks/useVCake'
import JoinRevenueModal from 'views/Pools/components/RevenueSharing/JoinRevenueModal'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'
import { VaultPosition } from 'utils/cakePool'

const VCakeModal = () => {
  const { account, chainId } = useAccountActiveChain()
  const { isInitialization, refresh } = useVCake()
  const [open, setOpen] = useState(false)
  const { data: cakeBenefits, status: cakeBenefitsFetchStatus } = useCakeBenefits()

  useEffect(() => {
    if (
      account &&
      chainId === ChainId.BSC &&
      isInitialization === false &&
      cakeBenefitsFetchStatus === 'success' &&
      cakeBenefits?.lockPosition === VaultPosition.Locked
    ) {
      setOpen(true)
    }
  }, [account, cakeBenefits?.lockPosition, cakeBenefitsFetchStatus, chainId, isInitialization])

  useAccount({
    onConnect: ({ connector }) => {
      connector?.addListener('change', () => closeModal())
    },
    onDisconnect: () => closeModal(),
  })

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <ModalV2 isOpen={open} onDismiss={() => closeModal()}>
      <JoinRevenueModal refresh={refresh} onDismiss={() => closeModal()} />
    </ModalV2>
  )
}

export default VCakeModal
