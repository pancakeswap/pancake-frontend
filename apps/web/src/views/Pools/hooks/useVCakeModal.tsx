import useSWR from 'swr'
import { useEffect } from 'react'
import { useModal } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useVCake from 'views/Pools/hooks/useVCake'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import JoinRevenueModal from 'views/Pools/components/RevenueSharing/JoinRevenueModal'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'
import { VaultPosition } from 'utils/cakePool'
import { FetchStatus } from 'config/constants/types'

const useVCakeModal = () => {
  const { connector } = useActiveWeb3React()
  const { account, chainId } = useAccountActiveChain()
  const { isInitialization, refresh } = useVCake()
  const { data: cakeBenefits, status: cakeBenefitsFetchStatus } = useCakeBenefits()
  const [onPresentViewJoinRevenueModal, onDismiss] = useModal(
    <JoinRevenueModal refresh={refresh} />,
    true,
    true,
    'joinRevenueModal',
  )

  useEffect(() => {
    if (account && connector) {
      const handleEvent = () => {
        onDismiss?.()
      }

      connector.addListener('disconnect', handleEvent)
      connector.addListener('change', handleEvent)

      return () => {
        connector.removeListener('disconnect', handleEvent)
        connector.removeListener('change', handleEvent)
      }
    }

    return undefined
  }, [account, connector, onDismiss])

  useSWR(
    account &&
      chainId === ChainId.BSC && [
        '/use-v-cake-modal',
        account,
        chainId,
        isInitialization,
        cakeBenefitsFetchStatus,
        cakeBenefits?.lockPosition,
      ],
    () => {
      if (
        isInitialization === false &&
        cakeBenefitsFetchStatus === FetchStatus.Fetched &&
        cakeBenefits?.lockPosition === VaultPosition.Locked
      ) {
        onPresentViewJoinRevenueModal()
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )
}

export default useVCakeModal
