import React, { useEffect, useState } from 'react'
import { PromiEvent } from 'web3-core'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { useProfile } from 'state/hooks'
import { useEasterNftContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'

/**
 * A map of NFT bunny Ids to Team ids
 * [bunnyId]: teamId
 */
export const teamNftMap = {
  12: 1,
  13: 2,
  14: 3,
}

const EasterNftCard: React.FC<NftCardProps> = ({ nft, lastUpdated, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const { bunnyId } = nft
  const { team } = profile ?? {}
  const easterNftContract = useEasterNftContract()

  const handleClaim = (): PromiEvent<Contract> => {
    return easterNftContract.methods.mintNFT().send({ from: account })
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaim = await easterNftContract.methods.canClaim(account).call()

      // Wallet can claim if it is claimable and the nft being displayed is mapped to the wallet's team
      setIsClaimable(canClaim ? team.id === teamNftMap[bunnyId] : false)
    }

    if (account && team) {
      fetchClaimStatus()
    }
  }, [account, bunnyId, team, lastUpdated, easterNftContract, setIsClaimable])

  return <NftCard nft={nft} lastUpdated={lastUpdated} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default EasterNftCard
