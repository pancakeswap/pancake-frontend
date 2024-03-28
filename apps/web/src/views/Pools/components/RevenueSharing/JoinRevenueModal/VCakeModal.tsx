import { ChainId } from '@pancakeswap/chains'
import { ModalV2 } from '@pancakeswap/uikit'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useEffect, useState } from 'react'
import { VaultPosition } from 'utils/cakePool'
import JoinRevenueModal from 'views/Pools/components/RevenueSharing/JoinRevenueModal'
import useVCake from 'views/Pools/hooks/useVCake'

const VCakeModal = () => {
  const { account, chainId, status, connector } = useAccountActiveChain()
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

  useEffect(() => {
    if (status === 'connected') {
      connector?.emitter.on('change', () => closeModal())
    } else if (status === 'disconnected') {
      closeModal()
    }
  }, [connector?.emitter, status])

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
