import { getBunnySpecialLotteryContract } from 'utils/contractHelpers'
import { UserRound } from 'state/types'
import { fetchUserTicketsForOneRound } from 'state/lottery/getUserTicketsData'

export interface LotteryNftMintData {
  bunnyId: number | string
  lotteryId: string
  cursor: string
}

export interface NftClaim {
  canClaim: boolean
  mintData: LotteryNftMintData
}

export const NO_CLAIM: NftClaim = {
  canClaim: false,
  mintData: null,
}

export const getLottieClaim = async (
  account: string,
  variationId: number | string,
  lotteryId: string,
): Promise<NftClaim> => {
  const lotteryNftContract = getBunnySpecialLotteryContract()

  if (lotteryId) {
    try {
      const passesContractCheck = await lotteryNftContract.canClaimNft1(account, lotteryId)

      if (passesContractCheck) {
        return {
          canClaim: true,
          mintData: { bunnyId: variationId, lotteryId, cursor: '0' },
        }
      }
    } catch (error) {
      console.error(`Failed to check canClaim for Lottie`, error)
      return NO_CLAIM
    }
  }

  return NO_CLAIM
}

export const getLuckyClaim = async (
  account: string,
  variationId: number | string,
  userRounds: UserRound[],
): Promise<NftClaim> => {
  const lotteryNftContract = getBunnySpecialLotteryContract()

  const claimedWinningRounds = userRounds.filter((round) => round.claimed)
  if (claimedWinningRounds.length > 0) {
    const [winningRound] = claimedWinningRounds
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
}

export const getBallerClaim = async (
  account: string,
  variationId: number | string,
  lotteryId?: string,
): Promise<NftClaim> => {
  const lotteryNftContract = getBunnySpecialLotteryContract()

  try {
    const isWhitelisted = await lotteryNftContract.userWhitelistForNft3(account)
    if (isWhitelisted) {
      try {
        const passesContractCheck = await lotteryNftContract.canClaimNft3(account)
        if (passesContractCheck) {
          return {
            canClaim: true,
            mintData: { bunnyId: variationId, lotteryId, cursor: '0' },
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
}
