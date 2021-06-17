import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useBunnySpecialContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'

const BunnySpecialCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const bunnySpecialContract = useBunnySpecialContract()
  const { variationId } = nft

  const handleClaim = (): ethers.providers.TransactionResponse => {
    return bunnySpecialContract.mintNFT(variationId)
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaimSingle = await bunnySpecialContract.canClaimSingle(account, variationId)
      setIsClaimable(canClaimSingle)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, variationId, bunnySpecialContract, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpecialCard
