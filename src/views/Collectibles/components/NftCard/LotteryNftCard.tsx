import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { fetchWalletNfts } from 'state/collectibles'
import { useBunnySpecialLotteryContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'
import useBunnySpecialLottery, { LotteryNftMintData } from '../../hooks/useBunnySpecialLottery'

const LotteryNftCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const lotteryNftContract = useBunnySpecialLotteryContract()
  const { identifier } = nft
  const [isClaimable, setIsClaimable] = useState(false)
  const [mintNFTData, setMintNFTData] = useState<LotteryNftMintData>(null)
  const { canClaimBaller, canClaimLottie, canClaimLucky } = useBunnySpecialLottery()

  useEffect(() => {
    const canClaimMap = {
      lottie: canClaimLottie,
      lucky: canClaimLucky,
      baller: canClaimBaller,
    }

    const checkCanClaim = async () => {
      const { canClaim, mintingData } = await canClaimMap[identifier]()
      setIsClaimable(canClaim)
      setMintNFTData(mintingData)
    }

    if (account) {
      checkCanClaim()
    }
  }, [account, canClaimBaller, canClaimLottie, canClaimLucky, identifier])

  const handleClaim = async () => {
    const { bunnyId, lotteryId, cursor } = mintNFTData
    const response: ethers.providers.TransactionResponse = await lotteryNftContract.mintNFT(bunnyId, lotteryId, cursor)
    return response
  }

  const refresh = async () => {
    // TODO: confirm this is firing
    dispatch(fetchWalletNfts(account))
    setIsClaimable(false)
  }

  return <NftCard nft={nft} canClaim={isClaimable} onClaim={handleClaim} refresh={refresh} {...props} />
}

export default LotteryNftCard
