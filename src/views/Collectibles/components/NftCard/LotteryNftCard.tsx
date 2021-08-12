import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useGetCurrentLotteryId } from 'state/lottery/hooks'
import { getGraphLotteryUser } from 'state/lottery/getUserLotteryData'
import { UserRound } from 'state/types'
import { fetchUserTicketsForOneRound } from 'state/lottery/getUserTicketsData'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { getBunnySpecialLotteryAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { useBunnySpecialLotteryContract } from 'hooks/useContract'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import NftCard, { NftCardProps } from './index'

interface LotteryNftMintData {
  bunnyId: number | string
  lotteryId: string
  cursor: string
}

const LotteryNftCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const { account } = useWeb3React()
  const { identifier, variationId } = nft
  const lotteryNftContract = useBunnySpecialLotteryContract()
  const lotteryNftContractAddress = getBunnySpecialLotteryAddress()
  const currentLotteryId = useGetCurrentLotteryId()
  const currentLotteryIdNum = parseInt(currentLotteryId)
  const [isClaimable, setIsClaimable] = useState(false)
  const [mintingData, setMintingData] = useState<LotteryNftMintData>(null)
  const [publicContractData, setPublicContractData] = useState(null)
  const [userRounds, setUserRounds] = useState<UserRound[]>(null)

  // TO BE REPLACED BY NODE DATA
  const startLotteryRound = 8
  const finalLotteryRound = 18
  // Also fetch userWhitelistForNft3 for Nft3 check

  const handleClaim = async () => {
    const { bunnyId, lotteryId, cursor } = mintingData
    const response: ethers.providers.TransactionResponse = await lotteryNftContract.mintNFT(bunnyId, lotteryId, cursor)
    await response.wait()
    return response
  }

  useEffect(() => {
    const getUserData = async () => {
      const lotteryIdsArray = []
      for (let i = startLotteryRound; i <= finalLotteryRound; i++) {
        lotteryIdsArray.push(`${i}`)
      }
      const userParticipation = await getGraphLotteryUser(account, undefined, undefined, {
        lottery_in: lotteryIdsArray,
      })
      setUserRounds(userParticipation.rounds)
    }

    const getPublicContractData = async () => {
      const calls = [
        {
          name: 'startLotteryRound',
          address: lotteryNftContractAddress,
          params: [],
        },
        {
          name: 'finalLotteryRound',
          address: lotteryNftContractAddress,
          params: [],
        },
      ]

      try {
        const [[startRound], [finalRound]] = await multicallv2(bunnySpecialLotteryAbi, calls)
        const startRoundAsString = ethersToSerializedBigNumber(startRound)
        const finalRoundAsString = ethersToSerializedBigNumber(finalRound)

        debugger // eslint-disable-line
        setPublicContractData({ startLotteryRound: startRoundAsString, finalLotteryRound: finalRoundAsString })
      } catch (error) {
        console.error('Failed to fetch public lottery nft data', error)
      }
    }

    if (account) {
      if (!publicContractData) {
        getPublicContractData()
      }
      if (currentLotteryIdNum && !userRounds) {
        getUserData()
      }
    }
  }, [currentLotteryIdNum, lotteryNftContract, userRounds, publicContractData, lotteryNftContractAddress, account])

  useEffect(() => {
    // User participated in ANY lottery between 8 & 18
    const canClaimLottie = () => {
      // check hasClaimed(address[variationId])

      if (!userRounds) {
        setIsClaimable(false)
        return
      }
      if (userRounds) {
        setIsClaimable(true)
        setMintingData({ bunnyId: variationId, lotteryId: userRounds[0].lotteryId, cursor: '0' })
      }
    }

    // User WON a lottery between rounds 8 & 18
    const canClaimLucky = async () => {
      if (!userRounds) {
        setIsClaimable(false)
        return
      }
      const claimedRounds = userRounds.filter((round) => round.claimed)
      if (claimedRounds.length > 0) {
        const winningRound = claimedRounds[0]
        const userTickets = await fetchUserTicketsForOneRound(account, winningRound.lotteryId)
        const claimedTickets = userTickets.filter((ticket) => ticket.status)
        const cursor = userTickets.indexOf(claimedTickets[0])

        setIsClaimable(true)
        setMintingData({ bunnyId: variationId, lotteryId: winningRound.lotteryId, cursor: cursor.toString() })
      }
    }

    const canClaimBaller = () => {
      // userWhitelistForNft3

      if (!userRounds) {
        setIsClaimable(false)
        return
      }
      console.log('baller')
    }

    /**
     * A map of NFT bunny Ids to canClaim functions
     * [identifier]: function
     */
    const canClaimMap = {
      lottie: canClaimLottie,
      lucky: canClaimLucky,
      baller: canClaimBaller,
    }

    if (account) {
      canClaimMap[identifier]()
    }
  }, [account, identifier, variationId, startLotteryRound, finalLotteryRound, userRounds, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default LotteryNftCard
