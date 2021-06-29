import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useProfile } from 'state/hooks'
import { useEasterNftContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'

/**
 * A map of NFT bunny Ids to Team ids
 * [identifier]: teamId
 */
export const teamNftMap = {
  'easter-storm': 1,
  'easter-flipper': 2,
  'easter-caker': 3,
}

const EasterNftCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const { identifier } = nft
  const { team } = profile ?? {}
  const easterNftContract = useEasterNftContract()

  const handleClaim = async () => {
    const response: ethers.providers.TransactionResponse = await easterNftContract.mintNFT()
    await response.wait()
    return response
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaim = await easterNftContract.canClaim(account)

      // Wallet can claim if it is claimable and the nft being displayed is mapped to the wallet's team
      setIsClaimable(canClaim ? team.id === teamNftMap[identifier] : false)
    }

    if (account && team) {
      fetchClaimStatus()
    }
  }, [account, identifier, team, easterNftContract, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default EasterNftCard
