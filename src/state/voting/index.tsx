import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { merge } from 'lodash'
import { Proposal, ProposalState, VotingStateLoadingStatus, VotingState, Vote, State } from 'state/types'
import { getAllVotes, getProposal, getProposals, getVoteVerificationStatuses } from './helpers'

const initialState: VotingState = {
  proposalLoadingStatus: VotingStateLoadingStatus.INITIAL,
  proposals: {},
  voteLoadingStatus: VotingStateLoadingStatus.INITIAL,
  votes: {},
}

// Thunks
export const fetchProposals = createAsyncThunk<Proposal[], { first?: number; skip?: number; state?: ProposalState }>(
  'voting/fetchProposals',
  async ({ first, skip = 0, state = ProposalState.ACTIVE }) => {
    const response = await getProposals(first, skip, state)
    return response
  },
)

export const fetchProposal = createAsyncThunk<Proposal, string>('voting/fetchProposal', async (proposalId) => {
  const response = await getProposal(proposalId)
  return response
})

export const fetchVotes = createAsyncThunk<
  { votes: Vote[]; proposalId: string },
  { proposalId: string; block?: number }
>('voting/fetchVotes', async ({ proposalId, block }) => {
  const response = await getAllVotes(proposalId, block)
  return { votes: response, proposalId }
})

export const verifyVotes = createAsyncThunk<
  { results: { [key: string]: boolean }; proposalId: string },
  { proposalId: string; snapshot?: string },
  { state: State }
>('voting/verifyVotes', async ({ proposalId, snapshot }, { getState }) => {
  const state = getState()
  const proposalVotes = state.voting.votes[proposalId]
  const response = await getVoteVerificationStatuses(proposalVotes, Number(snapshot))
  return { results: response, proposalId }
})

export const votingSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Verify Votes
    builder.addCase(verifyVotes.fulfilled, (state, action) => {
      const { proposalId, results } = action.payload

      if (state.votes[proposalId]) {
        state.votes[proposalId] = state.votes[proposalId].map((vote) => {
          return {
            ...vote,
            _inValid: results[vote.id] === false,
          }
        })
      }
    })

    // Fetch Proposals
    builder.addCase(fetchProposals.pending, (state) => {
      state.proposalLoadingStatus = VotingStateLoadingStatus.LOADING
    })
    builder.addCase(fetchProposals.fulfilled, (state, action) => {
      const proposals = action.payload.reduce((accum, proposal) => {
        return {
          ...accum,
          [proposal.id]: proposal,
        }
      }, {})

      state.proposals = merge({}, state.proposals, proposals)
      state.proposalLoadingStatus = VotingStateLoadingStatus.IDLE
    })

    // Fetch Proposal
    builder.addCase(fetchProposal.pending, (state) => {
      state.proposalLoadingStatus = VotingStateLoadingStatus.LOADING
    })
    builder.addCase(fetchProposal.fulfilled, (state, action) => {
      state.proposals[action.payload.id] = action.payload
      state.proposalLoadingStatus = VotingStateLoadingStatus.IDLE
    })

    // Fetch Votes
    builder.addCase(fetchVotes.pending, (state) => {
      state.voteLoadingStatus = VotingStateLoadingStatus.LOADING
    })
    builder.addCase(fetchVotes.fulfilled, (state, action) => {
      const { votes, proposalId } = action.payload

      state.votes = {
        ...state.votes,
        [proposalId]: votes,
      }
      state.voteLoadingStatus = VotingStateLoadingStatus.IDLE
    })
  },
})

export default votingSlice.reducer
