import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { useModal, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useAnniversaryAchievementContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import AnniversaryAchievementModal from './AnniversaryAchievementModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useWeb3React()
  if (!enable || chainId !== ChainId.BSC) {
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
  const hasDisplayedModal = useRef(false)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const [canClaimAnniversaryPoints, setCanClaimAnniversaryPoints] = useState(false)
  const { canClaim, claimAnniversaryPoints } = useAnniversaryAchievementContract()
  const { fetchWithCatchTxError } = useCatchTxError()
  const [onPresentAnniversaryModal] = useModal(
    <AnniversaryAchievementModal
      onClick={async () => {
        const receipt = await fetchWithCatchTxError(() => claimAnniversaryPoints())
        if (receipt?.status) {
          toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        }
      }}
    />,
  )

  const { account, chainId } = useWeb3React()
  const { pathname } = useRouter()
  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canClaimAnniversary = await canClaim(account)
      setCanClaimAnniversaryPoints(canClaimAnniversary)
    }

    if (account && chainId === ChainId.BSC) {
      fetchClaimAnniversaryStatus()
    }
  }, [account, canClaim, chainId])

  // // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (canClaimAnniversaryPoints && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentAnniversaryModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, excludeLocations, hasDisplayedModal, canClaim, canClaimAnniversaryPoints, onPresentAnniversaryModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
