import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { useModal, useToast } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useV3AirdropContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import v3WhitelistAddress from './constants/v3WhitelistAddress.json'
import v3ForSC from './constants/v3ForSC.json'
import v3MerkleProofs from './constants/v3MerkleProofs.json'
import V3AirdropModal, { WhitelistType } from './V3AirdropModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useActiveWeb3React()
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
  const { address: account } = useAccount()
  const { pathname } = useRouter()
  const hasDisplayedModal = useRef(false)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const [canClaimReward, setCanClaimReward] = useState(false)
  const { claim } = useV3AirdropContract()
  const { isClaimed } = useV3AirdropContract(false)
  const { fetchWithCatchTxError } = useCatchTxError()

  const [onPresentV3AirdropModal, closeV3AirdropModal] = useModal(
    <V3AirdropModal
      data={v3WhitelistAddress[account] as WhitelistType}
      onClick={async () => {
        const { cakeAmountInWei, nft1, nft2 } = v3ForSC[account]
        const proof = v3MerkleProofs.merkleProofs?.[account]
        const receipt = await fetchWithCatchTxError(() => claim(cakeAmountInWei, nft1, nft2, proof))
        if (receipt?.status) {
          toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        }
      }}
    />,
  )

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canV3ClaimReward = await isClaimed(account)
      const isWhitelistAddress = v3WhitelistAddress[account]
      // TODO: also need check json acc is whitelisted or not.
      if (!canV3ClaimReward && isWhitelistAddress) {
        setCanClaimReward(true)
      } else {
        closeV3AirdropModal()
      }
    }

    if (account) {
      fetchClaimAnniversaryStatus()
    }
  }, [account, canClaimReward, isClaimed, closeV3AirdropModal])

  // // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (canClaimReward && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentV3AirdropModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, excludeLocations, hasDisplayedModal, canClaimReward, onPresentV3AirdropModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
