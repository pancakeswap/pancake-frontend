import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useSpecialBunnyPredictionContract } from 'hooks/useContract'
import { getBunnySpecialPredictionContract } from 'utils/contractHelpers'
import NftCard, { NftCardProps } from './index'

const BunnySpecialPredictionCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const bunnySpecialPredictionContract = useSpecialBunnyPredictionContract()
  const { variationId } = nft

  const handleClaim = (): ethers.providers.TransactionResponse => {
    return bunnySpecialPredictionContract.mintNFT()
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const contract = getBunnySpecialPredictionContract()
      const canClaim = await contract.canClaim(account)
      setIsClaimable(canClaim)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, variationId, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpecialPredictionCard
