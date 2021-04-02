import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getBunnySpecialContract } from 'utils/contractHelpers'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import NftCard, { NftCardProps } from './index'

const BunnySpeciaCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const { lastUpdated } = useGetWalletNfts()
  const { bunnyId } = nft

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const bunnySpecialContract = getBunnySpecialContract()
      const canClaimSingle = await bunnySpecialContract.methods.canClaimSingle(account, bunnyId).call()
      setIsClaimable(canClaimSingle)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, bunnyId, lastUpdated, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} />
}

export default BunnySpeciaCard
