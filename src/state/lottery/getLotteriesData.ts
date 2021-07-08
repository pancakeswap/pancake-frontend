import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryRoundGraphEntity, LotteryResponse } from 'state/types'
import { getRoundIdsArray, fetchMultipleLotteries } from './helpers'

const applyNodeDataToLotteriesGraphResponse = (
  nodeData: LotteryResponse[],
  graphRespose: LotteryRoundGraphEntity[],
): LotteryRoundGraphEntity[] => {
  const mergedResponse = graphRespose.map((graphRound, index) => {
    const nodeRound = nodeData[index]
    if (nodeRound) {
      // if isLoading === true, there has been an error - return graphRound
      if (!nodeRound.isLoading) {
        return {
          endTime: nodeRound.endTime,
          finalNumber: nodeRound.finalNumber.toString(),
          startTime: nodeRound.startTime,
          status: nodeRound.status,
          id: graphRound.id,
          ticketPrice: graphRound.ticketPrice,
          totalTickets: graphRound.totalTickets,
          totalUsers: graphRound.totalTickets,
          winningTickets: graphRound.totalTickets,
        }
      }
      return graphRound
    }
    return graphRound
  })
  return mergedResponse
}

const getLotteriesData = async (currentLotteryId: string): Promise<LotteryRoundGraphEntity[]> => {
  const idsForNodesCall = getRoundIdsArray(currentLotteryId)
  const nodeData = await fetchMultipleLotteries(idsForNodesCall)
  const graphResponse = await getGraphLotteries()
  const mergedData = applyNodeDataToLotteriesGraphResponse(nodeData, graphResponse)
  return mergedData
}

const getGraphLotteries = async (): Promise<LotteryRoundGraphEntity[]> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getLotteries {
        lotteries(first: 100, orderDirection: desc, orderBy: block) {
          id
          totalUsers
          totalTickets
          winningTickets
          status
          finalNumber
          startTime
          endTime
          ticketPrice
        }
      }
    `,
  )

  const { lotteries } = response
  return lotteries
}

export default getLotteriesData
