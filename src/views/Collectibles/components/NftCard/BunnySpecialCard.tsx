import React, { useEffect, useState } from 'react'
import { PromiEvent } from 'web3-core'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { useBunnySpecialContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'

const BunnySpeciaCard: React.FC<NftCardProps> = ({ nft, lastUpdated, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const bunnySpecialContract = useBunnySpecialContract()
  const { bunnyId } = nft

  const handleClaim = (): PromiEvent<Contract> => {
    return bunnySpecialContract.methods.mintNFT(bunnyId).send({ from: account })
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaimSingle = await bunnySpecialContract.methods.canClaimSingle(account, bunnyId).call()
      setIsClaimable(canClaimSingle)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, bunnyId, lastUpdated, bunnySpecialContract, setIsClaimable])

  return <NftCard nft={nft} lastUpdated={lastUpdated} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpeciaCard
