import { useEffect, useState } from 'react'
import { useModal } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import ClaimNftModal from 'components/ClaimNftModal/ClaimNftModal'
import noop from 'lodash/noop'

const useNftClaimStatusCheck = () => {
  const [hasDisplayedModal, setHasDisplayedModal] = useState(false)
  const { address: account } = useAccount()
  const [onPresentNftClaimModal] = useModal(<ClaimNftModal />)

  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        const canClaim = /* await getBunnySpecialXmasContract(bscRpcProvider).canClaim(account) */ true
        if (canClaim) {
          onPresentNftClaimModal()
          setHasDisplayedModal(true)
        }
      } catch (error) {
        // User not registered throws here
        noop()
      }
    }
    if (account && !hasDisplayedModal) {
      checkClaimStatus()
    }
  }, [account, hasDisplayedModal, onPresentNftClaimModal])

  // Reset when account changes
  useEffect(() => {
    setHasDisplayedModal(false)
  }, [account])
}

export default useNftClaimStatusCheck
