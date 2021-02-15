export type DataResponse = {
  lotteryNumber: number
  lotteryDate: string
  lotteryNumbers: number[]
  poolSize: number
  burned: number
  contractLink: string
  jackpotTicket: number
  match1Ticket: number | null
  match2Ticket: number
  match3Ticket: number
  match4Ticket: number
  poolJackpot: number
  poolMatch3: number
  poolMatch2: number
  poolMatch1: number | null

  // TODO: Fill in the error type
  error: any
}

/**
 * Get data for a specific lottery
 */
const getLotteryRoundData = async (lotteryNumber: number): Promise<DataResponse> => {
  try {
    const response = await fetch(`https://api.pancakeswap.com/api/singleLottery?lotteryNumber=${lotteryNumber}`)
    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(error)
  }
}

export default getLotteryRoundData
