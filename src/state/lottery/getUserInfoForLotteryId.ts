import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { LotteryRound, UserTicketsResponse, LotteryRoundUserTickets, LotteryResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { useMemo } from 'react'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'

const lotteryContract = getLotteryV2Contract()
export const TICKET_LIMIT_PER_REQUEST = 2500

export const processRawTicketsResponse = (ticketsResponse: UserTicketsResponse): LotteryTicket[] => {
  const [ticketIds, ticketNumbers, ticketStatuses] = ticketsResponse

  if (ticketIds?.length > 0) {
    return ticketIds.map((ticketId, index) => {
      return {
        id: ticketId.toString(),
        number: ticketNumbers[index].toString(),
        status: ticketStatuses[index],
      }
    })
  }
  return []
}

export const viewUserInfoForLotteryId = async (
  account: string,
  lotteryId: string,
  cursor: number,
  perRequestLimit: number,
) => {
  try {
    const data = await lotteryContract.viewUserInfoForLotteryId(account, lotteryId, cursor, perRequestLimit)
    return processRawTicketsResponse(data)
  } catch (error) {
    console.error('viewUserInfoForLotteryId', error)
    return null
  }
}

export const getUserInfoForLotteryId = async (account: string, lotteryId: string): Promise<LotteryTicket[]> => {
  let cursor = 0
  let numReturned = 2500
  const ticketData = []

  while (numReturned === TICKET_LIMIT_PER_REQUEST) {
    // eslint-disable-next-line no-await-in-loop
    const response = await viewUserInfoForLotteryId(account, lotteryId, cursor, TICKET_LIMIT_PER_REQUEST)
    cursor += TICKET_LIMIT_PER_REQUEST
    numReturned = response.length
    ticketData.push(...response)
  }

  return ticketData
}
