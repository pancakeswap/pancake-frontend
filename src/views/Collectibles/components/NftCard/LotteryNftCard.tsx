import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { fetchWalletNfts } from 'state/collectibles'
import { useGetCurrentLotteryId } from 'state/lottery/hooks'
import { getGraphLotteryUser } from 'state/lottery/getUserLotteryData'
import { UserRound } from 'state/types'
import { fetchUserTicketsForOneRound } from 'state/lottery/getUserTicketsData'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { getBunnySpecialLotteryAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import useLastUpdated from 'hooks/useLastUpdated'
import { useBunnySpecialLotteryContract } from 'hooks/useContract'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import NftCard, { NftCardProps } from './index'

interface LotteryNftMintData {
  bunnyId: number | string
  lotteryId: string
  cursor: string
}

interface PublicContractData {
  startLotteryRound: string
  finalLotteryRound: string
}

const LotteryNftCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const { account } = useWeb3React()
  const { identifier, variationId } = nft
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const dispatch = useAppDispatch()
  const lotteryNftContract = useBunnySpecialLotteryContract()
  const lotteryNftContractAddress = getBunnySpecialLotteryAddress()
  const currentLotteryId = useGetCurrentLotteryId()
  const currentLotteryIdNum = parseInt(currentLotteryId)
  const [isClaimable, setIsClaimable] = useState(false)
  const [mintingData, setMintingData] = useState<LotteryNftMintData>(null)
  const [publicContractData, setPublicContractData] = useState<PublicContractData>(null)
  const [userRounds, setUserRounds] = useState<UserRound[]>(null)

  useEffect(() => {
    setUserRounds(null)
  }, [account])

  const handleClaim = async () => {
    const { bunnyId, lotteryId, cursor } = mintingData
    const response: ethers.providers.TransactionResponse = await lotteryNftContract.mintNFT(bunnyId, lotteryId, cursor)
    return response
  }

  const refresh = async () => {
    dispatch(fetchWalletNfts(account))
    setLastUpdated()
  }

  useEffect(() => {
    const getUserData = async () => {
      const { startLotteryRound, finalLotteryRound } = publicContractData
      const startLotteryRoundInt = parseInt(startLotteryRound)
      const finalLotteryRoundInt = parseInt(finalLotteryRound)

      const lotteryIdsArray = []
      for (let i = startLotteryRoundInt; i <= finalLotteryRoundInt; i++) {
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

        setPublicContractData({ startLotteryRound: startRoundAsString, finalLotteryRound: finalRoundAsString })
      } catch (error) {
        console.error('Failed to fetch public lottery nft data', error)
      }
    }

    if (account) {
      if (!publicContractData) {
        getPublicContractData()
      }
      if (currentLotteryIdNum && publicContractData && !userRounds) {
        getUserData()
      }
    }
  }, [currentLotteryIdNum, userRounds, publicContractData, lotteryNftContractAddress, account])

  useEffect(() => {
    const genericClaimChecks = async () => {
      let hasClaimed = false
      try {
        hasClaimed = await lotteryNftContract.hasClaimed(account, variationId)
      } catch (error) {
        console.error(`Failed to check hasClaimed for ${identifier}`, error)
      }
      // If user has not entered rounds in range, or has already claimed NFT - generic checks fail
      if (!userRounds || hasClaimed) {
        return false
      }
      return true
    }

    const canClaimLottie = async () => {
      const passesGenericChecks = await genericClaimChecks()
      if (passesGenericChecks) {
        try {
          const passesContractCheck = await lotteryNftContract.canClaimNft1(account, userRounds[0].lotteryId)
          if (passesContractCheck) {
            setIsClaimable(true)
            setMintingData({ bunnyId: variationId, lotteryId: userRounds[0].lotteryId, cursor: '0' })
          }
        } catch (error) {
          setIsClaimable(false)
          console.error(`Failed to check canClaim for ${identifier}`, error)
        }
      }
    }

    const canClaimLucky = async () => {
      const passesGenericChecks = await genericClaimChecks()
      if (!passesGenericChecks) {
        setIsClaimable(false)
        return
      }
      const claimedWinningRounds = userRounds.filter((round) => round.claimed)
      if (claimedWinningRounds.length > 0) {
        const winningRound = claimedWinningRounds[0]
        const userTickets = await fetchUserTicketsForOneRound(account, winningRound.lotteryId)
        const claimedTickets = userTickets.filter((ticket) => ticket.status)
        const winningTicketCursor = userTickets.indexOf(claimedTickets[0])
        // No winning ticket found for an expected winning round. Can happen when switching accounts.
        if (winningTicketCursor < 0) {
          setIsClaimable(false)
          return
        }
        try {
          const passesContractCheck = await lotteryNftContract.canClaimNft2(
            account,
            winningRound.lotteryId,
            winningTicketCursor.toString(),
          )
          if (passesContractCheck) {
            setIsClaimable(true)
            setMintingData({
              bunnyId: variationId,
              lotteryId: winningRound.lotteryId,
              cursor: winningTicketCursor.toString(),
            })
          }
        } catch (error) {
          setIsClaimable(false)
          console.error(`Failed to check canClaim for ${identifier}`, error)
        }
      }
    }

    const canClaimBaller = async () => {
      const passesGenericChecks = await genericClaimChecks()
      if (!passesGenericChecks) {
        setIsClaimable(false)
        return
      }
      try {
        const isWhitelisted = await lotteryNftContract.userWhitelistForNft3(account)
        if (isWhitelisted) {
          try {
            const passesContractCheck = await lotteryNftContract.canClaimNft3(account)
            if (passesContractCheck) {
              setIsClaimable(true)
              setMintingData({ bunnyId: variationId, lotteryId: userRounds[0].lotteryId, cursor: '0' })
            }
          } catch (error) {
            setIsClaimable(false)
            console.error(`Failed to check canClaim for ${identifier}`, error)
          }
        }
      } catch (error) {
        setIsClaimable(false)
        console.error(`Failed to check whitelist for ${account}`, error)
      }
    }

    /**
     * A map of NFT identifiers to canClaim functions
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
  }, [account, identifier, variationId, userRounds, lotteryNftContract, lastUpdated, setIsClaimable])

  return <NftCard nft={nft} canClaim={isClaimable} onClaim={handleClaim} refresh={refresh} {...props} />
}

export default LotteryNftCard
