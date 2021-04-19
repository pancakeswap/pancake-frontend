import React, { useEffect, useState } from 'react'
import { PromiEvent } from 'web3-core'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { useBunnySpecialContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'

const BunnySpeciaCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const bunnySpecialContract = useBunnySpecialContract()
  const { variationId } = nft

  const handleClaim = (): PromiEvent<Contract> => {
    return bunnySpecialContract.methods.mintNFT(variationId).send({ from: account })
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaimSingle = await bunnySpecialContract.methods.canClaimSingle(account, variationId).call()
      setIsClaimable(canClaimSingle)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, variationId, bunnySpecialContract, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpeciaCard
