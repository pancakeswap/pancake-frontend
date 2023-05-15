import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useModal, useToast } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useV3AirdropContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import V3AirdropModal, { WhitelistType } from './V3AirdropModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useAccountActiveChain()
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
const GITHUB_ENDPOINT = 'https://raw.githubusercontent.com/pancakeswap/airdrop-v3-users/master'

const GlobalCheckClaim: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = ({ excludeLocations }) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { pathname } = useRouter()
  const hasDisplayedModal = useRef(false)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const [canClaimReward, setCanClaimReward] = useState(false)
  const v3Airdop = useV3AirdropContract()
  const { fetchWithCatchTxError } = useCatchTxError()

  const { data } = useSWRImmutable('/airdrop-json', async () => {
    const [feResponse, scResponse, merkleProofsResponse] = await Promise.all([
      fetch(`${GITHUB_ENDPOINT}/forFE.json`),
      fetch(`${GITHUB_ENDPOINT}/forSC.json`),
      fetch(`${GITHUB_ENDPOINT}/v3MerkleProofs.json`),
    ])
    const [v3WhitelistAddress, v3ForSC, v3MerkleProofs] = await Promise.all([
      feResponse.json(),
      scResponse.json(),
      merkleProofsResponse.json(),
    ])

    return {
      v3WhitelistAddress,
      v3ForSC,
      v3MerkleProofs,
    }
  })

  const [onPresentV3AirdropModal, closeV3AirdropModal] = useModal(
    <V3AirdropModal
      data={account ? (data?.v3WhitelistAddress[account.toLowerCase()] as WhitelistType) : (null as WhitelistType)}
      onClick={async () => {
        const { cakeAmountInWei, nft1, nft2 } = data.v3ForSC[account.toLowerCase()]
        const proof = data?.v3MerkleProofs?.merkleProofs?.[account.toLowerCase()]
        const receipt = await fetchWithCatchTxError(() =>
          v3Airdop.write.claim([cakeAmountInWei, nft1, nft2, proof], {
            account: v3Airdop.account,
            chain: v3Airdop.chain,
          }),
        )
        if (receipt?.status) {
          toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        }
      }}
    />,
  )

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canV3ClaimReward = await v3Airdop.read.isClaimed([account])
      const isWhitelistAddress = data?.v3WhitelistAddress[account.toLowerCase()]
      // TODO: also need check json acc is whitelisted or not.
      if (!canV3ClaimReward && isWhitelistAddress) {
        setCanClaimReward(true)
      } else {
        closeV3AirdropModal()
      }
    }

    if (account && chainId === ChainId.BSC) {
      fetchClaimAnniversaryStatus()
    }
  }, [data, account, chainId, canClaimReward, closeV3AirdropModal, v3Airdop.read])

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
