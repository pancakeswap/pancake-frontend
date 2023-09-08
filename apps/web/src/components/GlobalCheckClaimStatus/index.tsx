import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useModal, useToast } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useAnniversaryAchievementContract } from 'hooks/useContract'
import AnniversaryAchievementModal from './AnniversaryAchievementModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useAccountActiveChain()
  if (!enable || chainId !== ChainId.BSC || !account) {
    return null
  }
  return <GlobalCheckClaim key={account} {...props} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */

const GlobalCheckClaim: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = ({ excludeLocations }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const hasDisplayedModal = useRef(false)
  const contract = useAnniversaryAchievementContract({ chainId: ChainId.BSC })

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const [canClaimAnniversaryPoints, setCanClaimAnniversaryPoints] = useState(false)

  const [onPresentAnniversaryModal] = useModal(
    <AnniversaryAchievementModal
      onClick={async () => {
        try {
          const receipt = await fetchWithCatchTxError(() => contract.write.claimAnniversaryPoints({ account, chainId }))

          if (receipt?.status) {
            toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
          }
        } catch (error: any) {
          const errorDescription = `${error.message} - ${error.data?.message}`
          toastError(t('Failed to claim'), errorDescription)
        }
      }}
    />,
  )

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canClaimAnniversary = await contract.read.canClaim([account])
      setCanClaimAnniversaryPoints(canClaimAnniversary)
    }

    if (account && chainId === ChainId.BSC) {
      fetchClaimAnniversaryStatus()
    }
  }, [account, chainId, contract])

  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (canClaimAnniversaryPoints && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentAnniversaryModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, excludeLocations, hasDisplayedModal, canClaimAnniversaryPoints, onPresentAnniversaryModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
