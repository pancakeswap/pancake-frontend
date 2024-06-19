import { useQuery } from '@tanstack/react-query'
import { Proposal, ProposalState } from 'state/types'
import { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { ADMINS, PANCAKE_SPACE } from 'views/Voting/config'
import { multiQuery } from 'utils/infoQueryHelpers'

type Proposals = Partial<{
  [key in ProposalState]: Proposal[]
}>

export const getCoreProposal = async (types: ProposalState[]): Promise<Proposals> => {
  return (
    (await multiQuery(
      (subqueries) => gql`
      query getProposals {
        ${subqueries}
      }
    `,
      types.map(
        (type) => `
          ${type}:proposals(first: 1, skip: 0, where: { author_in: ${JSON.stringify(
          ADMINS,
        )}, space_in: "${PANCAKE_SPACE}", state: "${type}" }) {
          id
        }
    `,
      ),
      SNAPSHOT_API,
    )) ||
    types.reduce((defaultProposals, state) => {
      return {
        ...defaultProposals,
        [state]: [],
      }
    }, {} as Proposals)
  )
}

export const useVotingStatus = () => {
  const { data: votingStatus = null } = useQuery({
    queryKey: ['anyActiveSoonCoreProposals'],

    queryFn: async () => {
      const proposals = await getCoreProposal([ProposalState.ACTIVE, ProposalState.PENDING])
      if (proposals?.active?.length) {
        return 'vote_now'
      }
      if (proposals?.pending?.length) {
        return 'soon'
      }
      return null
    },

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  return votingStatus
}
