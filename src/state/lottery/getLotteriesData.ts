import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryRoundGraphEntity, LotteryResponse } from 'state/types'
import { getRoundIdsArray, fetchMultipleLotteries } from './helpers'

export const MAX_LOTTERIES_REQUEST_SIZE = 100

/* eslint-disable camelcase */
type LotteriesWhere = { id_in?: string[] }

const applyNodeDataToLotteriesGraphResponse = (
  nodeData: LotteryResponse[],
  graphResponse: LotteryRoundGraphEntity[],
): LotteryRoundGraphEntity[] => {
  //   If no graph response - return node data
  if (graphResponse.length === 0) {
    return nodeData.map((nodeRound) => {
      return {
        endTime: nodeRound.endTime,
        finalNumber: nodeRound.finalNumber.toString(),
        startTime: nodeRound.startTime,
        status: nodeRound.status,
        id: nodeRound.lotteryId.toString(),
        ticketPrice: nodeRound.priceTicketInCake,
        totalTickets: '',
        totalUsers: '',
        winningTickets: '',
      }
    })
  }

  //   Else if there is a graph response - merge with node data where node data is more reliable
  const mergedResponse = graphResponse.map((graphRound, index) => {
    const nodeRound = nodeData[index]
    // if there is node data for this index, overwrite graph data. Otherwise - return graph data.
    if (nodeRound) {
      // if isLoading === true, there has been a node error - return graphRound
      if (!nodeRound.isLoading) {
        return {
          endTime: nodeRound.endTime,
          finalNumber: nodeRound.finalNumber.toString(),
          startTime: nodeRound.startTime,
          status: nodeRound.status,
          id: graphRound.id,
          ticketPrice: graphRound.ticketPrice,
          totalTickets: graphRound.totalTickets,
          totalUsers: graphRound.totalUsers,
          winningTickets: graphRound.winningTickets,
        }
      }
      return graphRound
    }
    return graphRound
  })
  return mergedResponse
}

export const getGraphLotteries = async (
  first = MAX_LOTTERIES_REQUEST_SIZE,
  skip = 0,
  where: LotteriesWhere = {},
): Promise<LotteryRoundGraphEntity[]> => {
  try {
    const response = await request(
      GRAPH_API_LOTTERY,
      gql`
        query getLotteries($first: Int!, $skip: Int!, $where: Lottery_filter) {
          lotteries(first: $first, skip: $skip, where: $where, orderDirection: desc, orderBy: block) {
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
      { skip, first, where },
    )
    return response.lotteries
  } catch (error) {
    console.error(error)
    return []
  }
}

const getLotteriesData = async (currentLotteryId: string): Promise<LotteryRoundGraphEntity[]> => {
  const idsForNodesCall = getRoundIdsArray(currentLotteryId)
  const nodeData = await fetchMultipleLotteries(idsForNodesCall)
  const graphResponse = await getGraphLotteries()
  const mergedData = applyNodeDataToLotteriesGraphResponse(nodeData, graphResponse)
  return mergedData
}

export default getLotteriesData
