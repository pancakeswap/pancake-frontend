import { request, gql } from 'graphql-request'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'

export const fetchPotteryFinisedRound = async (potteryRoundId: string) => {
  try {
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getUserPotterWithdrawAbleData($roundId: String!) {
          potteryVaults(first: 1, where: { roundId: $roundId }) {
            id
            roundId
            drawDate
            prizePot
            totalPlayers
            txid
            winners
          }
        }
      `,
      { roundId: potteryRoundId },
    )

    const { roundId, drawDate, prizePot, totalPlayers, txid, winners } = response[0]
    return {
      isFetched: false,
      roundId,
      drawDate,
      prizePot,
      totalPlayers,
      txid,
      winners,
    }
  } catch (error) {
    console.error('Failed to fetch pottery finished round data', error)
    return {
      isFetched: false,
      roundId: null,
      drawDate: '',
      prizePot: '',
      totalPlayers: '',
      txid: '',
      winners: [],
    }
  }
}
