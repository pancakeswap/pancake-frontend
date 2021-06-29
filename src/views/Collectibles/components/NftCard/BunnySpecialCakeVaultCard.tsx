import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useSpecialBunnyCakeVaultContract } from 'hooks/useContract'
import { getBunnySpecialCakeVaultContract } from 'utils/contractHelpers'
import NftCard, { NftCardProps } from './index'

const BunnySpecialCakeVaultCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const bunnySpecialCakeVaultContract = useSpecialBunnyCakeVaultContract()
  const { variationId } = nft

  const handleClaim = async () => {
    const response: ethers.providers.TransactionResponse = await bunnySpecialCakeVaultContract.mintNFT()
    await response.wait()
    setIsClaimable(false)
    return response
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const contract = getBunnySpecialCakeVaultContract()
      const canClaim = await contract.canClaim(account)
      setIsClaimable(canClaim)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, variationId, bunnySpecialCakeVaultContract, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpecialCakeVaultCard
