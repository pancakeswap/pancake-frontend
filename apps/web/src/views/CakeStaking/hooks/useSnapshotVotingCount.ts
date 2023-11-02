import { useQuery } from '@tanstack/react-query'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'

const getSnapshotCount = async (space: string) => {
  const response: { proposals: { id: string }[] } = await request(
    SNAPSHOT_API,
    gql`
      query Proposals {
        proposals(where: { space_in: "${space}" }) {
          id
        }
      }
    `,
  )
  return response.proposals.length ?? 0
}

const SPACE_ID = 'cakevote.eth'

export const useSnapshotVotingCount = (): number | undefined => {
  const { data } = useQuery(
    ['snapshotVotingCount', SPACE_ID],
    async () => {
      const count = await getSnapshotCount(SPACE_ID)
      return count
    },
    {
      keepPreviousData: true,
    },
  )

  return data
}
