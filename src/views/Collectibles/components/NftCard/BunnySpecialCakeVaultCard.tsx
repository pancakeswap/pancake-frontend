import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useSpecialBunnyCakeVaultContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'

const BunnySpecialCakeVaultCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const bunnySpecialCakeVaultContract = useSpecialBunnyCakeVaultContract()
  const { variationId } = nft

  const handleClaim = (): ethers.providers.TransactionResponse => {
    return bunnySpecialCakeVaultContract.mintNFT()
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaim = await bunnySpecialCakeVaultContract.canClaim(account)
      setIsClaimable(canClaim)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, variationId, bunnySpecialCakeVaultContract, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpecialCakeVaultCard
