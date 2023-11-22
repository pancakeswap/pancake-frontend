import { useQuery } from '@tanstack/react-query'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'

const getSnapshotCount = async (space: string) => {
  const response: { space?: { proposalsCount: number } } = await request(
    SNAPSHOT_API,
    gql`
      query ProposalsCount {
        space(id: "${space}") {
          proposalsCount
        }
      }
    `,
  )
  return response.space?.proposalsCount ?? 0
}

const SPACE_ID = 'cakevote.eth'

export const useSnapshotProposalsCount = (): number | undefined => {
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
