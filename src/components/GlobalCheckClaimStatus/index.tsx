import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import dynamic from 'next/dynamic'
import request, { gql } from 'graphql-request'
import { GALAXY_NFT_CAMPAIGN_ID } from 'config/constants'
import { GALAXY_NFT_CLAIMING_API } from 'config/constants/endpoints'
import { useERC721 } from 'hooks/useContract'

const GalaxyNFTClaimModal = dynamic(() => import('./GalaxyNFTClaimModal'), { ssr: false })

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<GlobalCheckClaimStatusProps> = (props) => {
  if (!enable) {
    return null
  }
  return <GlobalCheckClaim {...props} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const GlobalCheckClaim: React.FC<GlobalCheckClaimStatusProps> = ({ excludeLocations }) => {
  const hasDisplayedModal = useRef(false)
  const [cid, setCid] = useState(null)
  const [canClaimNFT, setCanClaimNFT] = useState(false)
  const [nftBalance, setNftBalance] = useState(999) // default high to avoid flashing modal
  const galaxyNFTContract = useERC721('0x2aD5745b7aD37037339EDe18407bf9395DE2d97F', false)
  const { account } = useWeb3React()
  const { pathname } = useRouter()
  const [onPresentModal] = useModal(<GalaxyNFTClaimModal cid={cid} />, false, true, 'galaxyNFTClaimModal')

  // Check claim status
  useEffect(() => {
    const fetchClaimNftStatus = async () => {
      try {
        const { campaign } = await request(
          GALAXY_NFT_CLAIMING_API,
          gql`
            query checkEligibilityForGalaxyNFT($campaignId: ID!, $address: String!) {
              campaign(id: $campaignId) {
                numberID
                creds {
                  eligible(address: $address)
                }
              }
            }
          `,
          { campaignId: GALAXY_NFT_CAMPAIGN_ID, address: account },
        )
        const balance = await galaxyNFTContract.balanceOf(account)
        setNftBalance(balance.toNumber())
        setCanClaimNFT(campaign.creds[0].eligible === 1)
        setCid(campaign.numberID)
      } catch (error) {
        console.error('checkEligabilityForGalaxyNFT failed', error)
      }
    }

    if (account) {
      fetchClaimNftStatus()
    }
  }, [account, galaxyNFTContract])

  // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (canClaimNFT && !matchesSomeLocations && !hasDisplayedModal.current && nftBalance === 0) {
      onPresentModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, excludeLocations, hasDisplayedModal, onPresentModal, canClaimNFT, nftBalance])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
