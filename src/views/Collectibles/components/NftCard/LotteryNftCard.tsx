import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import omit from 'lodash/omit'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { fetchWalletNfts } from 'state/collectibles'
import { useBunnySpecialLotteryContract } from 'hooks/useContract'
import { LotteryNftMintData } from 'views/Collectibles/helpers'
import NftCard, { NftCardProps } from './index'
import useBunnySpecialLottery from '../../hooks/useBunnySpecialLottery'

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
      const { canClaim, mintData } = await canClaimMap[identifier]()
      setIsClaimable(canClaim)
      setMintNFTData(mintData)
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

  const LotteryNftRefresh = () => {
    dispatch(fetchWalletNfts(account))
    setIsClaimable(false)
  }

  // Don't pass the <NftList> 'refresh' function to the NftCard
  const propsWithoutRefresh = omit(props, 'refresh')

  return (
    <NftCard
      nft={nft}
      canClaim={isClaimable}
      onClaim={handleClaim}
      refresh={LotteryNftRefresh}
      {...propsWithoutRefresh}
    />
  )
}

export default LotteryNftCard
