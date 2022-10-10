import { request, gql } from 'graphql-request'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'

export const fetchPotteryFinishedRound = async (potteryRoundId: number) => {
  try {
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getPotteryVaultRounds($roundId: Int!) {
          potteryVaultRounds(first: 1, where: { roundId: $roundId }) {
            id
            roundId
            drawDate
            prizePot
            txid
            winners
            vault {
              totalPlayers
              lockDate
            }
          }
        }
      `,
      { roundId: potteryRoundId },
    )

    const { roundId, drawDate, prizePot, vault, txid, winners } = response.potteryVaultRounds[0]
    return {
      isFetched: true,
      roundId,
      drawDate,
      prizePot,
      totalPlayers: vault.totalPlayers,
      txid,
      winners,
      lockDate: vault.lockDate,
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
      lockDate: '',
    }
  }
}
