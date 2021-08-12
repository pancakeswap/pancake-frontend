import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGetCurrentLotteryId } from 'state/lottery/hooks'
import { getGraphLotteryUser } from 'state/lottery/getUserLotteryData'
import { UserRound } from 'state/types'
import { fetchUserTicketsForOneRound } from 'state/lottery/getUserTicketsData'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { getBunnySpecialLotteryAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { useBunnySpecialLotteryContract } from 'hooks/useContract'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import Nfts from 'config/constants/nfts'

export interface LotteryNftMintData {
  bunnyId: number | string
  lotteryId: string
  cursor: string
}

interface PublicContractData {
  startLotteryRound: string
  finalLotteryRound: string
}

interface NftClaim {
  canClaim: boolean
  mintData: LotteryNftMintData
}

const NO_CLAIM: NftClaim = {
  canClaim: false,
  mintData: null,
}

const useBunnySpecialLottery = (): {
  canClaimLottie: () => Promise<NftClaim>
  canClaimLucky: () => Promise<NftClaim>
  canClaimBaller: () => Promise<NftClaim>
} => {
  const { account } = useWeb3React()
  const lotteryNftContract = useBunnySpecialLotteryContract()
  const lotteryNftContractAddress = getBunnySpecialLotteryAddress()
  const currentLotteryId = useGetCurrentLotteryId()
  const currentLotteryIdNum = parseInt(currentLotteryId)
  const [publicContractData, setPublicContractData] = useState<PublicContractData>(null)
  const [userRounds, setUserRounds] = useState<UserRound[]>(null)

  useEffect(() => {
    setUserRounds(null)
  }, [account])

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

  // If user has not entered the right rounds, or has already claimed NFT - generic checks false
  const genericClaimChecks = useCallback(
    async (variationId: number | string): Promise<boolean> => {
      let hasClaimed = false
      if (!userRounds) {
        return false
      }
      try {
        hasClaimed = await lotteryNftContract.hasClaimed(account, variationId)
      } catch (error) {
        console.error(`Failed to check hasClaimed for id ${variationId}`, error)
      }
      if (hasClaimed) {
        return false
      }
      return true
    },
    [account, lotteryNftContract, userRounds],
  )

  const canClaimLottie = useCallback(async (): Promise<NftClaim> => {
    const { variationId } = Nfts.find((nft) => nft.identifier === 'lottie')
    const passesGenericChecks = await genericClaimChecks(variationId)
    const participatedRound = userRounds && userRounds[0]

    if (passesGenericChecks && participatedRound) {
      try {
        const passesContractCheck = await lotteryNftContract.canClaimNft1(account, participatedRound.lotteryId)
        if (passesContractCheck) {
          return {
            canClaim: true,
            mintData: { bunnyId: variationId, lotteryId: participatedRound.lotteryId, cursor: '0' },
          }
        }
      } catch (error) {
        console.error(`Failed to check canClaim for Lottie`, error)
        return NO_CLAIM
      }
    }
    return NO_CLAIM
  }, [account, genericClaimChecks, lotteryNftContract, userRounds])

  const canClaimLucky = useCallback(async (): Promise<NftClaim> => {
    const { variationId } = Nfts.find((nft) => nft.identifier === 'lucky')
    const passesGenericChecks = await genericClaimChecks(variationId)
    if (!passesGenericChecks) {
      return NO_CLAIM
    }

    const claimedWinningRounds = userRounds.filter((round) => round.claimed)
    if (claimedWinningRounds.length > 0) {
      const winningRound = claimedWinningRounds[0]
      const userTickets = await fetchUserTicketsForOneRound(account, winningRound.lotteryId)
      const claimedTickets = userTickets.filter((ticket) => ticket.status)
      const winningTicketCursor = userTickets.indexOf(claimedTickets[0])
      // No winning ticket found for an expected winning round. Can happen when switching accounts.
      if (winningTicketCursor < 0) {
        return NO_CLAIM
      }
      try {
        const passesContractCheck = await lotteryNftContract.canClaimNft2(
          account,
          winningRound.lotteryId,
          winningTicketCursor.toString(),
        )
        if (passesContractCheck) {
          return {
            canClaim: true,
            mintData: {
              bunnyId: variationId,
              lotteryId: winningRound.lotteryId,
              cursor: winningTicketCursor.toString(),
            },
          }
        }
      } catch (error) {
        console.error(`Failed to check canClaim for Lucky`, error)
        return NO_CLAIM
      }
    }
    return NO_CLAIM
  }, [account, genericClaimChecks, lotteryNftContract, userRounds])

  const canClaimBaller = useCallback(async (): Promise<NftClaim> => {
    const { variationId } = Nfts.find((nft) => nft.identifier === 'baller')
    const passesGenericChecks = await genericClaimChecks(variationId)
    if (!passesGenericChecks) {
      return NO_CLAIM
    }

    try {
      const isWhitelisted = await lotteryNftContract.userWhitelistForNft3(account)
      if (isWhitelisted) {
        try {
          const passesContractCheck = await lotteryNftContract.canClaimNft3(account)
          if (passesContractCheck) {
            return {
              canClaim: true,
              mintData: { bunnyId: variationId, lotteryId: userRounds[0].lotteryId, cursor: '0' },
            }
          }
        } catch (error) {
          console.error(`Failed to check canClaim for Baller`, error)
          return NO_CLAIM
        }
      }
    } catch (error) {
      console.error(`Failed to check whitelist for ${account}`, error)
      return NO_CLAIM
    }
    return NO_CLAIM
  }, [account, genericClaimChecks, lotteryNftContract, userRounds])

  return { canClaimLottie, canClaimLucky, canClaimBaller }
}

export default useBunnySpecialLottery
